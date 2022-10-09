import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../src/server';

export default async function (req: VercelRequest, res: VercelResponse) {
  const server = await createServer();

  return server.handle(req, res);
}
