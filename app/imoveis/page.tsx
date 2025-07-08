// app/imoveis/page.tsx
'use client';
import { useImoveis } from "@/context/imoveis-context";
import CardImovel from "@/components/ui/CardImovel";
import { Imovel } from "@/lib/types";

export default function ImoveisPage() {
  const { imoveis, isLoading } = useImoveis(); // Consumindo os dados do contexto

  if (isLoading) {
    return <main className="p-8"><p>Processando planilha...</p></main>;
  }

  if (!imoveis || imoveis.length === 0) {
    return <main className="p-8"><p>Nenhum imóvel para exibir. Volte e carregue uma planilha.</p></main>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Imóveis Encontrados</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imoveis.map((imovel, index) => (
          <CardImovel key={index} imovel={imovel} />
        ))}
      </div>
    </main>
  );
}