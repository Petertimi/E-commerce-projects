import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: Request & { nextUrl: URL }) {
	const nextUrl = (req as any).nextUrl as URL;
	const token = await getToken({ req: req as any, secret: process.env.AUTH_SECRET });
	const isLoggedIn = !!token;
	const role = (token as any)?.role as string | undefined;

	if (nextUrl.pathname.startsWith("/account") && !isLoggedIn) {
		const url = new URL("/api/auth/signin", nextUrl);
		url.searchParams.set("callbackUrl", nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	if (nextUrl.pathname.startsWith("/admin")) {
		if (!isLoggedIn) {
			const url = new URL("/api/auth/signin", nextUrl);
			url.searchParams.set("callbackUrl", nextUrl.pathname);
			return NextResponse.redirect(url);
		}
		if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/account/:path*"] };
