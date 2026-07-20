import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

import serviceAccount from '../config/firebase-service-account.json';

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
  console.log('Firebase initialized successfully');
}

export { getMessaging };