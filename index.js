const express = require("express");
const server = express();

const api = require("./api/server.js");

server.use(express.json());
server.use("/api", api);

const PORT = 8000;
server.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));