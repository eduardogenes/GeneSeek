// app/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseCsv } from '@/lib/parseCsv';
import { useImoveis } from '@/context/imoveis-context';
import { Loader2 } from 'lucide-react';
import DownloadCaixaButton from '@/components/features/DownloadCaixaButton';

export default function Home() {
  const router = useRouter();
  const { setImoveis, setIsLoading } = useImoveis();
  // Estado local só pra controlar o loading do upload de arquivo
  const [isProcessing, setIsProcessing] = useState(false);

  // Função que roda quando o usuário seleciona um arquivo CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Ativa os loadings (global e local)
    setIsLoading(true);
    setIsProcessing(true);

    // Manda processar o CSV e quando terminar, salva no contexto e vai pra página de imóveis
    parseCsv(file, (imoveis) => {
      setImoveis(imoveis);
      setIsLoading(false);
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
              priority
            />
          </div>

          {/* Coluna do Conteúdo */}
          <div className="text-center md:text-left">
            {/* Título com destaque tipográfico */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
              Garimpeiro
              <span className="ml-2 font-medium text-primary/80">
                Genes
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Sua plataforma de análise dos imóveis da Caixa.
            </p>

            <div className="space-y-6">
              {/* Opção 1: Busca Automática - usa o componente que baixa direto da Caixa */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Busca Automática</h2>
                <p className="text-sm text-muted-foreground mb-3">Analise a lista oficial da Caixa selecionando um estado.</p>
                <DownloadCaixaButton />
              </div>

              {/* Separador visual */}
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-4 text-muted-foreground font-semibold">OU</span>
                  <div className="flex-grow border-t border-border"></div>
              </div>

              {/* Opção 2: Upload de arquivo local */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Arquivo Local</h2>
                <p className="text-sm text-muted-foreground mb-3">Envie um arquivo `.csv` que você já tenha para uma análise interativa.</p>
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-6 py-2 shadow-md transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Carregar do seu computador'
                  )}
                </label>
                {/* Input hidden que é ativado quando clica no label */}
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}