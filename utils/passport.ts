import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "../prisma/client";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.upsert({
            where: { email },
            update: {
              googleId: profile.id,
              firstName:
                profile.name?.givenName || profile.displayName || "User",
              lastName: profile.name?.familyName || "",
              avatarUrl: profile.photos?.[0]?.value,
            },
            create: {
              googleId: profile.id,
              email,
              firstName:
                profile.name?.givenName || profile.displayName || "User",
              lastName: profile.name?.familyName || "",
              avatarUrl: profile.photos?.[0]?.value,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in GitHub profile"));
        }

        let user = await prisma.user.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await prisma.user.upsert({
            where: { email },
            update: {
              githubId: profile.id,
              firstName: profile.displayName || profile.username || "User",
              lastName: "",
              avatarUrl: profile.photos?.[0]?.value,
            },
            create: {
              githubId: profile.id,
              email,
              firstName: profile.displayName || profile.username || "User",
              lastName: "",
              avatarUrl: profile.photos?.[0]?.value,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
