// components/features/ImovelFilters.tsx
'use client';

import { MultiSelectFilter } from "./filters/MultiSelectFilter";
import { InputFilter } from "./filters/InputFilter";

interface ImovelFiltersProps {
  opcoes: {
    cidades: string[];
    modalidades: string[];
    tipos: string[]; 
  };
  filtros: {
    cidades: string[];
    modalidades: string[];
    tipos: string[]; 
    bairro: string;
    precoMax: string;
    descontoMin: string;
    ordenacao: string;
  };
  handlers: {
    handleCidadeToggle: (cidade: string) => void;
    handleModalidadeToggle: (modalidade: string) => void;
    handleTipoToggle: (tipo: string) => void; 
    setBairro: (value: string) => void;
    setPrecoMax: (value: string) => void;
    setDescontoMin: (value: string) => void;
    setOrdenacao: (value: string) => void;
  };
  onClear: () => void;
}

export function ImovelFilters({ opcoes, filtros, handlers, onClear }: ImovelFiltersProps) {
  return (
    <div className="p-4 border rounded-lg bg-card mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filtros e Ordenação</h2>
        <button onClick={onClear} className="text-sm font-semibold text-primary hover:underline">
          Limpar Tudo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"> {/* AUMENTADO PARA 7 COLUNAS */}
        <div>
          <label htmlFor="ordenacao" className="block text-sm font-medium text-muted-foreground mb-1">Ordenar por</label>
          <select
            id="ordenacao"
            value={filtros.ordenacao}
            onChange={(e) => handlers.setOrdenacao(e.target.value)}
            className="w-full h-10 px-3 bg-background border rounded-md text-sm"
          >
            <option value="maior-desconto">Maior Desconto</option>
            <option value="menor-preco">Menor Preço</option>
            <option value="maior-preco">Maior Preço</option>
          </select>
        </div>
        
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
        {/* NOVO FILTRO DE TIPO DE IMÓVEL */}
        <MultiSelectFilter
          label="Tipo de Imóvel"
          placeholder="Selecione os tipos"
          options={opcoes.tipos}
          selectedValues={filtros.tipos}
          onToggle={handlers.handleTipoToggle}
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