// lib/hooks/useFavorites.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Imovel } from '@/lib/types';

// O nome que usaremos para salvar a lista no localStorage.
const FAVORITES_KEY = 'geneseek-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Imovel[]>([]);

  // Este useEffect roda apenas uma vez, quando o componente é montado.
  // Ele carrega os favoritos que já estavam salvos no navegador.
  useEffect(() => {
    try {
      const items = window.localStorage.getItem(FAVORITES_KEY);
      if (items) {
        setFavorites(JSON.parse(items));
      }
    } catch (error) {
      console.error("Não foi possível carregar os favoritos do localStorage", error);
    }
  }, []);

  // Função para salvar os favoritos no localStorage sempre que a lista mudar.
  const saveFavorites = (items: Imovel[]) => {
    try {
      setFavorites(items);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Não foi possível salvar os favoritos no localStorage", error);
    }
  };

  // Adiciona ou remove um imóvel da lista de favoritos.
  const toggleFavorite = useCallback((imovel: Imovel) => {
    const isFavorited = favorites.some(fav => fav.id === imovel.id);
    let newFavorites;

    if (isFavorited) {
      // Remove o imóvel se ele já for um favorito
      newFavorites = favorites.filter(fav => fav.id !== imovel.id);
    } else {
      // Adiciona o imóvel se ele não for um favorito
      newFavorites = [...favorites, imovel];
    }
    
    saveFavorites(newFavorites);
  }, [favorites]);

  // Verifica se um imóvel específico já está na lista de favoritos.
  const isFavorite = useCallback((imovelId: string) => {
    return favorites.some(fav => fav.id === imovelId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}