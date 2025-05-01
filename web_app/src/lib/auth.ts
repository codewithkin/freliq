import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { sendMagicLink } from "./sendMagicLink";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: ({ email, token, url }, request) =>
        sendMagicLink({ to: email, magicLinkUrl: url }, request),
    }),
    nextCookies(), // Hey Kin, make sure this is always the last plugin,
  ],
});
