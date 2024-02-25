
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as express from "express";
import * as cors from "cors";

const app = express();
app.use(cors({origin: true}));
var serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.get('/goty', async (req, res) => {
  const gotyRef = db.collection('goty');
  const games = await gotyRef.get().then(snap => snap.docs.map(doc => doc.data()));
  
  res.json(
     games
  )
});

app.post('/goty/:id', async (req, res) => {
	const id = req.params.id;
	const gameSnap = await db.collection('goty').doc(id).get();

	if( !gameSnap.exists ){
		res.status(404).json({
			ok:false,
			msj: "Game doesn't exist "  + id
		});
	} else {
		const gameBefore = gameSnap.data();
		await gameSnap.ref.update({
			votes: gameBefore?.votes + 1
		});

		res.json({
			ok: true,
			msj: "Thanks for your vote to " + gameBefore?.name
		})

	
	}
})

export const api = functions.https.onRequest(app);
