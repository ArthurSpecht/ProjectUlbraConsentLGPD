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

    const forms = db.forms.findMany({ userId });
    const result = forms.map(form => {
      const submissions = db.submissions.findMany({ formId: form.id });
      return {
        id: form.id,
        title: form.title,
        submissionCount: submissions.length,
        createdAt: form.createdAt,
      };
    });

    result.sort((a, b) => b.submissionCount - a.submissionCount);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar indicadores:", error);
    return NextResponse.json(
      { message: "Erro ao buscar indicadores." },
      { status: 500 }
    );
  }
}
