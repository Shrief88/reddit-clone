import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import env from "./validateEnv";
import prisma from "./prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.BASE_URL}:${env.PORT}/api/v1/auth/google/callback`,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const exisingUser = await prisma.user.findUnique({
          where: {
            googleId: profile.id,
          },
        });

        if (exisingUser) {
          done(null, exisingUser);
          return;
        }

        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.at(0)?.value ?? "",
            image: profile.photos?.at(0)?.value ?? "",
          },
        });
        done(null, newUser);
      } catch (err) {
        done(err as Error);
      }
    },
  ),
);
