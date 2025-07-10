// components/features/ImovelFilters.tsx
'use client';

import { MultiSelectFilter } from "./filters/MultiSelectFilter";
import { InputFilter } from "./filters/InputFilter";

interface ImovelFiltersProps {
  opcoes: {
      cidades: string[];
      modalidades: string[];
  };
  filtros: {
    cidades: string[];
    modalidades: string[];
    bairro: string;
    precoMax: string;
    descontoMin: string;
  };
  handlers: {
    handleCidadeToggle: (cidade: string) => void;
    handleModalidadeToggle: (modalidade: string) => void;
    setBairro: (value: string) => void;
    setPrecoMax: (value: string) => void;
    setDescontoMin: (value: string) => void;
  };
  onClear: () => void;
}

export function ImovelFilters({ opcoes, filtros, handlers, onClear }: ImovelFiltersProps) {
  return (
    <div className="p-4 border rounded-lg bg-card mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <button
            onClick={onClear}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Limpar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <MultiSelectFilter
          label="Cidades"
          placeholder="Selecione as cidades"
          options={opcoes.cidades}
          selectedValues={filtros.cidades}
          onToggle={handlers.handleCidadeToggle}
        />

        <MultiSelectFilter
          label="Modalidades"
          placeholder="Selecione as modalidades"
          options={opcoes.modalidades}
          selectedValues={filtros.modalidades}
          onToggle={handlers.handleModalidadeToggle}
        />

        <InputFilter
          label="Bairro"
          placeholder="Nome do bairro"
          value={filtros.bairro}
          onChange={handlers.setBairro}
        />

        <InputFilter
          label="Preço Máximo"
          placeholder="Ex: 300000"
          type="number"
          value={filtros.precoMax}
          onChange={handlers.setPrecoMax}
        />

        <InputFilter
          label="Desconto Mínimo (%)"
          placeholder="Ex: 40"
          type="number"
          value={filtros.descontoMin}
          onChange={handlers.setDescontoMin}
        />

      </div>
    </div>
  );
}