import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Content is required" });
  }

  let expiresAt: Date | null = null;
  let maxViews: number | null = null;

  if (ttl_seconds !== undefined) {
    if (typeof ttl_seconds !== "number" || ttl_seconds < 1) {
      return res
        .status(400)
        .json({ error: "ttl_seconds must be >= 1" });
    }
    expiresAt = new Date(Date.now() + ttl_seconds * 1000);
  }

  if (max_views !== undefined) {
    if (typeof max_views !== "number" || max_views < 1) {
      return res
        .status(400)
        .json({ error: "max_views must be >= 1" });
    }
    maxViews = max_views;
  }

  const paste = await prisma.paste.create({
    data: {
      content,
      expiresAt,
      maxViews,
    },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    `http://${req.headers.host}`;

  return res.status(201).json({
    id: paste.id,
    url: `${baseUrl}/p/${paste.id}`,
  });
}
