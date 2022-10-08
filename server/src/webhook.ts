// // Example of Node.js Express app with /webhook endpoint
// // for processing events sent by Blockfrost Secure Webhooks
// const express = require('express');
// const blockfrost = require('@blockfrost/blockfrost-js');
// const { verifyWebhookSignature, SignatureVerificationError } = blockfrost;
// // You will find the webhook secret auth token in the Webhook settings in the Blockfrost Dashboard
// const SECRET_AUTH_TOKEN = 'WEBHOOK_AUTH_TOKEN';
// const app = express();
// // Define endpoint /webhook that accepts POST requests
// app.post(
//   '/webhook',
//   express.json({ type: 'application/json' }),
//   (request, response) => {
//     const signatureHeader = request.headers['blockfrost-signature'];
//     // Make sure that Blockfrost-Signature header exists
//     if (!signatureHeader) {
//       console.log('The request is missing Blockfrost-Signature header');
//       return response.status(400).send(`Missing signature header`);
//     }
//     // Validate the webhook signature
//     try {
//       verifyWebhookSignature(
//         JSON.stringify(request.body), // stringified request.body
//         signatureHeader,
//         SECRET_AUTH_TOKEN,
//         600, // optional param to customize maximum allowed age of the webhook event, defaults to 600s
//       );
//     } catch (error) {
//       // In case of invalid signature verifyWebhookSignature will throw SignatureVerificationError
//       // for easier debugging you can access passed signatureHeader and webhookPayload values (error.detail.signatureHeader, error.detail.webhookPayload)
//       console.error(error);
//       return response.status(400).send('Signature is not valid!');
//     }
//     // Signature is valid
//     const type = request.body.type;
//     const payload = request.body.payload;
//     // Process the incoming event
//     switch (type) {
//       case 'transaction':
//         // process Transaction event
//         console.log(`Received ${payload.length} transactions`);
//         // loop through the payload (payload is an array of Transaction events)
//         for (const transaction of payload) {
//           console.log(`Transaction ${transaction.tx.hash}`);
//         }
//         break;
//       case 'block':
//         // process Block event
//         console.log(`Received block hash ${payload.hash}`);
//         break;
//       case 'delegation':
//         // process Delegation event
//         console.log(`Received ${payload.length} delegations`);
//         // loop through the payload, payload is an array of objects with fields: "tx" (an object) and "delegations" (an array)
//         for (const transaction of payload) {
//           for (const delegation of transaction.delegations) {
//             console.log(
//               `Delegation from address ${delegation.address} included in tx ${transaction.tx.hash}`,
//             );
//           }
//         }
//         break;
//       case 'epoch':
//         // process Epoch event
//         console.log(
//           `Epoch switch from ${payload.previous_epoch.epoch} to ${payload.current_epoch.epoch}`,
//         );
//         break;
//       default:
//         console.warn(`Unexpected event type ${type}`);
//         break;
//     }
//     // Return status code 2xx
//     response.json({ processed: true });
//   },
// );
// app.listen(6666, () => console.log('Running on port 6666'));
