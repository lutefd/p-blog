import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

type TerminalProject = {
  body?: string;
  data: {
    title: string;
    description: string;
    status: string;
    repo?: string;
    url?: string;
    stack?: string[];
  };
};

type TerminalPost = {
  slug: string;
  body?: string;
  data: {
    title: string;
    description: string;
    date: Date;
    tags: string[];
  };
};

type TerminalSiteInput = {
  projects: TerminalProject[];
  posts: TerminalPost[];
};

const line = "-".repeat(72);

function section(title: string) {
  return [``, line, title.toUpperCase(), line];
}

function link(path: string) {
  return new URL(path, site.url).href;
}

function stripMdx(value = "") {
  const lines = value
    .replace(/\r\n/g, "\n")
    .replace(/^---[\s\S]*?---\n?/, "")
    .split("\n");

  const output: string[] = [];
  let inCodeBlock = false;
  let inImport = false;
  let inComponent = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      output.push(line);
      continue;
    }

    if (inCodeBlock) {
      output.push(line);
      continue;
    }

    if (inImport) {
      if (trimmed.endsWith(";")) {
        inImport = false;
      }
      continue;
    }

    if (trimmed.startsWith("import ")) {
      inImport = !trimmed.endsWith(";");
      continue;
    }

    if (inComponent) {
      if (trimmed.endsWith("/>") || trimmed.endsWith(">")) {
        inComponent = false;
      }
      continue;
    }

    if (/^<[A-Z]/.test(trimmed)) {
      inComponent = !(trimmed.endsWith("/>") || trimmed.endsWith(">"));
      continue;
    }

    output.push(
      line
        .replace(/^#{1,6}\s+(.+)$/, (_, heading: string) => heading.toUpperCase())
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1 ($2)")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1"),
    );
  }

  return output
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function responseText(lines: string[]) {
  return `${lines.join("\n")}\n`;
}

export function createTextResponse(body: string) {
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

export function renderTerminalSite({ projects, posts }: TerminalSiteInput) {
  const lines = [
    `${site.name}`,
    `${site.title}`,
    ``,
    site.description,
    ``,
    `Senior software engineer from Brazil.`,
    `Building a small home for work, notes, essays, and tools that make teams sharper.`,
    ``,
    `Web:      ${site.url}`,
    `GitHub:   ${site.links.github}`,
    `LinkedIn: ${site.links.linkedin}`,
    `Email:    ${site.links.email.replace("mailto:", "")}`,
    ...section("Try"),
    `curl ${site.url}/terminal.txt`,
    `curl ${site.url}/rss.xml`,
    `open ${link("/work")}`,
    `open ${link("/blog")}`,
    `open ${link("/about")}`,
    ...section("Featured Projects"),
  ];

  projects.forEach((project) => {
    const projectUrl = project.data.url ?? project.data.repo;
    lines.push(
      `${project.data.title} [${project.data.status}]`,
      `  ${project.data.description}`,
    );

    if (projectUrl) {
      lines.push(`  ${projectUrl}`);
    }

    lines.push(``);
  });

  lines.push(...section("Latest Writing"));

  posts.forEach((post) => {
    const tags = post.data.tags.length > 0 ? ` #${post.data.tags.join(" #")}` : "";

    lines.push(
      `${formatDate(post.data.date)} - ${post.data.title}`,
      `  ${post.data.description}`,
      `  ${link(`/blog/${post.slug}`)}${tags}`,
      ``,
    );
  });

  lines.push(
    ...section("Routes"),
    `${link("/")}`,
    `${link("/work")}`,
    `${link("/blog")}`,
    `${link("/about")}`,
    `${link("/rss.xml")}`,
    ``,
    `Thanks for visiting from the terminal.`,
  );

  return responseText(lines);
}

export function renderTerminalBlogIndex(posts: TerminalPost[]) {
  const lines = [
    `${site.name} / Writing`,
    site.description,
    ...section("Latest Posts"),
  ];

  posts.forEach((post) => {
    const tags = post.data.tags.length > 0 ? ` #${post.data.tags.join(" #")}` : "";

    lines.push(
      `${formatDate(post.data.date)} - ${post.data.title}`,
      `  ${post.data.description}`,
      `  ${link(`/blog/${post.slug}`)}${tags}`,
      ``,
    );
  });

  lines.push(...section("More"), `RSS: ${link("/rss.xml")}`, `Home: ${link("/")}`);

  return responseText(lines);
}

export function renderTerminalPost(post: TerminalPost) {
  const tags = post.data.tags.length > 0 ? post.data.tags.join(", ") : "untagged";
  const body = stripMdx(post.body);
  const lines = [
    post.data.title,
    `${formatDate(post.data.date)} / ${tags}`,
    ``,
    post.data.description,
    ...section("Article"),
    body,
    ...section("Links"),
    `Web: ${link(`/blog/${post.slug}`)}`,
    `Writing: ${link("/blog")}`,
    `RSS: ${link("/rss.xml")}`,
  ];

  return responseText(lines);
}

export function renderTerminalWork(projects: TerminalProject[]) {
  const lines = [
    `${site.name} / Work`,
    `Projects across repository memory, Git workflows, local tools, ledgers, experiments, and small product systems.`,
    ...section("Projects"),
  ];

  projects.forEach((project) => {
    const projectUrl = project.data.url ?? project.data.repo;
    const stack = project.data.stack?.length ? `stack: ${project.data.stack.join(", ")}` : undefined;
    const body = stripMdx(project.body);

    lines.push(
      project.data.title,
      `  status: ${project.data.status}`,
      ...(stack ? [`  ${stack}`] : []),
      `  ${project.data.description}`,
    );

    if (body) {
      lines.push(``, body);
    }

    if (projectUrl) {
      lines.push(``, `  ${projectUrl}`);
    }

    lines.push(``, line, ``);
  });

  lines.push(`Home: ${link("/")}`);

  return responseText(lines);
}

export function renderTerminalAbout() {
  return responseText([
    `${site.name} / About`,
    ``,
    `I am Luis Dourado, a senior software engineer from Brazil. I work on backend systems, infrastructure, internal platforms, and product experiences where the engineering shape matters as much as the visible interface.`,
    ``,
    `I like tools that make teams sharper: systems that preserve context, reduce coordination drag, and keep important decisions close to the work. A lot of my recent projects sit in that space: repository memory, stacked branches, local automation, and small interfaces that turn operational mess into something legible.`,
    ...section("Focus"),
    `- Backend services, APIs, data modeling, and production operations.`,
    `- Developer tools for Git, code review, local workflows, and agent-assisted engineering.`,
    `- Product-minded engineering: clear systems, concise UX, and maintainable delivery paths.`,
    ...section("Elsewhere"),
    `GitHub:   ${site.links.github}`,
    `LinkedIn: ${site.links.linkedin}`,
    `Email:    ${site.links.email.replace("mailto:", "")}`,
    `Home:     ${link("/")}`,
  ]);
}
