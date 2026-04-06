import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://petflow-beta.vercel.app"
      : `http://localhost:${PORT}`;

  console.log(`[server]: Server is running at ${baseUrl}`);
  console.log(`[swagger]: API Documentation available at ${baseUrl}/api-docs`);
});
