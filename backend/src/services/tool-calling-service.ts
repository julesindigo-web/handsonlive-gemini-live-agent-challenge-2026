import { logger } from '../utils/logger';

export interface ToolCall {
  name: string;
  parameters: Record<string, any>;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class ToolCallingService {
  private tools: Map<string, (params: any) => Promise<ToolResult>> = new Map();

  constructor() {
    this.registerTools();
  }

  private registerTools() {
    this.tools.set('calculate_nutrition', this.calculateNutrition.bind(this));
    this.tools.set('get_recipe_info', this.getRecipeInfo.bind(this));
    this.tools.set('convert_units', this.convertUnits.bind(this));
  }

  async callTool(toolCall: ToolCall): Promise<ToolResult> {
    const tool = this.tools.get(toolCall.name);
    
    if (!tool) {
      logger.error('Tool not found', { name: toolCall.name });
      return {
        success: false,
        error: `Tool '${toolCall.name}' not found`,
      };
    }

    try {
      logger.info('Calling tool', { name: toolCall.name, parameters: toolCall.parameters });
      const result = await tool(toolCall.parameters);
      logger.info('Tool call successful', { name: toolCall.name });
      return result;
    } catch (error) {
      logger.error('Tool call failed', { error, name: toolCall.name });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async calculateNutrition(params: {
    ingredients: string[];
    servings?: number;
  }): Promise<ToolResult> {
    try {
      // Mock nutrition calculation
      // In production, this would call a nutrition API
      const nutritionData = {
        calories: Math.floor(Math.random() * 500) + 200,
        protein: Math.floor(Math.random() * 30) + 10,
        carbs: Math.floor(Math.random() * 50) + 20,
        fat: Math.floor(Math.random() * 20) + 5,
        fiber: Math.floor(Math.random() * 10) + 2,
        servings: params.servings || 1,
      };

      return {
        success: true,
        data: nutritionData,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to calculate nutrition',
      };
    }
  }

  async getRecipeInfo(params: {
    recipeName: string;
    language?: string;
  }): Promise<ToolResult> {
    try {
      // Mock recipe info retrieval
      // In production, this would query a recipe database or API
      const recipeInfo = {
        name: params.recipeName,
        prepTime: `${Math.floor(Math.random() * 30) + 10} min`,
        cookTime: `${Math.floor(Math.random() * 60) + 15} min`,
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
        ingredients: [
          'Ingredient 1',
          'Ingredient 2',
          'Ingredient 3',
        ],
        steps: [
          'Step 1: Prepare ingredients',
          'Step 2: Mix and cook',
          'Step 3: Serve and enjoy',
        ],
      };

      return {
        success: true,
        data: recipeInfo,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get recipe info',
      };
    }
  }

  async convertUnits(params: {
    value: number;
    fromUnit: string;
    toUnit: string;
  }): Promise<ToolResult> {
    try {
      // Mock unit conversion
      // In production, this would use a proper conversion library
      const conversions: Record<string, number> = {
        'cup_to_grams': 240,
        'tablespoon_to_grams': 15,
        'teaspoon_to_grams': 5,
        'ounce_to_grams': 28,
        'pound_to_grams': 454,
      };

      const conversionKey = `${params.fromUnit}_to_${params.toUnit}`;
      const factor = conversions[conversionKey];

      if (!factor) {
        return {
          success: false,
          error: `Conversion from ${params.fromUnit} to ${params.toUnit} not supported`,
        };
      }

      const result = params.value * factor;

      return {
        success: true,
        data: {
          original: `${params.value} ${params.fromUnit}`,
          converted: `${result} ${params.toUnit}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to convert units',
      };
    }
  }

  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }
}
