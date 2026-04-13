import { app, API_PREFIX } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com"
      : `http://localhost:${PORT}`;

  console.log(`[server]: Server is running at ${baseUrl}${API_PREFIX}`);
  console.log(
    `[swagger]: API Documentation available at ${baseUrl}${API_PREFIX}/api-docs`,
  );
});
