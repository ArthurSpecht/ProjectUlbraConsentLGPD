"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Search, ArrowLeft, Mail, FileText, Calendar, Trash2, Download, LogOut } from "lucide-react";

interface Titular {
  id: string;
  nome: string;
  email: string;
  formTitle: string;
  createdAt: string;
}

export default function TitularesPage() {
  const [titulares, setTitulares] = useState<Titular[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTitulares();
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

  const fetchTitulares = async () => {
    try {
      const response = await fetch("/api/titulares", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setTitulares(data);
      } else if (response.status === 401) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Erro ao buscar titulares:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevogar = async (id: string) => {
    if (!confirm("Tem certeza que deseja revogar este consentimento? O titular será removido permanentemente.")) return;

    try {
      const response = await fetch(`/api/submissions/${id}`, { method: "DELETE", credentials: "include" });
      if (response.ok) {
        setTitulares(titulares.filter(t => t.id !== id));
        alert("Consentimento revogado com sucesso!");
      } else {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        alert("Erro ao revogar consentimento.");
      }
    } catch (error) {
      alert("Erro ao revogar consentimento.");
    }
  };

  const handleExportXLSX = () => {
    if (titulares.length === 0) return;

    // Criar cabeçalho do CSV
    let csv = "Nome,E-mail,Formulario,Data de Interacao\n";
    
    // Adicionar linhas
    titulares.forEach(t => {
      const date = new Date(t.createdAt).toLocaleDateString('pt-BR');
      csv += `"${t.nome}","${t.email}","${t.formTitle}","${date}"\n`;
    });

    // Criar blob e download
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "titulares_contix.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTitulares = titulares.filter(t => 
    t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.formTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-contix-primary text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tight">Contix</h1>
            <div className="hidden md:flex gap-6 text-sm font-medium opacity-80">
              <Link href="/dashboard" className="hover:opacity-100">Formulários</Link>
              <Link href="/dashboard/titulares" className="hover:opacity-100 border-b-2 border-white pb-1">Titulares</Link>
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
            <h2 className="text-3xl font-bold text-contix-primary flex items-center gap-3">
              <Users size={32} /> Titulares Interagindo
            </h2>
            <p className="text-gray-500 mt-1">Lista de pessoas que preencheram seus formulários de consentimento.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleExportXLSX}
              className="flex items-center gap-2 bg-white text-contix-primary border-2 border-contix-primary px-6 py-2.5 rounded-xl font-bold hover:bg-contix-primary hover:text-white transition-all shadow-sm"
            >
              <Download size={20} /> Exportar XLSX
            </button>
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-contix-primary font-bold hover:underline py-2.5"
            >
              <ArrowLeft size={20} /> Voltar
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contix-primary"></div>
          </div>
        ) : filteredTitulares.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <Users size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Nenhum titular encontrado</h3>
            <p className="text-gray-500 max-w-sm mt-2">Ainda não houve interações com seus formulários publicados.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Formulário</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTitulares.map((titular) => (
                  <tr key={titular.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-contix-primary/10 rounded-full flex items-center justify-center text-contix-primary font-bold text-xs">
                          {titular.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{titular.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        {titular.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-contix-primary font-medium">
                        <FileText size={16} className="text-contix-primary/50" />
                        {titular.formTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(titular.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRevogar(titular.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={14} /> Revogar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="p-8 border-t border-gray-200 bg-white text-center text-sm text-gray-400">
        &copy; 2026 Contix - Gestão de Consentimentos LGPD. Todos os direitos reservados.
      </footer>
    </div>
  );
}
