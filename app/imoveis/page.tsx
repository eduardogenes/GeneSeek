// app/imoveis/page.tsx
'use client';

import { useImoveis } from "@/context/imoveis-context";
import CardImovel from "@/components/features/CardImovel";
import { ImovelFilters } from "@/components/features/ImovelFilters";
import { useImovelFilters } from "@/lib/hooks/useImovelFilters";

export default function ImoveisPage() {
  const { imoveis, isLoading } = useImoveis();

  const { imoveisFiltrados, opcoes, filtros, handlers, limparFiltros } = useImovelFilters(imoveis);

  if (isLoading) {
    return <main className="p-8"><p>Processando planilha...</p></main>;
  }

  if (!imoveis || imoveis.length === 0) {
    return <main className="p-8"><p>Nenhum imóvel para exibir. Volte e carregue uma planilha.</p></main>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Imóveis Encontrados ({imoveisFiltrados.length})</h1>

      <ImovelFilters 
        opcoes={opcoes}
        filtros={filtros}
        handlers={handlers}
        onClear={limparFiltros}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imoveisFiltrados.map((imovel) => (
          <CardImovel key={imovel.id} imovel={imovel} />
        ))}
      </div>

      {imoveisFiltrados.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg font-medium">Nenhum imóvel encontrado</p>
          <p className="text-muted-foreground">Tente ajustar ou limpar os filtros.</p>
        </div>
      )}
    </main>
  );
}