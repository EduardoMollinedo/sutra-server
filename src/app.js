import { PORT } from "./config.js";

import express from "express";
import { GoogleAuth } from "google-auth-library";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // Si estás usando una versión anterior de Node.js
import admin from "firebase-admin";
import cors from "cors";

const serviceAccount = {
  type: "service_account",
  project_id: "react-practica-c706b",
  private_key_id: "78513031537654b1443dca5821ce4ea55fa98d9d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAHUgjL/KZ+1T9\nHSvUhNtndyvt5h1T3I4GFCbk/tArHrDIH1TpBARI5meHHvmaBokMFw2UrGKGqA2m\n3uc41pmVDMt6r+MGxuszxcyq8lSuRxhGOxJga7xJxbqTwz6kk0rlwM5O+cqA4ahm\ng0wnNoxyVYF4gXDOH1gP+oJyB8qoRfOB1+Tfb8B7gZOITz1uV4KPxltsWLAYosej\nRSitI47F7e3zKUr0UzJtoYR0+Z+P8kgYOZHGHG56/cg7I9UFMd/X6Xk0lNLQIQ2I\njpGZ3WfEoRDw6GU7vxsXPEKa5bf5E/E0lO0kY2V9rQJ5VuzfaOWyXYBvGhuRvqJD\n7/OYDl5zAgMBAAECggEAEuMuGEDasJcm7BBF+AmsdRfLIANLfIGxYtlGA6XQ+yme\nxrtcgouBt6sTSukEMBzsCgjALeQ5dt9RzEdGOJknQKH2j/7NKqQ8M9BYBrHMGoA5\n248WMkLqoDQfhkR1Ra0yJAltybzsKE9HL6Dr8pT91Nshiffr37qcJ/dV2MvO+aEP\nDig2CutTn3GYCLDljmQquVp+YaMlKI/RCFjDtQzWdpWOl4MXvwjzj4Bu7DVzL7GK\n/dnYywKx2TehvfLgEjK1T+CDZMpFXhWVJlzlkwpX8auv2D9qQQuR2bAmSq2EYzdF\nobJuDHzurmoFz1HxfioIZ/ru6LGmBIy5SYz/uCjnHQKBgQD4lbcikeDNqeo6uupA\nQCKqkaIPgRridO69nD/O8PAXHwMVK5DYu7y6Ya7I9BDPzj89D3PP9TKRyajb2KrI\nDBFT1cIToXMUrPNOroJPSfElnzDuB8MQiHWKvashvlBEL2OHF7QPVyupv3AD0PqM\nKw2Nlxbi/ZXPn0jTem9il1/mtQKBgQDF2FZjp/eYJxsSmQfLWgq1v+LlG2wL1OtD\nTtFuj+XnQXetMpENaML4u+G8nENq/0ZgFAeZvtDqfWVp7ZHqXspO4/v/qBxCk5vp\nwFHOSLHmOBLifORqUO5eqwEZwajioYOCmHgQPqPe3Z5Smrq1gGmtkdDpz1d2w4OK\nqYvaUmEBhwKBgDde8eoLYG2vOXNXizJAlvgzdEvL0Dc9IKivky7/UBt2VvNyPtNo\nDgPeGla8trnzEPcC6CMcVOVQbAJ8Yp4owftQk+hXgBDM7W1LRc9vgv2EVhvPMs4N\n91CuKt5bS/nELIE88GiyXBF1iPfwpr5uIJi3XOu23JXgvxIMJZ9qZHw5AoGBAIfu\nj8yAx1i+5ZbtlbFd+CXP5TDMmnu2mr3wFW0FaUxuaq+RIqA37l2/mOVh5+BH7C5v\nFJnJxPiXl2okVDDXV+DEO4v4ERKdIG6GOK6mu7QVqsP6U2XInT5l96eeq06q8hR0\ndWmT4DtrwS+4J7g0tmcO3J8IWmu7AVHwE6q5FvVZAoGBAMBh9zHR5E2rPoUCXF1v\nUpyLQ7qCMWK+CD2+oi9NYRoxveFdQb0UvV6tJCUpRpOuAkT670w4upEM/gtYhr4I\nzGVP/wp5WRGh1dtUFjDC6cNFW8GkrV5s3p/55D0vuHBqPaJd9z2zJmXCvOlmcH30\nurLnwm2iTuUWmXS1THUkWqIM\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-qfe6i@react-practica-c706b.iam.gserviceaccount.com",
  client_id: "110712681291535288867",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qfe6i%40react-practica-c706b.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use this after the variable declaration

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Inicializa GoogleAuth con tu cuenta de servicio
const SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];
// Configura el envío de notificaciones
// Configura el envío de notificaciones
async function sendNotificationFCM(title, body) {
  const auth = new GoogleAuth({
	credentials: serviceAccount, // Pasa el objeto de credenciales en lugar de `keyFilename`
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
      topic: "all", // Puedes ajustar para enviar a un token o grupo
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
      .subscribeToTopic([token], "all");
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
    res.status(200).send("Dispositivo suscrito al topic alls");
  } catch (error) {
    res.status(500).send("Error suscribiendo al topic");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
