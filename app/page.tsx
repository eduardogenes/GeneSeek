// app/page.tsx
'use client'
import React, { useState } from 'react' // Importe o useState
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { parseCsv } from '@/lib/parseCsv'
import { useImoveis } from '@/context/imoveis-context'

export default function Home() {
  const router = useRouter()
  const { setImoveis, setIsLoading } = useImoveis()
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const file = files[0];
    setIsLoading(true);
    setErrorMessage(''); // Limpa erros anteriores ao iniciar um novo upload

    parseCsv(file, (imoveis) => {
      setImoveis(imoveis);
      setIsLoading(false);
      
      if (imoveis.length > 0) {
        router.push('/imoveis');
      } else {
        // Define uma mensagem de erro se o parse falhar
        setErrorMessage("Não foi possível processar o arquivo. Verifique o formato e tente novamente.");
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-secondary">
      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <Image
          src="/images/garimpeiro-home.png"
          alt="Garimpeiro Genes"
          width={600}
          height={500}
          className="w-full max-w-md mx-auto"
          priority
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Garimpeiro Genes</h1>
          <p className="text-lg text-gray-600 mb-8">
            Encontre as melhores oportunidades em imóveis da Caixa Econômica Federal.
          </p>
          <div>
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-900 text-white hover:bg-blue-800 h-10 px-5 py-2 shadow"
            >
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
          {/* Exibe a mensagem de erro, se houver */}
          {errorMessage && (
            <p className="mt-4 text-sm text-red-600 font-semibold">{errorMessage}</p>
          )}
        </div>
      </div>
    </main>
  )
}