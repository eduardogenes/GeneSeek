// context/imoveis-context.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Imovel } from '@/lib/types';
import { useFavorites } from '@/lib/hooks/useFavorites'; // Importa o hook de favoritos

// Define o que o contexto vai disponibilizar
interface ImoveisContextType {
  imoveis: Imovel[];
  setImoveis: (imoveis: Imovel[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  // Funcionalidades de favoritos
  favorites: Imovel[];
  toggleFavorite: (imovel: Imovel) => void;
  isFavorite: (imovelId: string) => boolean;
}

// Cria o contexto
const ImoveisContext = createContext<ImoveisContextType | undefined>(undefined);

// Provider que vai envolver toda a aplicação
export function ImoveisProvider({ children }: { children: ReactNode }) {
  // Estado global dos imóveis carregados
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Usa o hook de favoritos pra incluir no contexto
  const { favorites, toggleFavorite, isFavorite } = useFavorites(); // Usa o hook de favoritos aqui

  return (
    // Disponibiliza tudo pro resto da aplicação
    <ImoveisContext.Provider value={{ 
      imoveis, setImoveis, 
      isLoading, setIsLoading,
      favorites, toggleFavorite, isFavorite 
    }}>
      {children}
    </ImoveisContext.Provider>
  );
}

// Hook customizado pra usar o contexto
export function useImoveis() {
  const context = useContext(ImoveisContext);
  if (context === undefined) {
    throw new Error('useImoveis deve ser usado dentro de um ImoveisProvider');
  }
  return context;
}