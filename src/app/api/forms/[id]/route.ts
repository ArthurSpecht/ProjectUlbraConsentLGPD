import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const form = db.forms.findUnique({ id: params.id });

    if (!form) {
      return NextResponse.json(
        { message: "Formulário não encontrado." },
        { status: 404 }
      );
    }

    form.fields.sort((a, b) => a.order - b.order);

    return NextResponse.json(form);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar formulário." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = cookies().get("session")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const form = db.forms.findUnique({ id: params.id });

    if (!form || form.userId !== userId) {
      return NextResponse.json(
        { message: "Formulário não encontrado ou não autorizado." },
        { status: 403 }
      );
    }

    db.forms.delete({ id: params.id });

    return NextResponse.json({ message: "Formulário excluído com sucesso." });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao excluir formulário." },
      { status: 500 }
    );
  }
}
