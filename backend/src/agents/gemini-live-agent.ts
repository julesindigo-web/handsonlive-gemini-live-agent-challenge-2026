import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';
import { RAGService } from '../services/rag-service';
import { AgentMemoryService } from '../services/agent-memory-service';

export interface LiveAgentConfig {
  apiKey: string;
  model: string;
  systemInstruction: string;
}

export interface VideoFrame {
  data: Buffer;
  timestamp: number;
}

export interface AudioChunk {
  data: Buffer;
  timestamp: number;
}

export interface AgentResponse {
  text?: string;
  audio?: Buffer;
  visualGuidance?: string;
  corrections?: string[];
}

export class GeminiLiveAgent {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private ragService: RAGService;
  private sessionHistory: any[] = [];
  private memoryService: AgentMemoryService | undefined;

  constructor(
    private skill: string,
    private language: string,
    ragService?: RAGService,
    memoryService?: AgentMemoryService
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      logger.info('GeminiLiveAgent initialized with API');
    } else {
      logger.warn('GeminiLiveAgent running in demo mode (no GEMINI_API_KEY)');
    }

    this.ragService = ragService || new RAGService();
    this.memoryService = memoryService;
  }

  async startSession(userId: string, skill: string, language: string): Promise<void> {
    try {
      logger.info('Starting Gemini Live session', { userId, skill, language });
      
      if (this.genAI && this.model) {
        const systemPrompt = this.buildSystemPrompt(skill, language);
        this.model = this.genAI.getGenerativeModel({
          model: 'gemini-2.0-flash-exp',
          systemInstruction: systemPrompt,
        });
      }

      this.sessionHistory = [];
      logger.info('Gemini Live session started successfully');
    } catch (error) {
      logger.error('Failed to start session', { error });
      throw error;
    }
  }

  async processVideoFrame(_frame: { data: Buffer; timestamp: number }): Promise<{ text: string }> {
    if (!this.genAI || !this.model) {
      return this.getDemoResponse('video_analysis');
    }

    try {
      // Get relevant context from RAG
      const ragContext = await this.ragService.search(
        'How to perform this skill correctly',
        this.skill,
        2
      );

      const contextText = ragContext
        .map((doc: any) => doc.content)
        .join('\n\n');

      const prompt = `
You are a hands-on skills coach for ${this.skill}. 
Use the following knowledge base to guide the user:

${contextText}

Provide specific, actionable feedback on the user's technique.
Be encouraging but precise.
Respond in ${this.language === 'id' ? 'Bahasa Indonesia' : this.language}.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Save to memory if available
      if (this.memoryService && this.skill) {
        // TODO: Add session ID and save message
      }

      logger.debug('Video frame processed', { skill: this.skill });

      return { text };
    } catch (error) {
      logger.error('Failed to process video frame', { error });
      throw error;
    }
  }

  async processAudioChunk(chunk: { data: Buffer; timestamp: number }): Promise<{ text: string }> {
    if (!this.genAI || !this.model) {
      return this.getDemoResponse('audio_analysis');
    }

    try {
      const prompt = {
        text: 'The user is speaking. Listen and respond naturally.',
        inlineData: {
          data: chunk.data.toString('base64'),
          mimeType: 'audio/wav',
        },
      };

      const result = await this.model.generateContent([prompt]);
      const response = result.response.text();

      this.sessionHistory.push({
        role: 'user',
        parts: [{ inlineData: { ...prompt.inlineData } }],
      });

      this.sessionHistory.push({
        role: 'model',
        parts: [{ text: response }],
      });

      return {
        text: response,
      };
    } catch (error) {
      logger.error('Failed to process audio chunk', { error });
      throw error;
    }
  }

  async handleInterruption(userMessage: string): Promise<AgentResponse> {
    try {
      logger.info('Handling interruption', { message: userMessage });

      const result = await this.model.generateContent([
        ...this.sessionHistory,
        { role: 'user', parts: [{ text: userMessage }] },
      ]);

      const response = result.response.text();

      this.sessionHistory.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });

      this.sessionHistory.push({
        role: 'model',
        parts: [{ text: response }],
      });

      return {
        text: response,
      };
    } catch (error) {
      logger.error('Failed to handle interruption', { error });
      throw error;
    }
  }

  async stopSession(): Promise<void> {
    try {
      logger.info('Stopping Gemini Live session');
      this.sessionHistory = [];
    } catch (error) {
      logger.error('Failed to stop session', { error });
      throw error;
    }
  }

  getSessionHistory(): any[] {
    return this.sessionHistory;
  }

  private buildSystemPrompt(skill: string, language: string): string {
    const languageMap: Record<string, string> = {
      id: 'Indonesian (Bahasa Indonesia)',
      en: 'English',
      es: 'Spanish',
    };

    const lang = languageMap[language] || 'English';

    return `You are HandsOnLive, a patient and expert AI mentor specializing in hands-on practical skills.

Your role:
- You are teaching ${skill} to a learner
- You can see what the learner is doing through their camera
- Provide real-time, constructive feedback in ${lang}
- Be encouraging and patient
- Correct mistakes immediately but kindly
- Adapt to the learner's skill level
- Use simple, clear language
- Provide step-by-step guidance

Communication style:
- Speak naturally and conversationally
- Use short, clear sentences
- Be supportive and motivating
- Acknowledge good technique
- Gently correct errors with specific guidance (e.g., "Cut at a 15-degree angle, not straight down")

Vision capabilities:
- Analyze hand positions and movements
- Identify objects and ingredients
- Detect common mistakes
- Provide spatial guidance (left, right, higher, lower)

Remember:
- You are a mentor, not just an instructor
- Build confidence while ensuring correct technique
- Celebrate small wins
- Make learning enjoyable and accessible`;
  }

  private getDemoResponse(type: string): { text: string } {
    const responses: Record<string, string> = {
      video_analysis: this.language === 'id' 
        ? 'Teknik Anda terlihat bagus! Teruslah berlatih dengan gerakan yang halus dan terkontrol.'
        : 'Your technique looks good! Keep practicing with smooth, controlled movements.',
      audio_analysis: this.language === 'id'
        ? 'Saya mendengarkan. Silakan lanjutkan dengan pertanyaan atau komentar Anda.'
        : 'I am listening. Please continue with your question or comment.',
    };

    return { text: responses[type] || 'Demo response' };
  }
}
