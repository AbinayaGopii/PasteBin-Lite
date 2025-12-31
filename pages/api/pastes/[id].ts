import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.query.id as string;
  const isHtml = req.query.html === "1";

  if (!id) {
    return res.status(404).json({ error: "Paste unavailable" });
  }

  const now = req.headers["x-test-now-ms"]
    ? new Date(Number(req.headers["x-test-now-ms"]))
    : new Date();

  const paste = await prisma.paste.findUnique({ where: { id } });

  if (!paste) {
    return res.status(404).json({ error: "Paste unavailable" });
  }

  if (paste.expiresAt && paste.expiresAt < now) {
    return res.status(404).json({ error: "Paste unavailable" });
  }

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return res.status(404).json({ error: "Paste unavailable" });
  }

  let updated = paste;

  // ✅ Increment ONLY for API calls
  if (!isHtml) {
    updated = await prisma.paste.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return res.status(200).json({
    content: updated.content,
    remaining_views:
      updated.maxViews === null
        ? null
        : updated.maxViews - updated.viewCount,
    expires_at: updated.expiresAt,
  });
}
