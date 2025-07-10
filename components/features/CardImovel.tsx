// components/features/CardImovel.tsx
import { Imovel } from "@/lib/types";
import Link from 'next/link';

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  const preco = imovel.preco || 'N/A';
  const valorAvaliacao = imovel.valorAvaliacao || 'N/A';
  const desconto = imovel.desconto || '0';
  const endereco = imovel.endereco || 'Endereço não informado';
  const link = imovel.link;
  const descricao = imovel.descricao || 'Sem descrição.';
  const modalidade = imovel.modalidadeVenda || 'Não informada';

  return (
    // Alterado: Adicionado `h-full` para que os cartões tenham a mesma altura na mesma linha e efeito de transição
    <div className="border p-4 rounded-lg shadow-sm bg-card text-card-foreground flex flex-col justify-between h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div>
        {/* Bloco de Localização */}
        <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{imovel.cidade} - {imovel.uf}</p>
            <h3 className="font-bold text-lg text-primary">{imovel.bairro}</h3>
            <p className="text-sm text-muted-foreground truncate" title={endereco}>{endereco}</p>
        </div>
        
        {/* Descrição do imóvel */}
        <p className="text-sm bg-muted/50 p-3 rounded-md border text-foreground/80 min-h-[70px]">{descricao}</p>

        {/* Detalhes Financeiros e Modalidade */}
        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-muted-foreground">Preço:</span>
            <span className="font-bold text-lg">R$ {preco}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-muted-foreground">Avaliação:</span>
            <span>R$ {valorAvaliacao}</span>
          </div>
          <div className="flex justify-between items-center text-green-600 dark:text-green-400">
            <span className="font-semibold">Desconto:</span>
            <span className="font-bold text-lg">{parseFloat(desconto).toFixed(2)}%</span>
          </div>
          <p className="pt-2"><span className="font-semibold">Modalidade:</span> <span className="bg-secondary text-secondary-foreground font-medium py-0.5 px-1.5 rounded-sm ml-2">{modalidade}</span></p>
        </div>
      </div>

      {/* Botão de Ação */}
      {link && (
        <div className="mt-5">
          <Link href={link} target="_blank" rel="noopener noreferrer" 
                className="w-full text-center inline-block bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-md text-sm font-medium transition-colors shadow">
            Ver no site da Caixa
          </Link>
        </div>
      )}
    </div>
  );
}