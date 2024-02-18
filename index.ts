import db from "./src/database/models/index";
import app from "./app";

const PORT = 4040;
const HOST = "0.0.0.0";

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

const connectWithRetry = () => {
  db.sequelize
    .sync()
    .then(() => console.log("PostgreSQL connection was successful..."))
    .catch((e: any) => {
      console.log("Failed to sync db: " + e.message);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();
