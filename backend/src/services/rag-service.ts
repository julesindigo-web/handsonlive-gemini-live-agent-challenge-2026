import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

interface RAGDocument {
  id: string;
  content: string;
  metadata: {
    skill: string;
    category: string;
    language: string;
  };
  embedding?: number[];
}

export class RAGService {
  private genAI: GoogleGenerativeAI | null = null;
  private documents: RAGDocument[] = [];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      logger.info('RAG service initialized with Gemini API');
    } else {
      logger.warn('RAG service running in demo mode (no GEMINI_API_KEY)');
    }
  }

  async addDocument(document: Omit<RAGDocument, 'embedding'>): Promise<void> {
    if (!this.genAI) {
      // Demo mode: store without embedding
      this.documents.push({ ...document, embedding: undefined });
      return;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'embedding-001' });
      const result = await model.embedContent(document.content);
      const embedding = result.embedding.values;

      this.documents.push({
        ...document,
        embedding,
      });

      logger.debug('Document added to RAG corpus', { id: document.id });
    } catch (error) {
      logger.error('Failed to embed document', { error, id: document.id });
    }
  }

  async search(query: string, skill: string, topK: number = 3): Promise<RAGDocument[]> {
    if (!this.genAI || this.documents.length === 0) {
      // Demo mode: return random documents
      return this.documents
        .filter((doc) => doc.metadata.skill === skill)
        .slice(0, topK);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'embedding-001' });
      const result = await model.embedContent(query);
      const queryEmbedding = result.embedding.values;

      // Calculate cosine similarity
      const similarities = this.documents
        .filter((doc) => doc.metadata.skill === skill)
        .map((doc) => ({
          document: doc,
          similarity: this.cosineSimilarity(queryEmbedding, doc.embedding || []),
        }))
        .filter((item) => item.similarity > 0.5) // Threshold
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK)
        .map((item) => item.document);

      return similarities;
    } catch (error) {
      logger.error('Failed to search documents', { error, query });
      return [];
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
  }

  async initializeSkillKnowledge(skill: string): Promise<void> {
    const skillKnowledge = this.getSkillKnowledge(skill);
    
    for (const doc of skillKnowledge) {
      await this.addDocument(doc);
    }

    logger.info(`Initialized ${skillKnowledge.length} documents for ${skill}`);
  }

  private getSkillKnowledge(skill: string): Omit<RAGDocument, 'embedding'>[] {
    const knowledgeBase: Record<string, Omit<RAGDocument, 'embedding'>[]> = {
      cooking: [
        {
          id: 'cooking-1',
          content: 'Nasi Goreng is a popular Indonesian fried rice dish. Key ingredients: rice, eggs, shallots, garlic, kecap manis (sweet soy sauce), and chili. Technique: Use day-old rice for better texture, stir-fry on high heat.',
          metadata: { skill: 'cooking', category: 'basics', language: 'id' },
        },
        {
          id: 'cooking-2',
          content: 'Proper knife technique: hold knife with pinch grip, curl fingers under on non-dominant hand. Use rocking motion for herbs, slicing motion for vegetables. Always cut away from your body.',
          metadata: { skill: 'cooking', category: 'safety', language: 'id' },
        },
        {
          id: 'cooking-3',
          content: 'Food safety: wash hands before cooking, keep raw and cooked foods separate, cook to proper internal temperatures (165°F/74°C for poultry), refrigerate leftovers within 2 hours.',
          metadata: { skill: 'cooking', category: 'safety', language: 'id' },
        },
      ],
      repair: [
        {
          id: 'repair-1',
          content: 'Motorcycle tire repair: first deflate tire completely, use tire levers to remove bead, inspect for punctures, patch inner tube, reassemble bead, inflate to recommended pressure.',
          metadata: { skill: 'repair', category: 'basics', language: 'id' },
        },
        {
          id: 'repair-2',
          content: 'Electrical safety: always disconnect power before working, use insulated tools, test circuits with multimeter, wear rubber-soled shoes, keep work area dry.',
          metadata: { skill: 'repair', category: 'safety', language: 'id' },
        },
      ],
      farming: [
        {
          id: 'farming-1',
          content: 'Hydroponics basics: maintain pH 5.5-6.5, EC 1.2-2.0 mS/cm, temperature 65-80°F. Nutrients: N-P-K ratio depends on growth stage. Lighting: 12-18 hours for vegetative, 12 hours for flowering.',
          metadata: { skill: 'farming', category: 'basics', language: 'id' },
        },
      ],
      crafts: [
        {
          id: 'crafts-1',
          content: 'Batik making: apply wax resist with canting tool, dye fabric in light colors first, remove wax with boiling water, re-apply wax for darker colors, final dye and remove all wax.',
          metadata: { skill: 'crafts', category: 'basics', language: 'id' },
        },
      ],
    };

    return knowledgeBase[skill] || [];
  }
}
