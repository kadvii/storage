const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Background replacements
  content = content.replace(/bg-slate-50/g, 'bg-secondary');
  content = content.replace(/bg-slate-900/g, 'bg-primary');
  content = content.replace(/bg-slate-800\/80/g, 'bg-primary/80');
  content = content.replace(/bg-slate-800/g, 'bg-primary');
  content = content.replace(/bg-slate-950/g, 'bg-secondary');
  content = content.replace(/bg-white\/90/g, 'bg-primary text-white'); // navbar
  content = content.replace(/bg-white\/80/g, 'bg-secondary/80');
  content = content.replace(/bg-white/g, 'bg-secondary');

  // Text / Typography replacements
  content = content.replace(/text-slate-900/g, 'text-primary');
  content = content.replace(/text-slate-800/g, 'text-primary');
  content = content.replace(/text-slate-700/g, 'text-primary/90');
  content = content.replace(/text-slate-600/g, 'text-primary/80');
  content = content.replace(/text-slate-500/g, 'text-primary/70');
  content = content.replace(/text-slate-400/g, 'text-primary/60');
  content = content.replace(/text-slate-300/g, 'text-primary/50');

  // Specific Action Buttons (Accent)
  content = content.replace(/bg-indigo-600/g, 'bg-accent');
  content = content.replace(/bg-indigo-500/g, 'bg-accent/90');
  content = content.replace(/hover:bg-indigo-500/g, 'hover:bg-accent/90');
  content = content.replace(/bg-emerald-600/g, 'bg-accent');
  content = content.replace(/hover:bg-emerald-500/g, 'hover:opacity-90');
  content = content.replace(/text-indigo-600/g, 'text-accent');
  content = content.replace(/text-indigo-400/g, 'text-accent/80');
  content = content.replace(/stroke-indigo-600/g, 'stroke-accent');
  content = content.replace(/hover:text-indigo-900/g, 'hover:brightness-75');

  // Border replacements
  content = content.replace(/border-slate-200/g, 'border-primary/20');
  content = content.replace(/border-slate-300/g, 'border-primary/30');
  content = content.replace(/border-slate-100/g, 'border-primary/10');
  content = content.replace(/border-slate-600/g, 'border-primary/40');
  content = content.replace(/border-slate-700/g, 'border-primary/30');
  content = content.replace(/border-slate-800/g, 'border-primary/20');
  
  // Specific Sidebar and Interactive fixes
  content = content.replace(/linkIdle =([^;]+)/, "linkIdle =\n  'text-white hover:bg-white/10 hover:text-white'");
  content = content.replace(/linkActive =([^;]+)/, "linkActive = 'bg-accent text-white shadow-sm'");
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', path.basename(file));
  }
});

// Update index.css
let cssContent = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf8');
if (!cssContent.includes('--color-primary')) {
  cssContent = `@theme {\n  --color-primary: #3F56A6;\n  --color-secondary: #F5F6FA;\n  --color-accent: #FF8C42;\n}\n\n` + cssContent;
  fs.writeFileSync(path.join(srcDir, 'index.css'), cssContent, 'utf8');
  console.log('Updated: index.css');
}

console.log('Done mapping colors.');
