import api from "@/services/api";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(
  request: NextRequest,
  response: NextResponse
) {
  const token = request.cookies.get("auth_token");
  const signInURL = new URL("/login", request.url);

  if (!token) {
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(signInURL);
  }
}

export const config = {
  matcher: ["/"],
};
