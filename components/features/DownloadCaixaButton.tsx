// components/features/DownloadCaixaButton.tsx
'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useImoveis } from '@/context/imoveis-context';

// Lista de todos os estados disponíveis na Caixa
const estados = [
  'TODOS', 'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES',
  'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE',
  'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC',
  'SE', 'SP', 'TO',
];

export default function DownloadCaixaButton() {
  // Estado selecionado (padrão Ceará)
  const [estado, setEstado] = useState('CE');
  // Status da requisição
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { setImoveis, setIsLoading } = useImoveis();
  const router = useRouter();

  // Função que chama a API pra baixar e processar o CSV da Caixa
  const handleProcess = async () => {
    if (!estado) return alert('Selecione um estado.');
    setStatus('loading');
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Chama nossa API interna que faz o download e processamento
      const response = await fetch(`/api/download-caixa?estado=${estado}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível obter a planilha.');
      }
      // Se deu certo, salva no contexto e vai pra página de imóveis
      setImoveis(data);
      router.push('/imoveis');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Ocorreu um erro desconhecido";
      setErrorMessage(message);
      setStatus('error');
    } finally {
      setIsLoading(false);
      // Reseta pra idle se não houver erro
      if (status !== 'error') {
        setStatus('idle');
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      {/* Dropdown pra selecionar o estado */}
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="rounded-md border px-4 py-2 text-base text-foreground bg-background shadow focus:outline-none focus:ring w-full sm:w-auto h-10"
      >
        {estados.map((uf) => (
          <option key={uf} value={uf}>{uf}</option>
        ))}
      </select>

      {/* Botão de buscar */}
      <button
        onClick={handleProcess}
        disabled={status === 'loading'}
        className={`
          inline-flex items-center justify-center rounded-md text-sm font-medium
          bg-primary text-primary-foreground hover:bg-primary/90 
          px-6 py-2 shadow-md transition-all h-10 w-full min-w-[200px]
          ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buscando e Processando...
          </>
        ) : (
          'Buscar e Analisar'
        )}
      </button>

      {/* Mensagem de erro */}
      {status === 'error' && (
        <p className="text-red-500 text-sm mt-2 w-full text-center sm:text-left">
          {errorMessage}
        </p>
      )}
    </div>
  );
}