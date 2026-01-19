import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// PASSWORD FACIL
function generarPassword() {
  return "Casa" + Math.floor(1000 + Math.random() * 9000);
}

// WEBHOOK CHATWOOT
app.post("/chatwoot-webhook", async (req, res) => {
  try {
    const conversationId = req.body.conversation?.id;
    const accountId = req.body.account?.id;
    const sender = req.body.sender;

    if (!conversationId || !accountId || !sender) {
      return res.sendStatus(200);
    }

    const userName =
      sender.name?.toLowerCase().replace(/\s/g, "") +
      Math.floor(100 + Math.random() * 900);

    const phoneNumber = sender.phone_number || "000000000";
    const password = generarPassword();

    // CREAR USUARIO EN TU PANEL
    await axios.post(
      "https://admin-api.agt-digi.com/Player/Create",
      {
        userName,
        phoneNumber,
        password,
        confirmPassword: password,
        currencyCode: "PYG"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AGENT_TOKEN}`
        }
      }
    );

    // RESPONDER EN CHATWOOT
    await axios.post(
      `https://app.chatwoot.com/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
      {
        content: `🍀 *Gracias por registrarte*

👤 Usuario: *${userName}*
🔑 Contraseña: *${password}*
🔗 Ingresá acá: https://azar247.com

¡Muchos éxitos! 🎰`
      },
      {
        headers: {
          "Content-Type": "application/json",
          api_access_token: process.env.CW_TOKEN
        }
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// 🚀 IMPORTANTE: USAR PUERTO DE RAILWAY
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend activo en puerto", PORT);
});
