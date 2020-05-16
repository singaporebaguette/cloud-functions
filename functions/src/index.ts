import * as functions from 'firebase-functions';

const cors = require('cors');
const corsHandler = cors();

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

export const exportData = functions.region('asia-east2').https.onRequest((request, response) =>
  corsHandler(request, response, async () => {
    if (!request || !request.headers || !request.headers.authorization) {
      response.status(403).send('Unauthorized');
      return;
    }
    // @ts-ignore
    const idToken = request.headers.authorization.split('Bearer ')[1];
    const user = await admin.auth().verifyIdToken(idToken);

    if (!['ETWYO4lPKSSq5IclOSvha2etFz82', 'teBxhoPLshQh8DO38ssoWXNms6h2'].includes(user.uid)) {
      response.status(403).send('Unauthorized');
      return;
    }


    // retrieve all data // expensive request
    const snapshot = await admin.firestore().collection('stores').get();
    const docs = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));


    response.status(200).send(docs);
    return;
  })
);
