import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Indicativo', type: 'text' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        // Credenciales hardcodeadas
        const VALID_USERNAME = 'HI4NLE';
        const VALID_PASSWORD = 'Radioaficionado';

        if (
          credentials?.username === VALID_USERNAME &&
          credentials?.password === VALID_PASSWORD
        ) {
          return {
            id: '1',
            name: VALID_USERNAME,
            email: `${VALID_USERNAME}@radio.com`,
            callsign: VALID_USERNAME,
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.callsign = user.callsign;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.callsign = token.callsign as string;
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'radio-secret-key-for-development',
});

export { handler as GET, handler as POST };
