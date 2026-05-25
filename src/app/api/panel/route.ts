// import { NextResponse } from "next/server";
import { appRouter } from "@/server/api/root";
import { collectRoutes, generateDocsHtml } from 'trpc-docs-generator';

export async function GET() {
  const routes = collectRoutes(appRouter);
  const html = generateDocsHtml(routes, {
    title: 'API Documentation'
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}