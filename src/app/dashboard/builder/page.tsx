"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, CheckCircle2, Copy, ExternalLink, ArrowLeft, LogOut } from "lucide-react";

interface FormField {
  id?: string;
  label: string;
  type: string;
  required: boolean;
}

export default function FormBuilderPage({ params }: { params?: { id?: string } }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    { label: "Nome Completo", type: "text", required: true },
    { label: "E-mail", type: "email", required: true },
  ]);
  const [loading, setLoading] = useState(false);
  const [savedFormId, setSavedFormId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (response.ok) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const addField = () => {
    setFields([...fields, { label: "Nova Pergunta", type: "text", required: false }]);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const handleSave = async () => {
    if (!title) {
      alert("Por favor, dê um título ao seu formulário.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, fields }),
      });

      if (response.ok) {
        const data = await response.json();
        setSavedFormId(data.id);
        alert("Formulário salvo com sucesso!");
      } else {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        alert("Erro ao salvar o formulário.");
      }
    } catch (error) {
      alert("Erro ao salvar o formulário.");
    } finally {
      setLoading(false);
    }
  };

  const copyPublicLink = () => {
    if (!savedFormId) return;
    const url = `${window.location.origin}/p/${savedFormId}`;
    navigator.clipboard.writeText(url);
    alert("Link copiado para a área de transferência!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-contix-primary text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold mr-8">Contix</h1>
            <div className="hidden md:flex gap-6 text-sm font-medium opacity-80">
              <Link href="/dashboard" className="hover:opacity-100">Formulários</Link>
              <Link href="/dashboard/titulares" className="hover:opacity-100">Titulares</Link>
              <Link href="/dashboard/indicadores" className="hover:opacity-100">Indicadores</Link>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            {savedFormId && (
              <button 
                onClick={copyPublicLink}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm"
              >
                <Copy size={18} /> Copiar Link
              </button>
            )}
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-white text-contix-primary font-bold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 text-sm"
            >
              {loading ? "Salvando..." : <><CheckCircle2 size={18} /> Salvar Formulário</>}
            </button>
            
            <div className="relative ml-2">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/30 hover:bg-white/30 transition-all"
              >
                A
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 text-gray-700">
                  <div className="px-4 py-2 border-b border-gray-100 mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Usuário</p>
                    <p className="text-sm font-semibold truncate">Administrador</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Sair do sistema
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Editor Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-contix-primary border-b pb-2 mb-4">Informações Gerais</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Título do Formulário</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-contix-primary focus:border-contix-primary text-lg font-semibold text-black"
                  placeholder="Ex: Consentimento para Marketing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição/Instruções (Opcional)</label>
                <textarea 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-contix-primary focus:border-contix-primary text-black"
                  placeholder="Explique para que serve este consentimento..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-contix-primary">Campos do Formulário</h2>
                <button 
                  onClick={addField}
                  className="flex items-center gap-2 text-sm font-semibold text-contix-primary hover:bg-contix-primary/10 px-3 py-1.5 rounded-lg transition-all border border-contix-primary"
                >
                  <Plus size={16} /> Adicionar Campo
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título da Pergunta</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black"
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black"
                          value={field.type}
                          onChange={(e) => updateField(index, { type: e.target.value })}
                        >
                          <option value="text">Texto</option>
                          <option value="email">E-mail</option>
                          <option value="checkbox">Caixa de Seleção</option>
                          <option value="date">Data</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={() => removeField(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`req-${index}`}
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="w-4 h-4 text-contix-primary border-gray-300 rounded focus:ring-contix-primary"
                      />
                      <label htmlFor={`req-${index}`} className="text-sm text-gray-600 font-medium">Campo obrigatório</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview / Success Area */}
          <div className="space-y-6">
            <div className="bg-contix-primary text-white p-6 rounded-xl shadow-lg border border-contix-primary">
              <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
              <p className="text-sm opacity-80 mb-6">Personalize seu formulário e gere um link público para seus clientes preencherem agora mesmo.</p>
              
              {savedFormId ? (
                <div className="space-y-4">
                  <Link 
                    href={`/p/${savedFormId}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-contix-primary font-bold rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <ExternalLink size={18} /> Ver Link Público
                  </Link>
                  <button 
                    onClick={copyPublicLink}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-white/30 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Copy size={18} /> Copiar Link Público
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-white/10 rounded-lg border border-dashed border-white/30 text-center italic text-sm">
                  Salve o formulário para gerar o link público.
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Dica LGPD</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ao coletar dados, certifique-se de informar claramente a finalidade da coleta e por quanto tempo os dados serão armazenados. A Contix ajuda você a manter esses registros de forma organizada.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
