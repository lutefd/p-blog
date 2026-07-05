import type { APIRoute } from "astro";
import { createTextResponse, renderTerminalAbout } from "@/lib/terminal";

export const GET: APIRoute = () => createTextResponse(renderTerminalAbout());
