export const urls = {
  backend: process.env.NODE_ENV === "production" ? "" : "http://locahost:8080/",
  frontend:
    process.env.NODE_ENV === "production"
      ? "freliq.com"
      : "http://locahost:3000",
};
