import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

function generarPassword() {
  return "Casa" + Math.floor(1000 + Math.random()*9000);
}

app.post("/chatwoot-webhook", async (req, res) => {
  try {
    const name = req.body?.sender?.name || "jugador";
    const phone = req.body?.sender?.phone_number || "000000000";

    const password = generarPassword();

    await axios.post("https://admin-api.agt-digi.com/Player/Create", {
      userName: name.toLowerCase().replace(/\s/g, "") + Date.now().toString().slice(-3),
      phoneNumber: phone,
      password,
      confirmPassword: password,
      currencyCode: "PYG"
    }, {
      headers: {
        Authorization: "Bearer TU_AGENT_TOKEN"
      }
    });

    res.sendStatus(200);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.sendStatus(500);
  }
});

app.listen(3000);
