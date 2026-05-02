"use client";
import Link from "next/link";
import { CheckCircle, Shield, FileText, Link as LinkIcon, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="px-6 lg:px-20 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-contix-primary rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-contix-dark">contix</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-contix-dark font-medium hover:text-contix-primary transition-colors">
            Entrar
          </Link>
          <Link href="/auth/register" className="px-5 py-2 bg-contix-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all">
            Criar Conta
          </Link>
        </div>
      </nav>

      <section className="px-6 lg:px-20 pt-16 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-contix-primary rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <span className="text-5xl font-bold text-contix-dark">contix</span>
            </div>
            <p className="text-xl text-contix-gray mb-12">Formulários que geram confiança.</p>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-contix-dark mb-6 leading-tight">
              Gestão de Consentimentos <br />
              <span className="text-contix-primary">LGPD</span>
            </h1>
            <p className="text-xl text-contix-gray max-w-3xl mx-auto mb-12">
              Crie, personalize e gerencie formulários de consentimento para seus clientes de forma simples, segura e em conformidade com a lei.
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <Link 
                href="/auth/login" 
                className="px-10 py-4 bg-contix-primary text-black rounded-xl font-bold text-lg border-2 border-contix-dark hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Acessar Plataforma
              </Link>
              <Link 
                href="/auth/register" 
                className="px-10 py-4 border-2 border-contix-primary text-contix-primary rounded-xl font-semibold text-lg hover:bg-contix-primary hover:text-white transition-all"
              >
                Criar Conta Gratuita
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-contix-light rounded-2xl hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-contix-primary/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-contix-primary" />
              </div>
              <h3 className="text-xl font-bold text-contix-dark mb-2">Personalização Total</h3>
              <p className="text-contix-gray">Crie campos personalizados, defina obrigatoriedade e títulos para suas perguntas.</p>
            </div>
            
            <div className="p-8 bg-contix-light rounded-2xl hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-contix-primary/10 rounded-xl flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-contix-primary" />
              </div>
              <h3 className="text-xl font-bold text-contix-dark mb-2">Links Públicos</h3>
              <p className="text-contix-gray">Gere links acessíveis para seus clientes preencherem os formulários parametrizados.</p>
            </div>
            
            <div className="p-8 bg-contix-light rounded-2xl hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-contix-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-contix-primary" />
              </div>
              <h3 className="text-xl font-bold text-contix-dark mb-2">Conformidade LGPD</h3>
              <p className="text-contix-gray">Mantenha os registros de consentimento organizados e em conformidade com a lei.</p>
            </div>
            
            <div className="p-8 bg-contix-light rounded-2xl hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-contix-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-contix-primary" />
              </div>
              <h3 className="text-xl font-bold text-contix-dark mb-2">Indicadores</h3>
              <p className="text-contix-gray">Acompanhe o desempenho dos seus formulários com métricas detalhadas.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 lg:px-20 py-12 bg-contix-dark">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-contix-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">contix</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 Contix. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
