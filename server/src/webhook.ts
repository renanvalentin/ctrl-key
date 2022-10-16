const dotenv = require('dotenv');
dotenv.config();

import express from 'express';
import { verifyWebhookSignature } from '@blockfrost/blockfrost-js';
import Pusher from 'pusher';

import { logger } from './logger';

export const createWebhook = () => {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.PUSHER_CLUSTER as string,
    useTLS: true,
  });

  const SECRET_AUTH_TOKEN: string = process.env
    .BLOCKFROST_WEBHOOK_AUTH_TOKEN as string;
  const app = express();

  app.post(
    '/api/webhook',
    express.json({ type: 'application/json' }),
    async (request, response) => {
      const signatureHeader =
        request.headers['blockfrost-signature'] ||
        request.get('blockfrost-signature');

      if (!signatureHeader) {
        await logger.error(
          'The request is missing Blockfrost-Signature header',
        );
        return response.status(400).send(`Missing signature header`);
      }

      try {
        verifyWebhookSignature(
          JSON.stringify(request.body),
          signatureHeader,
          SECRET_AUTH_TOKEN,
        );
      } catch (error) {
        return response.status(400).send('Signature is not valid!');
      }

      const type = request.body.type;
      const payload = request.body.payload;

      switch (type) {
        case 'transaction':
          await logger.info(`received transactions %s`, payload.length);
          for (const transaction of payload) {
            await pusher.trigger('cardano', 'transaction', {
              tx: transaction.tx,
            });
            await logger.info(`tx %s`, transaction.tx.hash);
          }
          break;
        default:
          break;
      }
      response.json({ processed: true });
    },
  );

  return app;
};
