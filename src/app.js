import { PORT } from "./config.js";

import express from "express";
import { GoogleAuth } from "google-auth-library";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // Si estás usando una versión anterior de Node.js
import admin from "firebase-admin";
import cors from "cors";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use this after the variable declaration

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Inicializa GoogleAuth con tu cuenta de servicio
const SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];
// Configura el envío de notificaciones
async function sendNotificationFCM(title, body) {
  const auth = new GoogleAuth({
    keyFilename: "./react-notify.json",
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  const fcmUrl =
    "https://fcm.googleapis.com/v1/projects/react-practica-c706b/messages:send";

  const message = {
    message: {
      notification: {
        title: title,
        body: body,
      },
      topic: "general", // Puedes ajustar para enviar a un token o grupo
    },
  };

  try {
    const response = await fetch(fcmUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Notificación enviada:", data);
    return data;
  } catch (error) {
    console.error("Error enviando notificación:", error);
    throw error;
  }
}

// Ruta para recibir la notificación desde el frontend
app.post("/sendNotification", async (req, res) => {
  const { title, body } = req.body;

  try {
    const response = await sendNotificationFCM(title, body);
    res.status(200).send("Notificación enviada");
  } catch (error) {
    res.status(500).send("Error enviando notificación");
  }
});

// Función para suscribir un token a un topic
const subscribeToTopic = async (token) => {
  try {
    // Suscribir el token al topic 'general'
    const response = await admin
      .messaging()
      .subscribeToTopic([token], "general");
    console.log("Suscripción exitosa:", response);
    return response;
  } catch (error) {
    console.error("Error al suscribir al topic:", error);
    throw error;
  }
};

// Ruta para recibir el token desde el frontend y suscribir al topic
app.post("/subscribe", async (req, res) => {
  const { token } = req.body;
  try {
    const response = await subscribeToTopic(token);
    res.status(200).send("Dispositivo suscrito al topic general");
  } catch (error) {
    res.status(500).send("Error suscribiendo al topic");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
