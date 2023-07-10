const PORT = 4040;
const HOST = "0.0.0.0";
import app from "./app";

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
