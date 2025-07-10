// lib/hooks/useImovelFilters.ts
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Imovel } from '@/lib/types';

export function useImovelFilters(imoveis: Imovel[]) {
  // ESTADOS DOS FILTROS
  const [cidadesFiltro, setCidadesFiltro] = useState<string[]>([]);
  const [modalidadesFiltro, setModalidadesFiltro] = useState<string[]>([]); // ALTERADO
  const [bairroFiltro, setBairroFiltro] = useState('');
  const [precoMaxFiltro, setPrecoMaxFiltro] = useState('');
  const [descontoMinFiltro, setDescontoMinFiltro] = useState('');

  const { cidadesUnicas, modalidadesUnicas } = useMemo(() => {
    if (!imoveis) return { cidadesUnicas: [], modalidadesUnicas: [] };
    const cidades = new Set(imoveis.map(imovel => imovel.cidade).filter(Boolean));
    const modalidades = new Set(imoveis.map(imovel => imovel.modalidadeVenda).filter(Boolean));
    return {
      cidadesUnicas: Array.from(cidades).sort(),
      modalidadesUnicas: Array.from(modalidades).sort(),
    };
  }, [imoveis]);

  const imoveisFiltrados = useMemo(() => {
    if (!imoveis) return [];
    return imoveis.filter(imovel => {
      if (cidadesFiltro.length > 0 && !cidadesFiltro.includes(imovel.cidade)) return false;
      if (modalidadesFiltro.length > 0 && !modalidadesFiltro.includes(imovel.modalidadeVenda)) return false; // ALTERADO
      if (bairroFiltro && !imovel.bairro.toLowerCase().includes(bairroFiltro.toLowerCase())) return false;
      if (precoMaxFiltro && parseFloat(imovel.preco) > parseFloat(precoMaxFiltro)) return false;
      if (descontoMinFiltro && parseFloat(imovel.desconto) < parseFloat(descontoMinFiltro)) return false;
      return true;
    });
  }, [imoveis, cidadesFiltro, modalidadesFiltro, bairroFiltro, precoMaxFiltro, descontoMinFiltro]);

  // FUNÇÕES DE CONTROLO
  const handleCidadeToggle = useCallback((cidade: string) => {
    setCidadesFiltro(prev => prev.includes(cidade) ? prev.filter(c => c !== cidade) : [...prev, cidade]);
  }, []);

  const handleModalidadeToggle = useCallback((modalidade: string) => { // NOVO
    setModalidadesFiltro(prev => prev.includes(modalidade) ? prev.filter(m => m !== modalidade) : [...prev, modalidade]);
  }, []);

  const limparFiltros = () => {
    setCidadesFiltro([]);
    setModalidadesFiltro([]);
    setBairroFiltro('');
    setPrecoMaxFiltro('');
    setDescontoMinFiltro('');
  };

  return {
    imoveisFiltrados,
    opcoes: {
      cidades: cidadesUnicas,
      modalidades: modalidadesUnicas,
    },
    filtros: {
      cidades: cidadesFiltro,
      modalidades: modalidadesFiltro,
      bairro: bairroFiltro,
      precoMax: precoMaxFiltro,
      descontoMin: descontoMinFiltro,
    },
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
