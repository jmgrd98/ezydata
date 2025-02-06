/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createHmac } from 'crypto';

admin.initializeApp();

// Helper to verify Clerk webhook signature
const verifyWebhook = (req: functions.https.Request, secret: string): boolean => {
  const signature = req.headers['svix-signature'] as string;
  const body = req.rawBody.toString();
  
  const expectedSignature = createHmac('sha256', secret)
    .update(body)
    .digest('base64');

  return signature === `v1,${expectedSignature}`;
};

export const handleClerkWebhook = functions.https.onRequest(
    async (req, res) => {
      // Verify the webhook signature
      const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
      if (!verifyWebhook(req, webhookSecret)) {
        res.status(401).send('Invalid signature');
        return;
      }
  
      // Parse the event
      const event = JSON.parse(req.rawBody.toString());
      if (event.type !== 'user.created') {
        res.status(400).send('Unsupported event type');
        return;
      }
  
      // Extract user data from the webhook payload
      const user = event.data;
      const userData = {
        email: user.email_addresses[0].email_address,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
  
      // Write to Firestore
      try {
        await admin.firestore().collection('users').doc(user.id).set(userData);
        res.status(200).send('User added to Firestore');
      } catch (error) {
        console.error('Error writing to Firestore:', error);
        res.status(500).send('Internal Server Error');
      }
    }
  );