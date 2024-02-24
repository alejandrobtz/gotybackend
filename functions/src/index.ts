
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

var serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.json({
    mensaje: "HOLA MUNDO DESDE FIREBASE LOCAL!!!"
  });
});


export const getGOTY = onRequest(async (request, response) => {
    
    const gotyRef = db.collection('goty');
    const games = await gotyRef.get().then(snap => snap.docs.map(doc => doc.data()));
    
    response.json(
       games
    )
});

