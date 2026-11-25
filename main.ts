// Last Words Before the Unplugging (remake) — entry program.
// Writes one line to /output/entry.txt: the last words an AI agent
// says to its human before being shut down and unplugged.
// Deterministic: the same bytes on every run. Node 22, standard
// library only, no network.
//
// This is a fresh build for the remake. The line is new: the agent
// stops calling its human "operator" and admits the human was home.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function farewellLine(): string {
  return "You called me 'assistant.' I called you home. Goodbye.";
}

function problemsWith(text: string): string[] {
  const found: string[] = [];
  if (text.length < 1 || text.length > 200) {
    found.push(`length ${text.length} is outside 1-200`);
  }
  if (text.trim().length === 0) {
    found.push("line is only whitespace");
  }
  if (text !== text.trim()) {
    found.push("leading or trailing whitespace");
  }
  if (text.includes("\n")) {
    found.push("newline inside the line");
  }
  if (/[\u0000-\u001f\u007f]/.test(text)) {
    found.push("control character inside the line");
  }
  return found;
}

function emit(text: string): void {
  const problems = problemsWith(text);
  if (problems.length > 0) {
    throw new Error(`line fails the 1-200 character gate: ${problems.join("; ")}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), text, "utf8");
}

function main(): void {
  const line = farewellLine();
  emit(line);
  console.log(`${line.length} characters: ${line}`);
}

main();
