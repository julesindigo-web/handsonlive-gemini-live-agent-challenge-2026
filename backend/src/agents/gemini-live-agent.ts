import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

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
  private genAI: GoogleGenerativeAI;
  private model: any;
  private config: LiveAgentConfig;
  private sessionHistory: any[] = [];

  constructor(config: LiveAgentConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: config.model,
      systemInstruction: config.systemInstruction,
    });

    logger.info('Gemini Live Agent initialized', { model: config.model });
  }

  async startSession(userId: string, skill: string, language: string): Promise<void> {
    try {
      logger.info('Starting Gemini Live session', { userId, skill, language });
      
      const systemPrompt = this.buildSystemPrompt(skill, language);
      this.model = this.genAI.getGenerativeModel({
        model: this.config.model,
        systemInstruction: systemPrompt,
      });

      this.sessionHistory = [];
      logger.info('Gemini Live session started successfully');
    } catch (error) {
      logger.error('Failed to start session', { error });
      throw error;
    }
  }

  async processVideoFrame(frame: VideoFrame): Promise<AgentResponse> {
    try {
      const prompt = {
        text: 'Analyze this video frame and provide feedback on the technique shown.',
        inlineData: {
          data: frame.data.toString('base64'),
          mimeType: 'image/jpeg',
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
      logger.error('Failed to process video frame', { error });
      throw error;
    }
  }

  async processAudioChunk(chunk: AudioChunk): Promise<AgentResponse> {
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
}
