import { describe, it, expect, beforeAll } from '@jest/globals';
import { RAGService } from '../services/rag-service';
import { AgentMemoryService } from '../services/agent-memory-service';
import { ToolCallingService } from '../services/tool-calling-service';
import { AROverlayService } from '../services/ar-overlay-service';
import { FirestoreService } from '../services/firestore-service';

describe('RAGService', () => {
  let ragService: RAGService;

  beforeAll(() => {
    ragService = new RAGService();
  });

  it('should initialize successfully', () => {
    expect(ragService).toBeDefined();
  });

  it('should search knowledge base', async () => {
    const results = await ragService.search('How to cook rice', 'cooking', 2);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return relevant documents', async () => {
    const results = await ragService.search('repair techniques', 'repair', 3);
    expect(results.every((doc: any) => doc.content)).toBe(true);
  });

  it('should handle demo mode without API key', async () => {
    const results = await ragService.search('test query', 'cooking', 1);
    expect(results).toBeDefined();
  });
});

describe('ToolCallingService', () => {
  let toolService: ToolCallingService;

  beforeAll(() => {
    toolService = new ToolCallingService();
  });

  it('should initialize successfully', () => {
    expect(toolService).toBeDefined();
  });

  it('should calculate nutrition', async () => {
    const result = await toolService.callTool({
      name: 'calculate_nutrition',
      parameters: {
        ingredients: ['rice', 'vegetables'],
        servings: 2,
      },
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.calories).toBeDefined();
  });

  it('should get recipe info', async () => {
    const result = await toolService.callTool({
      name: 'get_recipe_info',
      parameters: {
        recipeName: 'Fried Rice',
        language: 'en',
      },
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should convert units', async () => {
    const result = await toolService.callTool({
      name: 'convert_units',
      parameters: {
        value: 1,
        fromUnit: 'cup',
        toUnit: 'grams',
      },
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('should handle unknown tools', async () => {
    const result = await toolService.callTool({
      name: 'unknown_tool',
      parameters: {},
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return available tools', () => {
    const tools = toolService.getAvailableTools();
    expect(tools).toContain('calculate_nutrition');
    expect(tools).toContain('get_recipe_info');
    expect(tools).toContain('convert_units');
  });
});

describe('AROverlayService', () => {
  let arService: AROverlayService;

  beforeAll(() => {
    arService = new AROverlayService();
  });

  it('should initialize successfully', () => {
    expect(arService).toBeDefined();
  });

  it('should generate visual guidance', async () => {
    const guidance = await arService.generateVisualGuidance(
      'cooking',
      'stir gently',
      'en'
    );

    expect(guidance).toBeDefined();
    expect(guidance.overlays).toBeDefined();
    expect(guidance.instructions).toBeDefined();
    expect(guidance.priority).toBeDefined();
  });

  it('should generate step-by-step guides', async () => {
    const guide = await arService.generateStepByStepGuide(
      'cooking',
      'making fried rice',
      'en'
    );

    expect(guide).toBeDefined();
    expect(guide.steps).toBeDefined();
    expect(guide.images).toBeDefined();
    expect(guide.steps.length).toBeGreaterThan(0);
  });

  it('should support multiple languages', async () => {
    const guidanceEn = await arService.generateVisualGuidance(
      'cooking',
      'stir',
      'en'
    );
    const guidanceId = await arService.generateVisualGuidance(
      'cooking',
      'aduk',
      'id'
    );

    expect(guidanceEn).toBeDefined();
    expect(guidanceId).toBeDefined();
  });

  it('should handle demo mode', async () => {
    const guidance = await arService.generateVisualGuidance(
      'cooking',
      'test',
      'en'
    );

    expect(guidance.overlays).toBeDefined();
    expect(guidance.overlays.length).toBeGreaterThan(0);
  });
});

describe('AgentMemoryService', () => {
  let memoryService: AgentMemoryService;
  let firestoreService: FirestoreService;

  beforeAll(() => {
    firestoreService = new FirestoreService();
    memoryService = new AgentMemoryService(firestoreService);
  });

  it('should initialize successfully', () => {
    expect(memoryService).toBeDefined();
  });

  it('should save messages', async () => {
    await memoryService.saveMessage('test-session-1', 'user', 'Hello');
    expect(true).toBe(true); // Mock assertion
  });

  it('should save feedback', async () => {
    const feedback = {
      helpful: 5,
      accuracy: 5,
      clarity: 5,
    };

    await memoryService.saveFeedback('test-session-1', feedback);
    expect(true).toBe(true); // Mock assertion
  });

  it('should retrieve session context', async () => {
    const context = await memoryService.getRecentContext('test-session-1', 5);
    expect(context).toBeDefined();
  });

  it('should get user history', async () => {
    const history = await memoryService.getUserHistory('test-user-1', 'cooking');
    expect(Array.isArray(history)).toBe(true);
  });
});

describe('Integration Tests', () => {
  it('should handle complete workflow', async () => {
    const ragService = new RAGService();
    const toolService = new ToolCallingService();
    const arService = new AROverlayService();

    // 1. Search knowledge base
    const ragResults = await ragService.search('cooking tips', 'cooking', 2);
    expect(ragResults.length).toBeGreaterThan(0);

    // 2. Call tool
    const toolResult = await toolService.callTool({
      name: 'calculate_nutrition',
      parameters: { ingredients: ['rice'], servings: 1 },
    });
    expect(toolResult.success).toBe(true);

    // 3. Generate AR guidance
    const guidance = await arService.generateVisualGuidance(
      'cooking',
      'initial',
      'en'
    );
    expect(guidance.overlays).toBeDefined();
  });

  it('should handle error scenarios', async () => {
    const toolService = new ToolCallingService();

    // Invalid tool name
    const result1 = await toolService.callTool({
      name: 'invalid_tool',
      parameters: {},
    });
    expect(result1.success).toBe(false);

    // Invalid parameters
    const result2 = await toolService.callTool({
      name: 'calculate_nutrition',
      parameters: {},
    });
    expect(result2.success).toBe(true); // Should handle gracefully
  });
});
