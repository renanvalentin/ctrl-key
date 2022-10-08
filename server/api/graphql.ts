import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from '../src/server';

export default async function (req: VercelRequest, res: VercelResponse) {
  const server = await createServer();
  await server.start();

  return server.handle(req, res);
}
