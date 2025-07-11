// app/imoveis/page.tsx
'use client';

import { useImoveis } from "@/context/imoveis-context";
import CardImovel from "@/components/features/CardImovel";
import { ImovelFilters } from "@/components/features/ImovelFilters";
import { useImovelFilters } from "@/lib/hooks/useImovelFilters";
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function ImoveisPage() {
  // Pega os dados do contexto global
  const { imoveis, isLoading, favorites } = useImoveis();
  // Hook customizado que gerencia todos os filtros e retorna os imóveis já filtrados
  const { imoveisProcessados, opcoes, filtros, handlers, limparFiltros } = useImovelFilters(imoveis);

  // Tela de loading enquanto processa o CSV
  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-lg animate-pulse">Processando planilha...</p>
      </main>
    );
  }

  // Se não tem dados, mostra tela vazia com link pra voltar
  if (!imoveis || imoveis.length === 0) {
    return (
      <main className="flex flex-col h-screen items-center justify-center text-center">
        <p className="text-xl font-semibold">Nenhum imóvel para exibir.</p>
        <p className="text-muted-foreground mb-4">Volte e carregue uma planilha para começar.</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 py-2">
          Voltar para a Home
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* Cabeçalho com logo, contador e links de navegação */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/images/garimpeiro-home.png"
            alt="Mascote Garimpeiro Genes"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold">Imóveis Encontrados ({imoveisProcessados.length})</h1>
        </div>
        
        {/* Links de navegação */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/favoritos" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline whitespace-nowrap">
            <Star className="h-4 w-4" />
            Favoritos ({favorites.length})
          </Link>
          <Link href="/" className="text-sm font-medium text-primary hover:underline whitespace-nowrap">
            Carregar outra planilha
          </Link>
        </div>
      </div>
      
      {/* Componente de filtros - passa todas as props necessárias */}
      <ImovelFilters 
        opcoes={opcoes}
        filtros={filtros}
        handlers={handlers}
        onClear={limparFiltros}
      />
      
      {/* Grid de cards ou mensagem se não encontrou nada */}
      {imoveisProcessados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {imoveisProcessados.map((imovel) => (
            <CardImovel key={imovel.id} imovel={imovel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-semibold">Nenhum imóvel encontrado</p>
          <p className="text-muted-foreground">Tente ajustar ou limpar os filtros para ver os resultados.</p>
        </div>
      )}
    </main>
  );
}