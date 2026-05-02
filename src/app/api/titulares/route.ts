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
    const result: any[] = [];

    forms.forEach((form) => {
      const submissions = db.submissions.findMany({ formId: form.id });
      submissions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      submissions.forEach((submission) => {
        try {
          const submittedData = JSON.parse(submission.data);
          let nome = "Não informado";
          let email = "Não informado";

          form.fields.forEach((field) => {
            const value = submittedData[field.id];
            if (value) {
              const labelLower = field.label.toLowerCase();
              if (labelLower.includes("nome")) nome = value;
              if (labelLower.includes("email") || labelLower.includes("e-mail")) email = value;
            }
          });

          result.push({
            id: submission.id,
            nome,
            email,
            formTitle: form.title,
            createdAt: submission.createdAt,
          });
        } catch (e) {
          console.error("Erro ao processar submissão:", e);
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar titulares." },
      { status: 500 }
    );
  }
}
