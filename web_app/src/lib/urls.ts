export const urls = {
  backend:
    process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/",
  frontend:
    process.env.NODE_ENV === "production"
      ? "freliq.com"
      : "http://localhost:3000",
};
