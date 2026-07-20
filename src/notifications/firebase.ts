import dotenv from 'dotenv';
dotenv.config();

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      // type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      // privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // clientId: process.env.FIREBASE_CLIENT_ID,
      // authUri: process.env.FIREBASE_AUTH_URI,
      // tokenUri: process.env.FIREBASE_TOKEN_URI,
      // authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      // clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      // universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    }),
  });

  console.log('Firebase initialized successfully');
}

export { getMessaging };


// import { initializeApp, cert, getApps } from 'firebase-admin/app';
// import { getMessaging } from 'firebase-admin/messaging';

// import serviceAccount from '../config/firebase-service-account.json';

// if (!getApps().length) {
//   initializeApp({
//     credential: cert(serviceAccount as any),
//   });
//   console.log('Firebase initialized successfully');
// }

// export { getMessaging };