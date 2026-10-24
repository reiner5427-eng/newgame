const fs = require('node:fs');
const path = require('node:path');

const output = path.join(__dirname, 'docs');
fs.mkdirSync(path.join(output, 'assets'), { recursive: true });
for (const file of ['index.html', 'style.css', 'game.js', 'assets/whale.png', 'assets/ocean.png']) {
  fs.copyFileSync(path.join(__dirname, file), path.join(output, file));
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log('Prepared docs/ for GitHub Pages (main branch, /docs folder).');
