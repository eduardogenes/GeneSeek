// app/imoveis/[id]/page.tsx
'use client';

import { useImoveis } from "@/context/imoveis-context";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Imovel } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

// Página de detalhes de um imóvel específico
// Usa o ID da URL pra encontrar o imóvel na lista global
export default function DetalhesImovelPage() {
  const router = useRouter();
  const params = useParams();
  const { imoveis } = useImoveis();

  // Estado local pra guardar o imóvel encontrado
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Quando a página carrega, procura o imóvel pelo ID
  useEffect(() => {
    // Se ainda não tem imóveis carregados, não faz nada
    if (imoveis.length === 0) return;

    const imovelId = params.id as string;
    // Procura o imóvel na lista global
    const imovelEncontrado = imoveis.find(i => i.id === imovelId);

    if (imovelEncontrado) {
      setImovel(imovelEncontrado);
    } else {
      // Se não achou, volta pra lista
      console.error("Imóvel não encontrado:", imovelId);
      router.push('/imoveis');
    }
    setIsLoading(false);
  }, [imoveis, params.id, router]);

  // Telas de loading e erro
  if (isLoading) {
    return <main className="flex h-screen items-center justify-center"><p>A carregar detalhes...</p></main>;
  }

  if (!imovel) {
    return <main className="flex h-screen items-center justify-center"><p>Imóvel não encontrado.</p></main>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* Botão pra voltar pra lista */}
      <div className="mb-6">
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Voltar para a lista
        </Link>
      </div>

      <div className="bg-card border rounded-lg p-6 md:p-8">
        {/* Cabeçalho com localização */}
        <div className="border-b pb-4 mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{imovel.cidade} - {imovel.uf}</p>
          <h1 className="text-3xl font-bold text-primary mt-1">{imovel.bairro}</h1>
          <p className="text-muted-foreground mt-1">{imovel.endereco}</p>
        </div>

        {/* Layout em duas colunas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna principal com descrição */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Descrição</h2>
            <p className="text-foreground/90 whitespace-pre-wrap">{imovel.descricao || "Sem descrição disponível."}</p>
          </div>

          {/* Coluna lateral com informações financeiras */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detalhes Financeiros</h2>
            <div className="space-y-2 text-sm border p-4 rounded-md bg-muted/30">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Preço de Venda:</span>
                <span className="font-bold text-lg">R$ {imovel.preco || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor de Avaliação:</span>
                <span>R$ {imovel.valorAvaliacao || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span className="text-muted-foreground">Desconto:</span>
                <span className="font-bold text-lg">{parseFloat(imovel.desconto).toFixed(2)}%</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Modalidade de Venda</h3>
              <p className="bg-secondary text-secondary-foreground font-medium py-1 px-2 rounded-md inline-block">{imovel.modalidadeVenda}</p>
            </div>

            {/* Link pro anúncio original da Caixa */}
            {imovel.link && (
              <a 
                href={imovel.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full text-center inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-md font-medium transition-colors shadow mt-4"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver anúncio original
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}