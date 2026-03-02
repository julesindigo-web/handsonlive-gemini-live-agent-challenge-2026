import { ESLint } from 'eslint';

const eslint = new ESLint();

async function checkComplexity() {
  const results = await eslint.lintFiles(['**/*.ts', '**/*.tsx']);

  let highComplexity = 0;
  let veryHighComplexity = 0;

  results.forEach((result) => {
    result.messages.forEach((message) => {
      if (message.ruleId === 'complexity') {
        const complexity = parseInt(message.message.match(/\d+/)[0]);
        if (complexity > 15) {
          highComplexity++;
          console.warn(
            `High complexity (${complexity}) in ${result.filePath}:${message.line}`
          );
        }
        if (complexity > 20) {
          veryHighComplexity++;
          console.error(
            `Very high complexity (${complexity}) in ${result.filePath}:${message.line}`
          );
        }
      }
    });
  });

  if (veryHighComplexity > 0) {
    console.error(`Found ${veryHighComplexity} functions with very high complexity (>20)`);
    process.exit(1);
  }

  if (highComplexity > 0) {
    console.warn(`Found ${highComplexity} functions with high complexity (>15)`);
  }

  console.log('Complexity check passed');
}

checkComplexity().catch((error) => {
  console.error('Error checking complexity:', error);
  process.exit(1);
});
