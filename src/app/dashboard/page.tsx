"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, List, MoreVertical, Copy, ExternalLink, Trash2, Search, Filter, LogOut, User } from "lucide-react";

interface Form {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  fields: { id: string }[];
}

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchForms();
  }, []);

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

  const fetchForms = async () => {
    try {
      const response = await fetch("/api/forms", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setForms(data);
      } else if (response.status === 401) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Erro ao buscar formulários:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/p/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link público copiado!");
  };

  const deleteForm = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este formulário?")) return;

    try {
      const response = await fetch(`/api/forms/${id}`, { method: "DELETE", credentials: "include" });
      if (response.ok) {
        setForms(forms.filter(f => f.id !== id));
      } else if (response.status === 401) {
        router.push("/auth/login");
      }
    } catch (error) {
      alert("Erro ao excluir o formulário.");
    }
  };

  const filteredForms = forms.filter(form => 
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar (Desktop) / Mobile Nav (Simplified for demo) */}
      <nav className="bg-contix-primary text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tight">Contix</h1>
            <div className="hidden md:flex gap-6 text-sm font-medium opacity-80">
              <Link href="/dashboard" className="hover:opacity-100 border-b-2 border-white pb-1">Formulários</Link>
              <Link href="/dashboard/titulares" className="hover:opacity-100">Titulares</Link>
              <Link href="/dashboard/indicadores" className="hover:opacity-100">Indicadores</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
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
      </nav>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-contix-primary">Meus Formulários</h2>
            <p className="text-gray-500 mt-1">Gerencie seus formulários de consentimento LGPD.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center bg-white rounded-xl px-4 py-2.5 border border-gray-200 shadow-sm flex-1 md:flex-none">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar formulário..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full md:w-64 text-black placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link 
              href="/dashboard/builder"
              className="flex items-center gap-2 bg-contix-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 shadow-lg transition-all"
            >
              <Plus size={20} /> Novo Formulário
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contix-primary"></div>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <LayoutGrid size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Nenhum formulário encontrado</h3>
            <p className="text-gray-500 max-w-sm mt-2">Você ainda não criou nenhum formulário de consentimento. Comece agora mesmo!</p>
            <Link 
              href="/dashboard/builder"
              className="mt-8 text-contix-primary font-bold hover:underline"
            >
              Criar meu primeiro formulário
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div key={form.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-contix-primary/5 p-3 rounded-xl">
                    <LayoutGrid size={24} className="text-contix-primary" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => copyLink(form.id)}
                      className="p-2 text-gray-400 hover:text-contix-primary hover:bg-contix-primary/5 rounded-lg transition-colors"
                      title="Copiar Link"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => deleteForm(form.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-contix-primary mb-2 line-clamp-1">{form.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{form.description || "Sem descrição."}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {form.fields.length} campos
                  </span>
                  <Link 
                    href={`/p/${form.id}`}
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-bold text-contix-primary hover:underline"
                  >
                    Ver público <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="p-8 border-t border-gray-200 bg-white text-center text-sm text-gray-400">
        &copy; 2026 Contix - Gestão de Consentimentos LGPD. Todos os direitos reservados.
      </footer>
    </div>
  );
}
