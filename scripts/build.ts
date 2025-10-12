const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR = path.join(__dirname, "..", 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'mod.ts');

// Helper: Recursively get all .ts files in a directory
function getAllTSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllTSFiles(fullPath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Main function
function concatenateTSFiles() {
  const tsFiles = getAllTSFiles(SRC_DIR);

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const contents = tsFiles
    .map((filePath) => {
      const relativePath = path.relative(SRC_DIR, filePath);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return `// ----- ${relativePath} -----\n${fileContent}`;
    })
    .join('\n\n');

  const t = 'import * as modlib from "modlib";\n\n' + contents;

  fs.writeFileSync(OUTPUT_FILE, t, 'utf-8');
  console.log(`Concatenated ${tsFiles.length} TypeScript files into ${OUTPUT_FILE}`);
}

// Run it
concatenateTSFiles();
