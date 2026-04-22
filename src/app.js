const express = require("express");
const webhookRoute = require("./routes/webhook");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/webhook", webhookRoute);

const DEFAULT_PORT = Number(process.env.PORT || 3000);
const MAX_PORT_RETRIES = 10;

function startServer(port, retriesLeft) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && retriesLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy, trying ${nextPort}`);
      startServer(nextPort, retriesLeft - 1);
      return;
    }

    console.error("Server failed to start:", error.message);
    process.exit(1);
  });
}

startServer(DEFAULT_PORT, MAX_PORT_RETRIES);
