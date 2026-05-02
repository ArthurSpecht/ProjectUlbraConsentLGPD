import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = db.users.findUnique({ email });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ message: "Login realizado com sucesso." });
    response.cookies.set({
      name: "session",
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Ocorreu um erro ao fazer login." },
      { status: 500 }
    );
  }
}
