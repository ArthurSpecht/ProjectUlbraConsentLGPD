"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Search, ArrowLeft, FileText, TrendingUp, PieChart, Activity, LogOut } from "lucide-react";

interface Indicator {
  id: string;
  title: string;
  submissionCount: number;
  createdAt: string;
}

export default function IndicadoresPage() {
  const [indicadores, setIndicadores] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchIndicadores();
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

  const fetchIndicadores = async () => {
    try {
      const response = await fetch("/api/indicadores", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setIndicadores(data);
      } else if (response.status === 401) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Erro ao buscar indicadores:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSubmissions = indicadores.reduce((acc, curr) => acc + curr.submissionCount, 0);

  const filteredIndicadores = indicadores.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Link href="/dashboard/titulares" className="hover:opacity-100">Titulares</Link>
              <Link href="/dashboard/indicadores" className="hover:opacity-100 border-b-2 border-white pb-1">Indicadores</Link>
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
              <BarChart3 size={32} /> Indicadores de Performance
            </h2>
            <p className="text-gray-500 mt-1">Visão geral do engajamento e preenchimentos por formulário.</p>
          </div>
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-contix-primary font-bold hover:underline"
          >
            <ArrowLeft size={20} /> Voltar para Formulários
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="bg-contix-primary/10 p-4 rounded-xl text-contix-primary">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total de Preenchimentos</p>
              <h3 className="text-3xl font-bold text-contix-primary">{totalSubmissions}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-xl text-green-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Formulários Ativos</p>
              <h3 className="text-3xl font-bold text-gray-800">{indicadores.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Média por Form.</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {indicadores.length > 0 ? (totalSubmissions / indicadores.length).toFixed(1) : 0}
              </h3>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-contix-primary"></div>
          </div>
        ) : filteredIndicadores.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <PieChart size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Sem dados para exibir</h3>
            <p className="text-gray-500 max-w-sm mt-2">Crie formulários e comece a coletar dados para ver seus indicadores.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-700">Ranking de Preenchimentos</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredIndicadores.map((item, index) => (
                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-contix-primary">{item.title}</h4>
                      <p className="text-xs text-gray-400">Criado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    {/* Visual Progress Bar */}
                    <div className="hidden md:block w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-contix-primary rounded-full" 
                        style={{ 
                          width: `${totalSubmissions > 0 ? (item.submissionCount / Math.max(...indicadores.map(i => i.submissionCount))) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="text-right min-w-[100px]">
                      <span className="text-2xl font-bold text-contix-primary">{item.submissionCount}</span>
                      <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">preenchimentos</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="p-8 border-t border-gray-200 bg-white text-center text-sm text-gray-400">
        &copy; 2026 Contix - Gestão de Consentimentos LGPD. Todos os direitos reservados.
      </footer>
    </div>
  );
}
