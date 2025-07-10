// app/page.tsx
'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { parseCsv } from '@/lib/parseCsv'
import { useImoveis } from '@/context/imoveis-context'

export default function Home() {
  const router = useRouter()
  const { setImoveis, setIsLoading } = useImoveis()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setIsLoading(true)

    parseCsv(file, (imoveis) => {
      setImoveis(imoveis)
      setIsLoading(false)
      router.push('/imoveis')
    })
  }

  return (
    // Alterado: Fundo um pouco mais escuro e centralização aprimorada
    <main className="flex min-h-screen w-full items-center justify-center bg-secondary/30 dark:bg-secondary/10 px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-card p-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Imagem */}
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

          {/* Conteúdo */}
          <div className="text-center md:text-left">
            {/* Alterado: Tamanhos de fonte e espaçamentos ajustados para melhor hierarquia */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Garimpeiro Genes</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Encontre as melhores oportunidades em imóveis da Caixa. Transforme planilhas em análises visuais, de forma rápida e simples.
            </p>

            {/* Botão estilizado */}
            <div>
              <label
                htmlFor="csv-upload"
                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 py-2 shadow-md hover:shadow-lg transition-shadow"              >
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
          </div>
        </div>
      </div>
    </main>
  )
}