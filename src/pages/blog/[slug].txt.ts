import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { createTextResponse, renderTerminalPost } from "@/lib/terminal";

export async function getStaticPaths() {
  const posts = await getCollection("blog");

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

export const GET: APIRoute = ({ props }) => createTextResponse(renderTerminalPost(props.post));
