// lib/hooks/useImovelFilters.ts
'use client';

import { useState, useMemo, useCallback } from 'react'; // Adicione useCallback
import { Imovel } from '@/lib/types';

/**
 * Hook personalizado para gerir toda a lógica de estado e filtragem da lista de imóveis.
 */
export function useImovelFilters(imoveis: Imovel[]) {
  // --- ESTADOS DOS FILTROS ---
  const [cidadesFiltro, setCidadesFiltro] = useState<string[]>([]);
  const [bairroFiltro, setBairroFiltro] = useState('');
  const [precoMaxFiltro, setPrecoMaxFiltro] = useState('');
  const [descontoMinFiltro, setDescontoMinFiltro] = useState('');
  const [modalidadesFiltro, setModalidadesFiltro] = useState<string[]>([]);

  // --- OPÇÕES DINÂMICAS PARA OS DROPDOWNS ---
  const { cidadesUnicas, modalidadesUnicas } = useMemo(() => {
    if (!imoveis) return { cidadesUnicas: [], modalidadesUnicas: [] };

    const cidades = new Set(imoveis.map(imovel => imovel.cidade).filter(Boolean));
    const modalidades = new Set(imoveis.map(imovel => imovel.modalidadeVenda).filter(Boolean));

    return {
      cidadesUnicas: Array.from(cidades).sort(),
      modalidadesUnicas: Array.from(modalidades).sort(),
    };
  }, [imoveis]);

  // --- LÓGICA DE FILTRAGEM ---
  const imoveisFiltrados = useMemo(() => {
    if (!imoveis) return [];

    return imoveis.filter(imovel => {
      if (cidadesFiltro.length > 0 && !cidadesFiltro.includes(imovel.cidade)) return false;
      
      if (modalidadesFiltro.length > 0 && !modalidadesFiltro.includes(imovel.modalidadeVenda)) return false;

      if (bairroFiltro && !imovel.bairro.toLowerCase().includes(bairroFiltro.toLowerCase())) return false;
      if (precoMaxFiltro && parseFloat(imovel.preco) > parseFloat(precoMaxFiltro)) return false;
      if (descontoMinFiltro && parseFloat(imovel.desconto) < parseFloat(descontoMinFiltro)) return false;
      
      return true;
    });
  }, [imoveis, cidadesFiltro, bairroFiltro, precoMaxFiltro, descontoMinFiltro, modalidadesFiltro]);

  // --- FUNÇÕES DE CONTROLO ---

  //uma otimização que impede que a função seja recriada a cada renderização.
  const handleCidadeToggle = useCallback((cidade: string) => {
    setCidadesFiltro(prev => 
      prev.includes(cidade)
        ? prev.filter(c => c !== cidade)
        : [...prev, cidade]
    );
  }, []);

  // Função para alternar uma modalidade no filtro
  const handleModalidadeToggle = useCallback((modalidade: string) => {
    setModalidadesFiltro(prev => 
      prev.includes(modalidade)
        ? prev.filter(m => m !== modalidade)
        : [...prev, modalidade]
    );
  }, []);

  const limparFiltros = () => {
    setCidadesFiltro([]);
    setBairroFiltro('');
    setPrecoMaxFiltro('');
    setDescontoMinFiltro('');
    setModalidadesFiltro([]);
  };

  // --- VALORES E HANDLERS PARA O COMPONENTE ---
  const opcoes = useMemo(() => ({
    cidades: cidadesUnicas,
    modalidades: modalidadesUnicas,
  }), [cidadesUnicas, modalidadesUnicas]);

  const filtros = useMemo(() => ({
    cidades: cidadesFiltro,
    bairro: bairroFiltro,
    precoMax: precoMaxFiltro,
    descontoMin: descontoMinFiltro,
    modalidades: modalidadesFiltro,
  }), [cidadesFiltro, bairroFiltro, precoMaxFiltro, descontoMinFiltro, modalidadesFiltro]);

  // --- RETORNO DO HOOK ---
  return {
    imoveisFiltrados,
    opcoes,
    filtros,
    handlers: {
      handleCidadeToggle,
      handleModalidadeToggle,
      setBairro: setBairroFiltro,
      setPrecoMax: setPrecoMaxFiltro,
      setDescontoMin: setDescontoMinFiltro,
    },
    limparFiltros,
  };
}