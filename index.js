import App from "./app.js";

const port = 8000;
const app = new App("JWT_SECRET", "10m", "./private/db");

app.listen(port, () => console.log(`Listening at ${port}…`));
