import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { AppDataSource } from './lib/db/data-source';
import { AdminUser } from './lib/db/entities/AdminUser';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            name: 'Dev Login',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                // Only allow credentials login in development
                if (process.env.NODE_ENV === 'production') {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                // Simple mock check matching previous implementation
                if (password === 'admin123') {
                    // Check if user exists in DB (optional for dev, but good practice)
                    if (!AppDataSource.isInitialized) {
                        await AppDataSource.initialize();
                    }
                    const userRepo = AppDataSource.getRepository(AdminUser);
                    const user = await userRepo.findOneBy({ email });

                    if (user) {
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            name: user.name,
                        };
                    }
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                if (!user.email) return false;

                try {
                    if (!AppDataSource.isInitialized) {
                        await AppDataSource.initialize();
                    }
                    const userRepo = AppDataSource.getRepository(AdminUser);
                    let dbUser = await userRepo.findOneBy({ email: user.email });

                    // Allow access if email matches ADMIN_EMAIL env var
                    // If user doesn't exist in DB, create them
                    const adminEmail = process.env.ADMIN_EMAIL;
                    if (!dbUser && adminEmail && user.email === adminEmail) {
                        console.log(`Auto-registering admin user: ${user.email}`);
                        dbUser = userRepo.create({
                            email: user.email,
                            name: user.name || 'Admin',
                            googleUid: account.providerAccountId,
                        });
                        await userRepo.save(dbUser);
                    }

                    if (!dbUser) {
                        console.log(`Access denied for ${user.email}: Not in admin_users table`);
                        return false;
                    }

                    // Update google_uid if not set
                    if (!dbUser.googleUid && account.providerAccountId) {
                        dbUser.googleUid = account.providerAccountId;
                        await userRepo.save(dbUser);
                    }

                    // Map DB ID to user object for session callback
                    user.id = dbUser.id.toString();
                    return true;
                } catch (error) {
                    console.error('Error in signIn callback:', error);
                    return false;
                }
            }
            return true; // Allow credentials login
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
    },
});
