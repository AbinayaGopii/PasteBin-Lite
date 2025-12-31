import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse

) 
{
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false });
  }

  try {
    // Simple DB connectivity check
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
}
