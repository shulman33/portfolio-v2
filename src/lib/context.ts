import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";

const ME_DIR = path.join(process.cwd(), "me");

let cachedContext: string | null = null;

async function loadPdf(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath);
    const parser = new PDFParse({ data });
    const result = await parser.getText();
    return result.text.trim();
  } catch (e) {
    console.error(
      JSON.stringify({
        level: "warn",
        message: `Failed to load PDF ${filePath}`,
        error: e instanceof Error ? e.message : String(e),
      }),
    );
    return "";
  }
}

async function loadMarkdown(filePath: string): Promise<string> {
  try {
    const text = await fs.readFile(filePath, "utf-8");
    return text.trim();
  } catch (e) {
    console.error(
      JSON.stringify({
        level: "warn",
        message: `Failed to load markdown ${filePath}`,
        error: e instanceof Error ? e.message : String(e),
      }),
    );
    return "";
  }
}

export async function loadContext(): Promise<string> {
  if (cachedContext) return cachedContext;

  const [summary, resume, linkedin] = await Promise.all([
    loadMarkdown(path.join(ME_DIR, "summary.md")),
    loadPdf(path.join(ME_DIR, "resume.pdf")),
    loadPdf(path.join(ME_DIR, "linkedin.pdf")),
  ]);

  const sections: string[] = [];

  if (summary) sections.push(`## About Sam\n${summary}`);
  if (resume) sections.push(`## Resume\n${resume}`);
  if (linkedin) sections.push(`## LinkedIn Profile\n${linkedin}`);

  if (sections.length === 0) {
    throw new Error(
      "Failed to load any context documents. " +
        "Ensure files exist in the me/ directory: summary.md, resume.pdf, linkedin.pdf",
    );
  }

  cachedContext = sections.join("\n\n---\n\n");
  console.log(
    JSON.stringify({
      level: "info",
      message: `Loaded context: ${cachedContext.length} characters`,
    }),
  );
  return cachedContext;
}
