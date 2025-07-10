// components/features/CardImovel.tsx
'use client';

import { Imovel } from "@/lib/types";
import { useRouter } from 'next/navigation'; // Importe o useRouter
import { ExternalLink } from "lucide-react";

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  const router = useRouter(); // Inicialize o hook

  // --- Constantes e formatação ---
  const preco = imovel.preco || 'N/A';
  const valorAvaliacao = imovel.valorAvaliacao || 'N/A';
  const desconto = imovel.desconto || '0';
  const endereco = imovel.endereco || 'Endereço não informado';
  const link = imovel.link;
  const descricao = imovel.descricao || 'Sem descrição.';
  const modalidade = imovel.modalidadeVenda || 'Não informada';
  const tipoImovel = imovel.tipoImovel || 'Outros';

  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return 'N/A';
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // --- Handlers de Navegação ---

  // Navega para a página de detalhes do imóvel
  const handleCardClick = () => {
    router.push(`/imoveis/${imovel.id}`);
  };

  // Impede que o clique no link externo acione a navegação do card
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };


  return (
    // div com um evento de clique
    <div 
      onClick={handleCardClick}
      className="h-full border p-4 rounded-lg shadow-sm bg-card text-card-foreground flex flex-col hover:border-primary transition-all duration-300 ease-in-out cursor-pointer"
      role="link" 
      tabIndex={0} 
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
    >
      {/* Cabeçalho */}
      <div className="flex-shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">{tipoImovel} • {imovel.cidade} - {imovel.uf}</p>
        <h3 className="font-bold text-lg text-primary truncate">{imovel.bairro}</h3>
        <p className="text-sm text-muted-foreground truncate mb-3" title={endereco}>{endereco}</p>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="bg-muted/50 rounded-md border p-3 mb-3 flex-1 min-h-[70px] max-h-[100px] overflow-y-hidden">
          <p className="text-sm text-foreground/80">{descricao}</p>
        </div>

        <div className="mt-auto space-y-1.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-muted-foreground">Preço:</span>
            <span className="font-bold">{formatCurrency(preco)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-muted-foreground">Avaliação:</span>
            <span>{formatCurrency(valorAvaliacao)}</span>
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

      {link && (
        <div className="mt-4 pt-2 border-t">
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full text-center inline-flex items-center justify-center bg-secondary/80 text-secondary-foreground hover:bg-primary/30 hover:text-primary hover:shadow-sm py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ease-in-out"
            onClick={handleExternalLinkClick}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver anúncio original na Caixa
          </a>
        </div>
      )}
    </div>
  );
}