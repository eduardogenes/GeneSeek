// lib/hooks/useImovelFilters.ts
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Imovel } from '@/lib/types';

export function useImovelFilters(imoveis: Imovel[]) {
  const [cidadesFiltro, setCidadesFiltro] = useState<string[]>([]);
  const [modalidadesFiltro, setModalidadesFiltro] = useState<string[]>([]);
  const [tiposFiltro, setTiposFiltro] = useState<string[]>([]); 
  const [termoBairro, setTermoBairro] = useState('');
  const [bairroFiltro, setBairroFiltro] = useState('');
  const [precoMaxFiltro, setPrecoMaxFiltro] = useState('');
  const [descontoMinFiltro, setDescontoMinFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('maior-desconto');

  useEffect(() => {
    const timer = setTimeout(() => setBairroFiltro(termoBairro), 500);
    return () => clearTimeout(timer);
  }, [termoBairro]);

  const { cidadesUnicas, modalidadesUnicas, tiposUnicos } = useMemo(() => { 
    if (!imoveis) return { cidadesUnicas: [], modalidadesUnicas: [], tiposUnicos: [] };
    const cidades = new Set(imoveis.map(imovel => imovel.cidade).filter(Boolean));
    const modalidades = new Set(imoveis.map(imovel => imovel.modalidadeVenda).filter(Boolean));
    const tipos = new Set(imoveis.map(imovel => imovel.tipoImovel).filter(Boolean)); 
    return {
      cidadesUnicas: Array.from(cidades).sort(),
      modalidadesUnicas: Array.from(modalidades).sort(),
      tiposUnicos: Array.from(tipos).sort(), 
    };
  }, [imoveis]);

  const imoveisProcessados = useMemo(() => {
    if (!imoveis) return [];

    const resultados = imoveis.filter(imovel => {
      if (cidadesFiltro.length > 0 && !cidadesFiltro.includes(imovel.cidade)) return false;
      if (modalidadesFiltro.length > 0 && !modalidadesFiltro.includes(imovel.modalidadeVenda)) return false;
      if (tiposFiltro.length > 0 && !tiposFiltro.includes(imovel.tipoImovel)) return false; 
      if (bairroFiltro && !imovel.bairro.toLowerCase().includes(bairroFiltro.toLowerCase())) return false;
      if (precoMaxFiltro && parseFloat(imovel.preco) > parseFloat(precoMaxFiltro)) return false;
      if (descontoMinFiltro && parseFloat(imovel.desconto) < parseFloat(descontoMinFiltro)) return false;
      return true;
    });

    const resultadosOrdenados = [...resultados];
    if (ordenacao === 'maior-desconto') {
      resultadosOrdenados.sort((a, b) => parseFloat(b.desconto) - parseFloat(a.desconto));
    } else if (ordenacao === 'menor-preco') {
      resultadosOrdenados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
    } else if (ordenacao === 'maior-preco') {
      resultadosOrdenados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
    }

    return resultadosOrdenados;
  }, [imoveis, cidadesFiltro, modalidadesFiltro, tiposFiltro, bairroFiltro, precoMaxFiltro, descontoMinFiltro, ordenacao]); 

  const handleCidadeToggle = useCallback((cidade: string) => {
    setCidadesFiltro(prev => prev.includes(cidade) ? prev.filter(c => c !== cidade) : [...prev, cidade]);
  }, []);
  
  const handleModalidadeToggle = useCallback((modalidade: string) => {
    setModalidadesFiltro(prev => prev.includes(modalidade) ? prev.filter(m => m !== modalidade) : [...prev, modalidade]);
  }, []);

  const handleTipoToggle = useCallback((tipo: string) => { 
    setTiposFiltro(prev => prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]);
  }, []);

  const limparFiltros = () => {
    setCidadesFiltro([]);
    setModalidadesFiltro([]);
    setTiposFiltro([]); 
    setTermoBairro('');
    setPrecoMaxFiltro('');
    setDescontoMinFiltro('');
    setOrdenacao('maior-desconto');
  };

  return {
    imoveisProcessados,
    opcoes: {
      cidades: cidadesUnicas,
      modalidades: modalidadesUnicas,
      tipos: tiposUnicos, 
    },
    filtros: {
      cidades: cidadesFiltro,
      modalidades: modalidadesFiltro,
      tipos: tiposFiltro,
      bairro: termoBairro,
      precoMax: precoMaxFiltro,
      descontoMin: descontoMinFiltro,
      ordenacao: ordenacao,
    },
    handlers: {
      handleCidadeToggle,
      handleModalidadeToggle,
      handleTipoToggle, 
      setBairro: setTermoBairro,
      setPrecoMax: setPrecoMaxFiltro,
      setDescontoMin: setDescontoMinFiltro,
      setOrdenacao: setOrdenacao,
    },
    limparFiltros,
  };
}