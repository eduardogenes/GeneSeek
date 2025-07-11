// components/features/DownloadCaixaButton.tsx
'use client';

import React, { useState } from 'react';
import { Loader2, DownloadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useImoveis } from '@/context/imoveis-context';

// --- CONTROLE DA FUNCIONALIDADE ---
// Mudar para 'true' para reativar a busca automática pela API.
// Mudar para 'false' para usar o link direto para o site da Caixa (solução provisória).
const USE_API_FETCH = false;

// URL da página de download de listas da Caixa
const CAIXA_DOWNLOAD_URL = 'https://venda-imoveis.caixa.gov.br/sistema/download-lista.asp';

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
  // Status da requisição (mantido para a lógica original)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { setImoveis, setIsLoading } = useImoveis();
  const router = useRouter();

  // Função que chama a API pra baixar e processar o CSV da Caixa (mantida em stand-by)
  const handleProcess = async () => {
    if (!USE_API_FETCH) return; // Trava de segurança
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

      {/* Renderização condicional baseada na flag USE_API_FETCH */}
      {USE_API_FETCH ? (
        // LÓGICA API: Botão que chama a API
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
      ) : (
        // (FUNÇÃO PROVISÓRIA): direciona para o site da Caixa
        <a
          href={CAIXA_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            inline-flex items-center justify-center rounded-md text-sm font-medium
            bg-primary text-primary-foreground hover:bg-primary/90 
            px-6 py-2 shadow-md transition-all h-10 w-full min-w-[200px]
          `}
        >
          <DownloadCloud className="mr-2 h-4 w-4" />
          Acessar site da Caixa
        </a>
      )}

      {/* Mensagem de erro (só aparece se a lógica da API estiver ativa) */}
      {USE_API_FETCH && status === 'error' && (
        <p className="text-red-500 text-sm mt-2 w-full text-center sm:text-left">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
