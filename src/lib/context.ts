import fs from "fs/promises";
import path from "path";

const ME_DIR = path.join(process.cwd(), "me");

let cachedContext: string | null = null;

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
    loadMarkdown(path.join(ME_DIR, "resume.md")),
    loadMarkdown(path.join(ME_DIR, "linkedin.md")),
  ]);

  const sections: string[] = [];

  if (summary) sections.push(`## About Sam\n${summary}`);
  if (resume) sections.push(`## Resume\n${resume}`);
  if (linkedin) sections.push(`## LinkedIn Profile\n${linkedin}`);

  if (sections.length === 0) {
    throw new Error(
      "Failed to load any context documents. " +
        "Ensure files exist in the me/ directory: summary.md, resume.md, linkedin.md",
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
