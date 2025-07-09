// components/ui/CardImovel.tsx
import { Imovel } from "@/lib/types";
import Link from 'next/link';

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  // Acessando as propriedades do imóvel
  const preco = imovel.preco || 'N/A';
  const desconto = imovel.desconto || '0';
  const endereco = imovel.endereco || 'Endereço não informado';
  const link = imovel.link;
  

  return (
    <div className="border p-4 rounded-lg shadow-md bg-card text-card-foreground flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg">{imovel.cidade} - {imovel.bairro}</h3>
        <p className="text-sm text-muted-foreground truncate" title={endereco}>{endereco}</p>
        <div className="mt-4 text-sm">
          <p><span className="font-semibold">Preço de Venda:</span> R$ {preco}</p>
          <p><span className="font-semibold">Valor de Avaliação:</span> R$ {imovel.valorAvaliacao}</p>
          <p className="text-green-600 dark:text-green-400"><span className="font-semibold">Desconto:</span> {parseFloat(desconto).toFixed(2)}%</p>
        </div>
      </div>
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