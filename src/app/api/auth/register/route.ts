import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const existingUser = db.users.findUnique({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "E-mail já cadastrado." },
        { status: 400 }
      );
    }

    const user = db.users.create({
      email,
      password,
      name: name || null,
    });

    return NextResponse.json({ message: "Usuário criado com sucesso." });
  } catch (error) {
    return NextResponse.json(
      { message: "Ocorreu um erro ao criar a conta." },
      { status: 500 }
    );
  }
}
