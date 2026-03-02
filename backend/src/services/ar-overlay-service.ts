import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

export interface AROverlay {
  type: 'text' | 'arrow' | 'circle' | 'highlight';
  position: { x: number; y: number };
  content?: string;
  color?: string;
  size?: number;
}

export interface VisualGuidance {
  overlays: AROverlay[];
  instructions: string;
  priority: 'high' | 'medium' | 'low';
}

export class AROverlayService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      logger.info('AR Overlay service initialized');
    } else {
      logger.warn('AR Overlay service running in demo mode');
    }
  }

  async generateVisualGuidance(
    skill: string,
    context: string,
    language: string
  ): Promise<VisualGuidance> {
    if (!this.genAI || !this.model) {
      return this.getDemoGuidance(skill, language);
    }

    try {
      const prompt = `
You are generating AR visual guidance for ${skill}.
Context: ${context}

Generate specific visual overlays to help the user. Include:
1. Text overlays with instructions
2. Directional arrows
3. Highlights for important areas
4. Circles around key points

Respond in ${language === 'id' ? 'Bahasa Indonesia' : language}.

Format as JSON:
{
  "overlays": [
    {
      "type": "text|arrow|circle|highlight",
      "position": {"x": 0-100, "y": 0-100},
      "content": "text",
      "color": "hex",
      "size": number
    }
  ],
  "instructions": "step-by-step guidance",
  "priority": "high|medium|low"
}
`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Parse JSON response
      try {
        const guidance = JSON.parse(response);
        return guidance;
      } catch {
        // Fallback if JSON parsing fails
        return this.getDemoGuidance(skill, language);
      }
    } catch (error) {
      logger.error('Failed to generate visual guidance', { error });
      return this.getDemoGuidance(skill, language);
    }
  }

  private getDemoGuidance(skill: string, language: string): VisualGuidance {
    const guidance: Record<string, VisualGuidance> = {
      cooking: {
        overlays: [
          {
            type: 'text',
            position: { x: 10, y: 10 },
            content: language === 'id' ? 'Aduk perlahan' : 'Stir gently',
            color: '#FF6B6B',
            size: 20,
          },
          {
            type: 'arrow',
            position: { x: 50, y: 50 },
            color: '#4ECDC4',
            size: 30,
          },
        ],
        instructions: language === 'id'
          ? 'Aduk bahan dengan gerakan melingkar yang halus'
          : 'Stir ingredients in a gentle circular motion',
        priority: 'high',
      },
      repair: {
        overlays: [
          {
            type: 'circle',
            position: { x: 50, y: 50 },
            color: '#FFE66D',
            size: 40,
          },
          {
            type: 'text',
            position: { x: 50, y: 80 },
            content: language === 'id' ? 'Periksa area ini' : 'Check this area',
            color: '#FF6B6B',
            size: 16,
          },
        ],
        instructions: language === 'id'
          ? 'Periksa komponen yang ditandai untuk kerusakan'
          : 'Inspect the marked component for damage',
        priority: 'high',
      },
      farming: {
        overlays: [
          {
            type: 'highlight',
            position: { x: 30, y: 40 },
            color: '#95E1D3',
            size: 50,
          },
          {
            type: 'text',
            position: { x: 30, y: 90 },
            content: language === 'id' ? 'Tanaman sehat' : 'Healthy plant',
            color: '#4ECDC4',
            size: 18,
          },
        ],
        instructions: language === 'id'
          ? 'Tanaman ini dalam kondisi baik, lanjutkan perawatan rutin'
          : 'This plant is healthy, continue regular care',
        priority: 'medium',
      },
      crafts: {
        overlays: [
          {
            type: 'arrow',
            position: { x: 20, y: 50 },
            color: '#FF6B6B',
            size: 35,
          },
          {
            type: 'text',
            position: { x: 60, y: 50 },
            content: language === 'id' ? 'Gerakkan ke arah ini' : 'Move in this direction',
            color: '#FFE66D',
            size: 16,
          },
        ],
        instructions: language === 'id'
          ? 'Ikuti panah untuk teknik yang benar'
          : 'Follow the arrow for correct technique',
        priority: 'high',
      },
    };

    return guidance[skill] || guidance.cooking;
  }

  async generateStepByStepGuide(
    skill: string,
    task: string,
    language: string
  ): Promise<{ steps: string[]; images: string[] }> {
    if (!this.genAI || !this.model) {
      return this.getDemoSteps(skill, language);
    }

    try {
      const prompt = `
Generate a step-by-step visual guide for ${task} in ${skill}.
Provide 3-5 clear steps with visual descriptions.
Respond in ${language === 'id' ? 'Bahasa Indonesia' : language}.

Format as JSON:
{
  "steps": ["step 1", "step 2", ...],
  "images": ["visual description 1", "visual description 2", ...]
}
`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      try {
        return JSON.parse(response);
      } catch {
        return this.getDemoSteps(skill, language);
      }
    } catch (error) {
      logger.error('Failed to generate step-by-step guide', { error });
      return this.getDemoSteps(skill, language);
    }
  }

  private getDemoSteps(skill: string, language: string): { steps: string[]; images: string[] } {
    const guides: Record<string, { steps: string[]; images: string[] }> = {
      cooking: {
        steps: language === 'id'
          ? [
              'Persiapkan semua bahan dan peralatan',
              'Panaskan wajan dengan api sedang',
              'Masukkan bahan dan aduk perlahan',
              'Masak sampai matang sempurna',
            ]
          : [
              'Prepare all ingredients and tools',
              'Heat the pan on medium heat',
              'Add ingredients and stir gently',
              'Cook until fully done',
            ],
        images: ['ingredients', 'pan', 'stirring', 'finished dish'],
      },
      repair: {
        steps: language === 'id'
          ? [
              'Identifikasi area yang perlu diperbaiki',
              'Siapkan alat yang diperlukan',
              'Lakukan perbaikan dengan hati-hati',
              'Uji hasil perbaikan',
            ]
          : [
              'Identify the area needing repair',
              'Prepare necessary tools',
              'Perform the repair carefully',
              'Test the repair',
            ],
        images: ['identification', 'tools', 'repair', 'testing'],
      },
    };

    return guides[skill] || guides.cooking;
  }
}
