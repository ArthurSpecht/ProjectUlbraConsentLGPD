import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = cookies().get("session")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const forms = db.forms.findMany({ userId }).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(forms);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar formulários." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = cookies().get("session")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { title, description, fields } = await request.json();

    const form = db.forms.create({
      title,
      description: description || null,
      userId,
    });

    if (fields && fields.length > 0) {
      fields.forEach((field: any, index: number) => {
        db.forms.addField(form.id, {
          label: field.label,
          type: field.type,
          required: field.required,
          order: index,
        });
      });
    }

    return NextResponse.json(form);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar formulário." },
      { status: 500 }
    );
  }
}
