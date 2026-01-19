// trigger redeploy - paso 1

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CHATWOOT_HMAC_SECRET = process.env.CHATWOOT_HMAC_SECRET || "";

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "agent-backend",
    timestamp: new Date().toISOString()
  });
});

/**
 * Endpoint para recibir lead desde la landing
 * y generar identifier_hash para Chatwoot
 */
app.post("/lead", (req, res) => {
  const { name, phone, email } = req.body || {};

  if (!name || (!phone && !email)) {
    return res.status(400).json({
      error: "Falta name y (phone o email)"
    });
  }

  if (!CHATWOOT_HMAC_SECRET) {
    return res.status(500).json({
      error: "CHATWOOT_HMAC_SECRET no configurado en Railway"
    });
  }

  const identifier =
    (email && email.toLowerCase()) ||
    phone ||
    crypto.randomUUID();

  const identifier_hash = crypto
    .createHmac("sha256", CHATWOOT_HMAC_SECRET)
    .update(identifier)
    .digest("hex");

  console.log("Nuevo lead recibido:", {
    name,
    phone,
    email,
    identifier
  });

  res.json({
    identifier,
    identifier_hash
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
