const dotenv = require('dotenv');
dotenv.config();

import express from 'express';
import { verifyWebhookSignature } from '@blockfrost/blockfrost-js';
import Pusher from 'pusher';
import debug from 'debug';

const logger = debug('webhook');

export const createWebhook = () => {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  });

  const SECRET_AUTH_TOKEN: string = process.env
    .BLOCKFROST_WEBHOOK_AUTH_TOKEN as string;
  const app = express();

  app.post(
    '/api/webhook',
    express.json({ type: 'application/json' }),
    (request, response) => {
      const signatureHeader =
        request.headers['blockfrost-signature'] ||
        request.get('blockfrost-signature');

      console.log('signatureHeader', signatureHeader);
      console.log('headers', request.headers);

      if (!signatureHeader) {
        logger('The request is missing Blockfrost-Signature header');
        return response.status(400).send(`Missing signature header`);
      }

      try {
        verifyWebhookSignature(
          JSON.stringify(request.body),
          signatureHeader,
          SECRET_AUTH_TOKEN,
        );
      } catch (error) {
        console.log('error');
        console.log(error);
        return response.status(400).send('Signature is not valid!');
      }

      const type = request.body.type;
      const payload = request.body.payload;

      console.log(payload);

      switch (type) {
        case 'transaction':
          logger(`received transactions %s`, payload.length);
          for (const transaction of payload) {
            pusher.trigger('cardano', 'transaction', transaction.tx);
            logger(`tx %s`, transaction.tx.hash);
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
