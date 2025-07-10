// components/features/CardImovel.tsx 
'use client';
import { Imovel } from "@/lib/types";
import Link from 'next/link';
import { ExternalLink } from "lucide-react"; // Ícone para o link externo

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  // Formata valores monetários para o padrão brasileiro
  const preco = imovel.preco || 'N/A';
  const valorAvaliacao = imovel.valorAvaliacao || 'N/A';
  const desconto = imovel.desconto || '0';
  const endereco = imovel.endereco || 'Endereço não informado';
  const link = imovel.link;
  const descricao = imovel.descricao || 'Sem descrição.';
  const modalidade = imovel.modalidadeVenda || 'Não informada';

  return (
    // O Link agora envolve todo o cartão, levando para a página de detalhes.
    <Link href={`/imoveis/${imovel.id}`} className="block h-full">
      <div className="h-full border p-4 rounded-lg shadow-sm bg-card text-card-foreground flex flex-col hover:border-primary transition-all duration-300 ease-in-out cursor-pointer">
        {/* Cabeçalho fixo */}
        <div className="flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">{imovel.cidade} - {imovel.uf}</p>
          <h3 className="font-bold text-lg text-primary truncate">{imovel.bairro}</h3>
          <p className="text-sm text-muted-foreground truncate mb-3" title={endereco}>{endereco}</p>
        </div>

        {/* Área de conteúdo flexível */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Descrição com altura fixa e scroll */}
          <div className="bg-muted/50 rounded-md border p-3 mb-3 flex-1 min-h-[70px] max-h-[100px] overflow-y-hidden">
            <p className="text-sm text-foreground/80">{descricao || 'Sem descrição disponível.'}</p>
          </div>

          {/* Informações fixas na parte inferior */}
          <div className="mt-auto space-y-1.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-muted-foreground">Preço:</span>
              <span className="font-bold">R$ {preco}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-muted-foreground">Avaliação:</span>
              <span>R$ {valorAvaliacao}</span>
            </div>
            <div className="flex justify-between items-center text-green-600 dark:text-green-400">
              <span className="font-semibold">Desconto:</span>
              <span className="font-bold">{parseFloat(desconto).toFixed(2)}%</span>
            </div>
            <div className="pt-2">
              <span className="font-semibold">Modalidade:</span>{' '}
              <span className="bg-secondary text-secondary-foreground font-medium py-0.5 px-1.5 rounded-sm ml-2">
                {modalidade}
              </span>
            </div>
          </div>
        </div>

        {/* Botão de link externo */}
        {link && (
          <div className="mt-4 pt-2 border-t">
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full text-center inline-flex items-center justify-center bg-secondary/80 text-secondary-foreground hover:bg-primary/30 hover:text-primary hover:shadow-sm py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver anúncio original na Caixa
            </a>
          </div>
        )}
      </div>
    </Link>
  );
}