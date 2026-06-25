import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const blogDir = path.join(root, "src/content/blog");
const outDir = path.join(root, "public/og");

function wrap(str, maxLen) {
  const words = str.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxLen) {
      lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSvg({ title, description, date, label }) {
  const titleLines = wrap(title, 34);
  const descLines = wrap(description || "", 80);
  const titleY = 170;
  const lineHeight = 72;
  const descY = titleY + titleLines.length * lineHeight + 60;
  const metaY = 560;

  const titleEls = titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${titleY + i * lineHeight}" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="64" font-weight="600" fill="#ffffff">${escapeXml(line)}</text>`
    )
    .join("");

  const descEls = descLines
    .slice(0, 3)
    .map(
      (line, i) =>
        `<text x="80" y="${descY + i * 42}" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" fill="#a1a1a1">${escapeXml(line)}</text>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#000000"/>
    ${titleEls}
    ${descEls}
    <text x="80" y="${metaY}" font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="24" fill="#737373">${escapeXml(label)}${date ? ` · ${date}` : ""}</text>
  </svg>`;
}

async function render(svg, outFile) {
  await sharp(Buffer.from(svg), { density: 72 })
    .png()
    .toFile(outFile);
}

fs.mkdirSync(outDir, { recursive: true });

// Default site OG image
const siteSvg = generateSvg({
  title: "Luis Dourado",
  description: "Building way too much most of the time.",
  label: "luisdourado.com",
});
await render(siteSvg, path.join(root, "public/og-image.png"));

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
for (const file of files) {
  const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
  const { data } = matter(raw);
  if (data.draft) continue;

  const slug = file.replace(/\.(mdx|md)$/, "");
  const svg = generateSvg({
    title: data.title,
    description: data.description,
    date: data.date ? new Date(data.date).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "",
    label: "luisdourado.com",
  });
  await render(svg, path.join(outDir, `${slug}.png`));
  console.log(`Generated OG image for ${slug}`);
}

console.log("Done.");
