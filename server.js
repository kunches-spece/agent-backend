const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CHATWOOT_HMAC_SECRET = process.env.CHATWOOT_HMAC_SECRET || "";

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "agent-backend" });
});

// generar identity para chatwoot
app.post("/lead", (req, res) => {
  const { name, phone, email } = req.body || {};

  if (!name || (!phone && !email)) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const identifier =
    (email && email.toLowerCase()) ||
    phone ||
    crypto.randomUUID();

  if (!CHATWOOT_HMAC_SECRET) {
    return res.status(500).json({ error: "CHATWOOT_HMAC_SECRET no configurado" });
  }

  const identifier_hash = crypto
    .createHmac("sha256", CHATWOOT_HMAC_SECRET)
    .update(identifier)
    .digest("hex");

  console.log("Nuevo lead:", { name, phone, email });

  res.json({ identifier, identifier_hash });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// trigger redeploy
