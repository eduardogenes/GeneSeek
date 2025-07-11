// app/favoritos/page.tsx
'use client';

import { useImoveis } from "@/context/imoveis-context";
import CardImovel from "@/components/features/CardImovel";
import Link from 'next/link';
import Image from 'next/image';

// Página que mostra todos os imóveis favoritados
// Pega a lista direto do contexto global
export default function FavoritosPage() {
  // Acessa a lista de favoritos do contexto
  const { favorites } = useImoveis();

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* Cabeçalho com contador de favoritos */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/images/garimpeiro-home.png"
            alt="Mascote Garimpeiro Genes"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold">Meus Favoritos ({favorites.length})</h1>
        </div>
        <Link href="/" className="text-sm font-medium text-primary hover:underline whitespace-nowrap">
          Carregar nova planilha
        </Link>
      </div>
      
      {/* Grid de favoritos ou mensagem vazia */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Reutiliza o mesmo componente de card da listagem */}
          {favorites.map((imovel) => (
            <CardImovel key={imovel.id} imovel={imovel} />
          ))}
        </div>
      ) : (
        // Mensagem quando não tem nenhum favorito
        <div className="text-center py-16">
          <p className="text-xl font-semibold">Nenhum imóvel favoritado ainda</p>
          <p className="text-muted-foreground">Volte para a lista de imóveis e clique na estrela para salvar os que você mais gostar.</p>
          <Link href="/imoveis" className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 py-2">
            Ver imóveis
          </Link>
        </div>
      )}
    </main>
  );
}