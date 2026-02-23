/**
 * Extract text from PDF files in the me/ directory and save as markdown.
 * Run with: npx tsx scripts/extract-pdfs.ts
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PDFParse } from "pdf-parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ME_DIR = path.join(__dirname, "..", "me");

const PDF_FILES = [
  { input: "resume.pdf", output: "resume.md" },
  { input: "linkedin.pdf", output: "linkedin.md" },
];

async function extractPdf(inputFile: string): Promise<string> {
  const data = await fs.readFile(path.join(ME_DIR, inputFile));
  const parser = new PDFParse({ data });
  const result = await parser.getText();
  return result.text.trim();
}

async function main() {
  for (const { input, output } of PDF_FILES) {
    console.log(`Extracting ${input} → ${output}`);
    const text = await extractPdf(input);
    await fs.writeFile(path.join(ME_DIR, output), text, "utf-8");
    console.log(`  Done (${text.length} characters)`);
  }
  console.log("All PDFs extracted.");
}

main().catch((err) => {
  console.error("Extraction failed:", err);
  process.exit(1);
});
