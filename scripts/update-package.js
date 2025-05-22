
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run",
  "coverage": "vitest run --coverage"
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Package.json atualizado com sucesso!');
