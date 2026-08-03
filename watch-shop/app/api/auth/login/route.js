import { NextResponse } from "next/server";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

// POST /api/auth/login
export async function POST(request) {
  const { username, password } = await request.json();

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, message: "Login yoki parol noto'g'ri" },
      { status: 401 }
    );
  }

  const token = await signAdminToken({ username, role: "admin" });

  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 kun
  });

  return response;
}

// DELETE /api/auth/login  -> logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
