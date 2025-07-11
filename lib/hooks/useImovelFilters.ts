// lib/hooks/useImovelFilters.ts
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Imovel } from '@/lib/types';

// Hook customizado que gerencia todos os filtros e ordenação dos imóveis
// Retorna os imóveis já filtrados e todas as funções de controle
export function useImovelFilters(imoveis: Imovel[]) {
  // Estados dos filtros
  const [cidadesFiltro, setCidadesFiltro] = useState<string[]>([]);
  const [modalidadesFiltro, setModalidadesFiltro] = useState<string[]>([]);
  const [tiposFiltro, setTiposFiltro] = useState<string[]>([]); 
  const [termoBairro, setTermoBairro] = useState('');
  const [bairroFiltro, setBairroFiltro] = useState('');
  const [precoMaxFiltro, setPrecoMaxFiltro] = useState('');
  const [descontoMinFiltro, setDescontoMinFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('maior-desconto');

  // Debounce pro campo de bairro - só filtra depois de 500ms sem digitar
  useEffect(() => {
    const timer = setTimeout(() => setBairroFiltro(termoBairro), 500);
    return () => clearTimeout(timer);
  }, [termoBairro]);

  // Extrai as opções únicas dos dados pra popular os filtros
  const { cidadesUnicas, modalidadesUnicas, tiposUnicos } = useMemo(() => { 
    if (!imoveis) return { cidadesUnicas: [], modalidadesUnicas: [], tiposUnicos: [] };
    
    // Cria Sets pra garantir valores únicos
    const cidades = new Set(imoveis.map(imovel => imovel.cidade).filter(Boolean));
    const modalidades = new Set(imoveis.map(imovel => imovel.modalidadeVenda).filter(Boolean));
    const tipos = new Set(imoveis.map(imovel => imovel.tipoImovel).filter(Boolean)); 
    
    return {
      cidadesUnicas: Array.from(cidades).sort(),
      modalidadesUnicas: Array.from(modalidades).sort(),
      tiposUnicos: Array.from(tipos).sort(), 
    };
  }, [imoveis]);

  // Aqui acontece a mágica - filtra e ordena os imóveis
  const imoveisProcessados = useMemo(() => {
    if (!imoveis) return [];

    // Aplica todos os filtros
    const resultados = imoveis.filter(imovel => {
      // Filtro por cidades selecionadas
      if (cidadesFiltro.length > 0 && !cidadesFiltro.includes(imovel.cidade)) return false;
      // Filtro por modalidades selecionadas
      if (modalidadesFiltro.length > 0 && !modalidadesFiltro.includes(imovel.modalidadeVenda)) return false;
      // Filtro por tipos selecionados
      if (tiposFiltro.length > 0 && !tiposFiltro.includes(imovel.tipoImovel)) return false; 
      // Filtro por bairro (busca parcial)
      if (bairroFiltro && !imovel.bairro.toLowerCase().includes(bairroFiltro.toLowerCase())) return false;
      // Filtro por preço máximo
      if (precoMaxFiltro && parseFloat(imovel.preco) > parseFloat(precoMaxFiltro)) return false;
      // Filtro por desconto mínimo
      if (descontoMinFiltro && parseFloat(imovel.desconto) < parseFloat(descontoMinFiltro)) return false;
      return true;
    });

    // Aplica a ordenação
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

  // Funções pra adicionar/remover itens dos filtros multi-select
  const handleCidadeToggle = useCallback((cidade: string) => {
    setCidadesFiltro(prev => prev.includes(cidade) ? prev.filter(c => c !== cidade) : [...prev, cidade]);
  }, []);
  
  const handleModalidadeToggle = useCallback((modalidade: string) => {
    setModalidadesFiltro(prev => prev.includes(modalidade) ? prev.filter(m => m !== modalidade) : [...prev, modalidade]);
  }, []);

  const handleTipoToggle = useCallback((tipo: string) => { 
    setTiposFiltro(prev => prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]);
  }, []);

  // Função pra limpar todos os filtros
  const limparFiltros = () => {
    setCidadesFiltro([]);
    setModalidadesFiltro([]);
    setTiposFiltro([]); 
    setTermoBairro('');
    setPrecoMaxFiltro('');
    setDescontoMinFiltro('');
    setOrdenacao('maior-desconto');
  };

  // Retorna tudo organizado pra usar no componente
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