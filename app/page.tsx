// app/page.tsx
'use client';

// Importações essenciais do React e Next.js.
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Importações de lógica e estado específicos da aplicação.
import { parseCsv } from '@/lib/parseCsv';
import { useImoveis } from '@/context/imoveis-context';
import { Loader2 } from 'lucide-react'; // Ícone para o feedback de carregamento.

// A página inicial (Home) da aplicação.
export default function Home() {
  // Hook do Next.js para gerir a navegação entre páginas.
  const router = useRouter();
  
  // Hooks do contexto de imóveis para atualizar o estado global da aplicação.
  const { setImoveis, setIsLoading } = useImoveis();
  
  // Estado local para controlar o feedback visual do botão durante o processamento do ficheiro.
  // Garante que o utilizador saiba que a aplicação está a trabalhar após o clique.
  const [isProcessing, setIsProcessing] = useState(false);

  // Handler para o evento de seleção de ficheiro.
  // É acionado quando o utilizador seleciona um ficheiro no input.
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // Garante que um ficheiro foi de facto selecionado.
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Ativa os estados de carregamento para fornecer feedback visual imediato.
    setIsLoading(true);   // Informa o contexto que uma operação de carregamento global começou.
    setIsProcessing(true); // Ativa o estado local para alterar a UI do botão.

    // Chama a função principal de parsing, passando o ficheiro e um callback.
    // O callback será executado quando o parse terminar.
    parseCsv(file, (imoveis) => {
      // 1. Atualiza o estado global com a lista de imóveis processada.
      setImoveis(imoveis);
      
      // 2. Desativa o estado de carregamento global.
      setIsLoading(false);
      
      // 3. Redireciona o utilizador para a página de resultados.
      // A navegação ocorre após o processamento, não sendo necessário desativar `isProcessing` aqui.
      router.push('/imoveis');
    });
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-secondary/30 dark:bg-secondary/10 px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-card p-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Coluna da Imagem */}
          <div className="text-center">
            <Image
              src="/images/garimpeiro-home.png"
              alt="Garimpeiro Genes"
              width={500}
              height={400}
              className="w-full max-w-md mx-auto"
              priority // Prioriza o carregamento desta imagem, pois é crítica para a primeira visualização.
            />
          </div>
          {/* Coluna do Conteúdo */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Garimpeiro Genes</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Encontre as melhores oportunidades em imóveis da Caixa. Transforme planilhas em análises visuais, de forma rápida e simples.
            </p>
            <div>
              {/* O `label` funciona como um botão de upload personalizado. */}
              <label
                htmlFor="csv-upload"
                className={`
                  cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 py-2 shadow-md hover:shadow-lg 
                  ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                {/* O conteúdo do botão é renderizado condicionalmente com base no estado `isProcessing`. */}
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A processar...
                  </>
                ) : (
                  'Carregar Planilha .CSV'
                )}
              </label>
              {/* O input de ficheiro real fica escondido, mas é funcionalmente ligado ao label pelo `htmlFor`. */}
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing} // Desativa o input para prevenir múltiplos uploads.
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}