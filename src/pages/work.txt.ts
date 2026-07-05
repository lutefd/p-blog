import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { createTextResponse, renderTerminalWork } from "@/lib/terminal";

export const GET: APIRoute = async () => {
  const projects = (await getCollection("projects")).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.title.localeCompare(b.data.title),
  );

  return createTextResponse(renderTerminalWork(projects));
};
