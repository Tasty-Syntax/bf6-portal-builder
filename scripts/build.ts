const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const CLASSES_DIR = path.join(SRC_DIR, 'classes'); // <== NEW
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

  // Isolate variables.ts and types.ts
  const variablesFile = tsFiles.find(filePath =>
    path.basename(filePath) === 'variables.ts'
  );

  const typesFile = tsFiles.find(filePath =>
    path.basename(filePath) === 'types.ts'
  );

  // Get all class files (explicitly from src/classes/)
  const classFiles = fs.existsSync(CLASSES_DIR)
    ? getAllTSFiles(CLASSES_DIR)
    : [];

  // Filter out variables.ts, types.ts, and class files from the rest
  const otherFiles = tsFiles.filter(filePath =>
    filePath !== variablesFile &&
    filePath !== typesFile &&
    !classFiles.includes(filePath)
  );

  // Final file order:
  // variables.ts (if any) -> types.ts (if any) -> class files -> rest
  const finalFileOrder = [
    ...(variablesFile ? [variablesFile] : []),
    ...(typesFile ? [typesFile] : []),
    ...classFiles,
    ...otherFiles
  ];

  // Ensure dist folder exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // Read, label, and concatenate file contents
  const contents = finalFileOrder
    .map((filePath) => {
      const relativePath = path.relative(SRC_DIR, filePath);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return `// ----- ${relativePath} -----\n${fileContent}`;
    })
    .join('\n\n');

  // Prepend import
  const finalOutput = 'import * as modlib from "modlib";\n\n' + contents;

  fs.writeFileSync(OUTPUT_FILE, finalOutput, 'utf-8');
  console.log(`Concatenated ${finalFileOrder.length} TypeScript files into ${OUTPUT_FILE}`);
}

// Run it
concatenateTSFiles();

