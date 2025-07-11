// components/features/CardImovel.tsx
'use client';

import { Imovel } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { ExternalLink, Star } from "lucide-react";
import { useImoveis } from "@/context/imoveis-context";

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useImoveis();

  const ehFavorito = isFavorite(imovel.id);

  // Formata valores monetários para o padrão brasileiro
  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return 'N/A';
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Navega para a página de detalhes do imóvel
  const handleCardClick = () => {
    router.push(`/imoveis/${imovel.id}`);
  };

  // Adiciona ou remove o imóvel dos favoritos
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no botão de favoritar navegue para a página de detalhes
    toggleFavorite(imovel);
  };

  // Impede que o clique no link externo acione a navegação do card
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // O card agora é uma div com um evento de clique para navegação
    <div 
      onClick={handleCardClick}
      className="h-full border p-4 rounded-lg shadow-sm bg-card text-card-foreground flex flex-col hover:border-primary transition-all duration-300 ease-in-out cursor-pointer relative"
      role="link" // Adiciona semântica para acessibilidade
      tabIndex={0} // Permite que a div seja focável com o teclado
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
    >
      {/* Botão para favoritar */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted z-10"
        aria-label={ehFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Star className={`h-5 w-5 transition-colors ${ehFavorito ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`} />
      </button>

      {/* Cabeçalho */}
      <div className="flex-shrink-0 pr-8"> {/* Padding para o texto não ficar embaixo do botão */}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">{imovel.tipoImovel} • {imovel.cidade} - {imovel.uf}</p>
        <h3 className="font-bold text-lg text-primary truncate">{imovel.bairro}</h3>
        <p className="text-sm text-muted-foreground truncate mb-3" title={imovel.endereco}>{imovel.endereco}</p>
      </div>

      {/* Corpo do Card */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="bg-muted/50 rounded-md border p-3 mb-3 flex-1 min-h-[70px] max-h-[100px] overflow-y-hidden">
          <p className="text-sm text-foreground/80">{imovel.descricao}</p>
        </div>

        <div className="mt-auto space-y-1.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-muted-foreground">Preço:</span>
            <span className="font-bold">{formatCurrency(imovel.preco)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-muted-foreground">Avaliação:</span>
            <span>{formatCurrency(imovel.valorAvaliacao)}</span>
          </div>
          <div className="flex justify-between items-center text-green-600 dark:text-green-400">
            <span className="font-semibold">Desconto:</span>
            <span className="font-bold">{parseFloat(imovel.desconto).toFixed(2)}%</span>
          </div>
          <div className="pt-2">
            <span className="font-semibold">Modalidade:</span>{' '}
            <span className="bg-secondary text-secondary-foreground font-medium py-0.5 px-1.5 rounded-sm ml-2">
              {imovel.modalidadeVenda}
            </span>
          </div>
        </div>
      </div>

      {/* Botão de link externo */}
      {imovel.link && (
        <div className="mt-4 pt-2 border-t">
          <a 
            href={imovel.link} 
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