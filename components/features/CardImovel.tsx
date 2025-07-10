// components/features/CardImovel.tsx
import { Imovel } from "@/lib/types";
import Link from 'next/link';

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  // Acessando as propriedades do imóvel com valores padrão para segurança
  const preco = imovel.preco || 'N/A';
  const valorAvaliacao = imovel.valorAvaliacao || 'N/A';
  const desconto = imovel.desconto || '0';
  const endereco = imovel.endereco || 'Endereço não informado';
  const link = imovel.link;
  const descricao = imovel.descricao || 'Sem descrição.';
  const modalidade = imovel.modalidadeVenda || 'Não informada';

  return (
    <div className="border p-4 rounded-lg shadow-md bg-card text-card-foreground flex flex-col justify-between h-full">
      {/* Informações Principais */}
      <div>
        <h3 className="font-bold text-lg">{imovel.cidade} - {imovel.uf}</h3>
        <p className="text-sm font-medium text-primary mb-1">{imovel.bairro}</p>
        <p className="text-sm text-muted-foreground truncate" title={endereco}>{endereco}</p>
        
        {/* Descrição do imóvel */}
        <p className="mt-3 text-sm bg-muted/50 p-2 rounded-md border text-muted-foreground">{descricao}</p>

        {/* Detalhes Financeiros e Modalidade */}
        <div className="mt-4 space-y-1 text-sm">
          <p><span className="font-semibold">Preço de Venda:</span> R$ {preco}</p>
          <p><span className="font-semibold">Valor de Avaliação:</span> R$ {valorAvaliacao}</p>
          <p className="text-green-600 dark:text-green-400 font-bold"><span className="font-semibold">Desconto:</span> {parseFloat(desconto).toFixed(2)}%</p>
          <p className="pt-1"><span className="font-semibold">Modalidade:</span> <span className="bg-secondary text-secondary-foreground font-medium py-0.5 px-1.5 rounded-sm">{modalidade}</span></p>
        </div>
      </div>

      {/* Botão de Ação */}
      {link && (
        <div className="mt-4">
          <Link href={link} target="_blank" rel="noopener noreferrer" 
                className="w-full text-center inline-block bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm font-medium transition-colors">
            Ver no site da Caixa
          </Link>
        </div>
      )}
    </div>
  );
}