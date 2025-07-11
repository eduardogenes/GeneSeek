// app/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseCsv } from '@/lib/parseCsv';
import { useImoveis } from '@/context/imoveis-context';
import { Loader2, UploadCloud } from 'lucide-react';
import DownloadCaixaButton from '@/components/features/DownloadCaixaButton';
import { cn } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const { setImoveis, setIsLoading } = useImoveis();
  const [isProcessing, setIsProcessing] = useState(false);
  // Novo estado para controlar o feedback visual do drag-and-drop
  const [isDragging, setIsDragging] = useState(false);

  // Função centralizada para processar o arquivo, seja do clique ou do drop
  const processFile = useCallback((file: File) => {
    if (!file || !file.type.includes('csv')) {
      alert('Por favor, envie um arquivo .csv válido.');
      setIsDragging(false);
      return;
    }
    
    setIsLoading(true);
    setIsProcessing(true);

    parseCsv(file, (imoveis) => {
      setImoveis(imoveis);
      setIsLoading(false);
      router.push('/imoveis');
    });
  }, [setIsLoading, setImoveis, router]);

  // Função que roda quando o usuário seleciona um arquivo pelo clique
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  // Funções para gerenciar o estado de arrastar e soltar
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Necessário para que o onDrop funcione
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <main 
      className="flex min-h-screen w-full items-center justify-center bg-secondary/30 dark:bg-secondary/10 px-4"
      // Adiciona os eventos de drag-and-drop ao container principal
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
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
              {/* Opção 1: Baixar a planilha */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Passo 1: Baixar Planilha</h2>
                <p className="text-sm text-muted-foreground mb-3">Baixe a lista de imóveis no site oficial da Caixa.</p>
                <DownloadCaixaButton />
              </div>

              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-4 text-muted-foreground font-semibold">OU</span>
                  <div className="flex-grow border-t border-border"></div>
              </div>

              {/* Opção 2: Analisar a planilha */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Passo 2: Analisar Planilha</h2>
                <p className="text-sm text-muted-foreground mb-3">Envie o arquivo .csv para nossa análise interativa.</p>
                <label
                  htmlFor="csv-upload"
                  className={cn(
                    "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/80 transition-colors",
                    isDragging && "border-primary bg-primary/10" // Estilo dinâmico quando arrastando
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-8 w-8 mb-4 text-primary animate-spin" />
                        <p className="font-semibold text-primary">Processando...</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Clique para carregar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-muted-foreground">Arquivo CSV</p>
                      </>
                    )}
                  </div>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isProcessing}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
