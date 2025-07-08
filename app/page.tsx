// app/page.tsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { parseCsv } from '@/lib/parseCsv';
import { useImoveis } from '@/context/imoveis-context'; // Nosso hook de contexto

export default function Home() {
  const router = useRouter();
  const { setImoveis, setIsLoading } = useImoveis(); // Pegamos as funções do contexto

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    setIsLoading(true); // Informa à UI que o carregamento começou

    parseCsv(file, (imoveis) => {
      // Aqui você pode adicionar uma etapa de transformação/limpeza dos dados se necessário
      // Ex: Converter strings de preço para números, normalizar nomes de colunas, etc.
      setImoveis(imoveis); // Salva os dados no contexto
      setIsLoading(false); // Carregamento concluído
      router.push('/imoveis'); // Navega para a página de visualização
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Geneseek</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Análise automatizada de imóveis da Caixa Econômica Federal.
        </p>
        <label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Carregar Planilha .CSV
        </label>
        <input 
          id="csv-upload"
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          className="hidden"
        />
      </div>
    </main>
  );
}