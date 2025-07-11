// components/features/DownloadCaixaButton.tsx
'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'

const estados = [
  'TODOS', 'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES',
  'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE',
  'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC',
  'SE', 'SP', 'TO',
]

export default function DownloadCaixaButton() {
  const [estado, setEstado] = useState('CE')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const handleDownload = () => {
    if (!estado) return alert('Selecione um estado.')

    setStatus('loading')

    try {
      const estadoFormatado = estado === 'TODOS' ? 'geral' : estado.toLowerCase()
      const url = `https://venda-imoveis.caixa.gov.br/listaweb/Lista_imoveis_${estadoFormatado}.csv`

      const link = document.createElement('a')
      link.href = url
      link.download = `Lista_imoveis_${estado}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setStatus('idle')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4 items-center md:items-start">
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="rounded-md border px-4 py-2 text-base text-foreground bg-background shadow focus:outline-none focus:ring"
      >
        <option value="">Selecione um estado</option>
        {estados.map((uf) => (
          <option key={uf} value={uf}>{uf}</option>
        ))}
      </select>

      <button
        onClick={handleDownload}
        disabled={status === 'loading'}
        className={`
          inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground 
          px-6 py-2 text-sm font-medium shadow-md hover:bg-primary/90 
          transition-all ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Baixando...
          </>
        ) : (
          'Baixar .CSV da Caixa'
        )}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Erro ao tentar baixar. Tente novamente.
        </p>
      )}
    </div>
  )
}
