// components/features/ImovelFilters.tsx
'use client';

import { MultiSelectFilter } from "./filters/MultiSelectFilter";
import { InputFilter } from "./filters/InputFilter";

// Componentes do Shadcn pra fazer o dropdown de ordenação
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// Interface pra definir os props do componente
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

// Mapeamento dos valores internos pra textos bonitos no botão
const ordenacaoLabels: { [key: string]: string } = {
  'maior-desconto': 'Maior Desconto',
  'menor-preco': 'Menor Preço',
  'maior-preco': 'Maior Preço',
};

// Componente principal de filtros
export function ImovelFilters({ opcoes, filtros, handlers, onClear }: ImovelFiltersProps) {
  return (
    <div className="p-4 border rounded-lg bg-card mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filtros e Ordenação</h2>
        <button onClick={onClear} className="text-sm font-semibold text-primary hover:underline">
          Limpar Tudo
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        {/* Dropdown de ordenação usando Shadcn */}
        <div className="w-full sm:w-auto lg:min-w-[180px] flex-grow">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Ordenar por</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start font-normal">
                {ordenacaoLabels[filtros.ordenacao] || 'Selecione a ordenação'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuRadioGroup 
                value={filtros.ordenacao} 
                onValueChange={handlers.setOrdenacao}
              >
                <DropdownMenuRadioItem value="maior-desconto">Maior Desconto</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="menor-preco">Menor Preço</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="maior-preco">Maior Preço</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Filtro de cidades - usa componente reutilizável */}
        <div className="w-full sm:w-auto lg:min-w-[180px] flex-grow">
          <MultiSelectFilter
            label="Cidades"
            placeholder="Selecione as cidades"
            options={opcoes.cidades}
            selectedValues={filtros.cidades}
            onToggle={handlers.handleCidadeToggle}
          />
        </div>
        
        {/* Filtro de modalidades */}
        <div className="w-full sm:w-auto lg:min-w-[180px] flex-grow">
          <MultiSelectFilter
            label="Modalidades"
            placeholder="Selecione as modalidades"
            options={opcoes.modalidades}
            selectedValues={filtros.modalidades}
            onToggle={handlers.handleModalidadeToggle}
          />
        </div>

        {/* Filtro de tipos de imóvel */}
        <div className="w-full sm:w-auto lg:min-w-[180px] flex-grow">
          <MultiSelectFilter
            label="Tipo de Imóvel"
            placeholder="Selecione os tipos"
            options={opcoes.tipos}
            selectedValues={filtros.tipos}
            onToggle={handlers.handleTipoToggle}
          />
        </div>

        {/* Input de busca por bairro */}
        <div className="w-full sm:w-auto lg:min-w-[180px] flex-grow">
          <InputFilter
            label="Bairro"
            placeholder="Nome do bairro"
            value={filtros.bairro}
            onChange={handlers.setBairro}
          />
        </div>

        {/* Input de preço máximo */}
        <div className="w-full sm:w-auto lg:min-w-[180px] flex-grow">
          <InputFilter
            label="Preço Máximo"
            placeholder="Ex: 300000"
            type="number"
            value={filtros.precoMax}
            onChange={handlers.setPrecoMax}
          />
        </div>

        {/* Input de desconto mínimo */}
        <div className="w-full sm:w-auto lg:min-w-[180px] flex-grow">
          <InputFilter
            label="Desconto Mínimo (%)"
            placeholder="Ex: 40"
            type="number"
            value={filtros.descontoMin}
            onChange={handlers.setDescontoMin}
          />
        </div>
      </div>
    </div>
  );
}