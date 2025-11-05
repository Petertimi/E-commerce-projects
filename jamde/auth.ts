import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
	session: { strategy: "jwt" },
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const email = credentials.email as unknown as string;
                const password = credentials.password as unknown as string;
                const user = await prisma.user.findUnique({ where: { email } });
				if (!user || !user.password) return null;
                const valid = await bcrypt.compare(password, user.password);
				if (!valid) return null;
				return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role } as any;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = (user as any).id;
				token.role = (user as any).role ?? token.role;
			}
			if (!token.role && token.email) {
				const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
				if (dbUser) token.role = dbUser.role;
			}
			return token;
		},
		async session({ session, token }) {
			(session.user as any).id = (token as any).id;
			(session.user as any).role = (token as any).role;
			return session;
		},
	},
});
