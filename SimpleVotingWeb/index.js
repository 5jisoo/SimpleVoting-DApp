import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  "/node_modules",
  express.static(path.join(__dirname, "node_modules"), {
    setHeaders: function (res, filePath) {
      if (filePath.endsWith(".js")) {
        res.set("Content-Type", "application/javascript");
      }
    },
  })
);
app.use("/src", express.static(path.join(__dirname, "src")));
app.use("/contracts", express.static(path.join(__dirname, "contracts")));
app.use("/", express.static(path.join(__dirname, "assets")));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
