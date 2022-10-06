import path from 'path';
import { Context, setupPolly } from 'setup-polly-jest';
import { Polly, PollyConfig } from '@pollyjs/core';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import FSPersister from '@pollyjs/persister-fs';
import { AES, enc } from 'crypto-js';

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

let recordIfMissing = true;
let mode: PollyConfig['mode'] = 'replay';

console.log('POLLY_MODE', process.env.POLLY_MODE);

switch (process.env.POLLY_MODE) {
  case 'record':
    mode = 'record';
    break;
  case 'replay':
    mode = 'replay';
    break;
  case 'offline':
    mode = 'replay';
    recordIfMissing = false;
    break;
}

export function autoSetupPolly() {
  /**
   * This persister can be adapted for both Node.js and Browser environments.
   *
   * TODO: Customize your config.
   */
  return setupPolly({
    // 🟡 Note: In node, most `fetch` like libraries use the http/https modules.
    // `node-fetch` is handled by `NodeHttpAdapter`, NOT the `FetchAdapter`.
    adapters: [require('@pollyjs/adapter-node-http')],
    mode,
    recordIfMissing,
    flushRequestsOnStop: true,
    // logging: false,
    recordFailedRequests: true,
    persister: require('@pollyjs/persister-fs'),
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../__recordings__'),
      },
    },
    matchRequestsBy: {
      url: {
        port: false,
      },
    },
  });
}

export function encryptRecord(context: Context) {
  context.polly.server.any().on('beforePersist', (req, recording) => {
    recording.request = AES.encrypt(
      JSON.stringify(recording.request),
      process.env.POLLY_TOKEN,
    ).toString();

    recording.response = AES.encrypt(
      JSON.stringify(recording.response),
      process.env.POLLY_TOKEN,
    ).toString();
  });

  context.polly.server.any().on('beforeReplay', (req, recording) => {
    recording.request = JSON.parse(
      AES.decrypt(recording.request, process.env.POLLY_TOKEN).toString(
        enc.Utf8,
      ),
    );

    recording.response = JSON.parse(
      AES.decrypt(recording.response, process.env.POLLY_TOKEN).toString(
        enc.Utf8,
      ),
    );
  });
}
