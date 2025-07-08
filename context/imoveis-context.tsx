// context/imoveis-context.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Imovel } from '@/lib/types';

interface ImoveisContextType {
  imoveis: Imovel[];
  setImoveis: (imoveis: Imovel[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const ImoveisContext = createContext<ImoveisContextType | undefined>(undefined);

export function ImoveisProvider({ children }: { children: ReactNode }) {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <ImoveisContext.Provider value={{ imoveis, setImoveis, isLoading, setIsLoading }}>
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

// Motivo: Isso cria um sistema de estado compartilhado. ImoveisProvider detém o estado (imoveis, isLoading), e o hook useImoveis permite que qualquer componente filho acesse e modifique esse estado de forma segura e reativa.
