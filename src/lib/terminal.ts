import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

type TerminalProject = {
  data: {
    title: string;
    description: string;
    status: string;
    repo?: string;
    url?: string;
  };
};

type TerminalPost = {
  slug: string;
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

  return `${lines.join("\n")}\n`;
}
