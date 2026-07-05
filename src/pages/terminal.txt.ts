import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { createTextResponse, renderTerminalSite } from "@/lib/terminal";

export const GET: APIRoute = async () => {
	const projects = (await getCollection("projects"))
		.filter((project) => project.data.featured)
		.sort((a, b) => a.data.title.localeCompare(b.data.title))
		.slice(0, 4);

	const posts = (await getCollection("blog"))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
		.slice(0, 5);

	return createTextResponse(renderTerminalSite({ projects, posts }));
};
