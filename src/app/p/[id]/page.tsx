"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export default function PublicFormPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data);
      } else {
        setError("Este formulário não existe ou não está mais disponível.");
      }
    } catch (error) {
      setError("Ocorreu um erro ao carregar o formulário.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch(`/api/forms/${params.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Ocorreu um erro ao enviar suas respostas.");
      }
    } catch (error) {
      alert("Ocorreu um erro ao enviar suas respostas.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Loader2 className="animate-spin text-contix-primary" size={48} />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ops! Algo deu errado.</h1>
          <p className="text-gray-600 mb-6">{error || "Formulário não encontrado."}</p>
          <div className="text-xs text-gray-400 mt-8 border-t pt-4">
            Desenvolvido por <span className="font-bold text-contix-primary">Contix</span>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Respostas Enviadas!</h1>
          <p className="text-gray-600 mb-6">Obrigado por preencher o formulário de consentimento. Suas informações foram registradas com sucesso.</p>
          <div className="text-xs text-gray-400 mt-8 border-t pt-4">
            Powered by <span className="font-bold text-contix-primary">Contix</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Branding Header */}
        <div className="bg-contix-primary p-8 text-white text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase opacity-70 mb-2">Contix - Consentimento LGPD</h2>
          <h1 className="text-3xl font-bold">{form.title}</h1>
          {form.description && (
            <p className="mt-4 text-white/80 leading-relaxed italic">{form.description}</p>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === "checkbox" ? (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-contix-primary/30 transition-colors">
                    <input 
                      type="checkbox" 
                      id={field.id}
                      required={field.required}
                      onChange={(e) => handleInputChange(field.id, e.target.checked)}
                      className="w-5 h-5 text-contix-primary border-gray-300 rounded focus:ring-contix-primary"
                    />
                    <label htmlFor={field.id} className="text-sm text-gray-600 cursor-pointer select-none font-medium">
                      Eu aceito os termos descritos acima.
                    </label>
                  </div>
                ) : (
                  <input 
                    type={field.type}
                    required={field.required}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-contix-primary focus:border-contix-primary outline-none transition-all placeholder:text-gray-400 text-black"
                    placeholder={`Sua resposta aqui...`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
            <button 
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full md:w-auto md:px-12 py-4 bg-contix-primary text-white font-bold rounded-2xl hover:bg-opacity-90 shadow-lg shadow-contix-primary/20 transition-all disabled:opacity-50"
            >
              {submitting ? "Enviando..." : <><Send size={20} /> Enviar Consentimento</>}
            </button>
            <p className="text-[10px] text-gray-400 text-center max-w-sm">
              Ao clicar em enviar, você concorda que seus dados sejam processados de acordo com a LGPD e as finalidades descritas neste formulário.
            </p>
          </div>
        </form>
      </div>

      <div className="mt-8 text-gray-400 text-xs font-medium flex items-center gap-2">
        Criado por <span className="font-bold text-contix-primary/60 tracking-tight text-sm uppercase">Contix</span>
      </div>
    </div>
  );
}
