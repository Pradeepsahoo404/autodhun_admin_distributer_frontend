import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const isProduction = process.env.NODE_ENV === 'production';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 5 * 60 },
  useSecureCookies: isProduction,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        idToken: token.idToken as string | undefined,
      };
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: !isProduction,
};
