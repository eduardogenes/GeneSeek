// context/imoveis-context.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Imovel } from '@/lib/types';
import { useFavorites } from '@/lib/hooks/useFavorites'; // 1. IMPORTE O NOVO HOOK

interface ImoveisContextType {
  imoveis: Imovel[];
  setImoveis: (imoveis: Imovel[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  // --- NOVAS PROPRIEDADES DE FAVORITOS ---
  favorites: Imovel[];
  toggleFavorite: (imovel: Imovel) => void;
  isFavorite: (imovelId: string) => boolean;
}

const ImoveisContext = createContext<ImoveisContextType | undefined>(undefined);

export function ImoveisProvider({ children }: { children: ReactNode }) {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites(); // 2. USE O HOOK AQUI

  return (
    // 3. ADICIONE AS NOVAS PROPRIEDADES AO VALUE
    <ImoveisContext.Provider value={{ 
      imoveis, setImoveis, 
      isLoading, setIsLoading,
      favorites, toggleFavorite, isFavorite 
    }}>
      {children}
    </ImoveisContext.Provider>
  );
}

export function useImoveis() {
  const context = useContext(ImoveisContext);
  if (context === undefined) {
    throw new Error('useImoveis deve ser usado dentro de um ImoveisProvider');
  }
  return context;
}