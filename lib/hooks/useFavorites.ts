// lib/hooks/useFavorites.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Imovel } from '@/lib/types';

// Chave que usa no localStorage pra salvar os favoritos
const FAVORITES_KEY = 'geneseek-favorites';

// Hook que gerencia a lista de favoritos usando localStorage
export function useFavorites() {
  const [favorites, setFavorites] = useState<Imovel[]>([]);

  // Quando o componente monta, carrega os favoritos salvos
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

  // Função pra salvar a lista no localStorage sempre que mudar
  const saveFavorites = (items: Imovel[]) => {
    try {
      setFavorites(items);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Não foi possível salvar os favoritos no localStorage", error);
    }
  };

  // Adiciona ou remove um imóvel dos favoritos
  const toggleFavorite = useCallback((imovel: Imovel) => {
    const isFavorited = favorites.some(fav => fav.id === imovel.id);
    let newFavorites;

    if (isFavorited) {
      // Remove se já tá favoritado
      newFavorites = favorites.filter(fav => fav.id !== imovel.id);
    } else {
      // Adiciona se não tá favoritado
      newFavorites = [...favorites, imovel];
    }
    
    saveFavorites(newFavorites);
  }, [favorites]);

  // Função pra checar se um imóvel específico tá favoritado
  const isFavorite = useCallback((imovelId: string) => {
    return favorites.some(fav => fav.id === imovelId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}