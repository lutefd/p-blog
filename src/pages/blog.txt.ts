import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { createTextResponse, renderTerminalBlogIndex } from "@/lib/terminal";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return createTextResponse(renderTerminalBlogIndex(posts));
};
