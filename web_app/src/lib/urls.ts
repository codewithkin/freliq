export const urls = {
  backend:
    process.env.NODE_ENV === "production"
      ? "https://freliq-chat-backend.onrender.com"
      : process.env.BACKEND_URL,
  frontend:
    process.env.NODE_ENV === "production"
      ? "freliq.com"
      : process.env.BETTER_AUTH_URL,
};
