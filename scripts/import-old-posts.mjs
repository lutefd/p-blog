import { mkdir, writeFile } from "node:fs/promises";

const posts = [
  {
    slug: "development-principles",
    tags: ["software-design", "principles"],
  },
  {
    slug: "devportal-migration",
    tags: ["migration", "nextjs", "aws"],
    project: "devportal",
  },
  {
    slug: "the-serverless-challenge",
    tags: ["serverless", "aws", "architecture"],
    project: "devportal",
  },
];

function readFrontmatterValue(frontmatter, key) {
  const line = frontmatter
    .split("\n")
    .find((entry) => entry.startsWith(`${key}:`));

  return line
    ?.slice(key.length + 1)
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function normalizeBody(body) {
  return body
    .replace(/import Centralizer from .*?;\n\n/, "")
    .replace(/<Centralizer>[\s\S]*?<\/Centralizer>\n\n/, "")
    .trimStart();
}

await mkdir("src/content/blog", { recursive: true });

for (const post of posts) {
  const url = `https://raw.githubusercontent.com/lutefd/portifolio/main/src/content/blog/${post.slug}.mdx`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not fetch ${post.slug}: ${response.status}`);
  }

  const source = await response.text();
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${post.slug}`);
  }

  const frontmatter = match[1];
  const body = normalizeBody(source.slice(match[0].length));
  const tags = post.tags.map((tag) => `  - ${tag}`).join("\n");
  const project = post.project ? `project: ${post.project}\n` : "";
  const output = `---
title: ${JSON.stringify(readFrontmatterValue(frontmatter, "title"))}
description: ${JSON.stringify(readFrontmatterValue(frontmatter, "description"))}
date: ${JSON.stringify(readFrontmatterValue(frontmatter, "date"))}
draft: false
tags:
${tags}
${project}---

${body}`;

  await writeFile(`src/content/blog/${post.slug}.mdx`, output);
}
