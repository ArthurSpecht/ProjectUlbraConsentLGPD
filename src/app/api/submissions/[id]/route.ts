import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = cookies().get("session")?.value;

    if (!userId) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const submission = db.submissions.findUnique({ id: params.id });
    if (!submission) {
      return NextResponse.json(
        { message: "Submissão não encontrada ou não autorizada." },
        { status: 403 }
      );
    }

    const form = db.forms.findUnique({ id: submission.formId });
    if (!form || form.userId !== userId) {
      return NextResponse.json(
        { message: "Submissão não encontrada ou não autorizada." },
        { status: 403 }
      );
    }

    db.submissions.delete({ id: params.id });

    return NextResponse.json({ message: "Consentimento revogado com sucesso." });
  } catch (error) {
    console.error("Erro ao revogar consentimento:", error);
    return NextResponse.json(
      { message: "Erro ao revogar consentimento." },
      { status: 500 }
    );
  }
}
