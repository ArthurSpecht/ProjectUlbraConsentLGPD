import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const form = db.forms.findUnique({ id: params.id });

    if (!form) {
      return NextResponse.json(
        { message: "Formulário não encontrado." },
        { status: 404 }
      );
    }

    db.submissions.create({
      formId: params.id,
      data: JSON.stringify(data),
    });

    return NextResponse.json({ message: "Respostas enviadas com sucesso." });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao enviar respostas." },
      { status: 500 }
    );
  }
}
