// components/features/filters/MultiSelectFilter.tsx
'use client';

import { useState } from 'react'; // Importe o useState
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input"; 

interface MultiSelectFilterProps {
  label: string;
  placeholder: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

/**
 * Um componente de filtro genérico que renderiza um botão para abrir um
 * menu dropdown com opções de seleção múltipla, incluindo uma barra de pesquisa interna.
 */
export function MultiSelectFilter({
  label,
  placeholder,
  options,
  selectedValues = [],
  onToggle,
}: MultiSelectFilterProps) {
  // Estado local para controlar o termo de pesquisa dentro do dropdown.
  const [searchTerm, setSearchTerm] = useState('');

  const buttonText =
    selectedValues.length === 0
      ? placeholder
      : selectedValues.length === 1
      ? selectedValues[0]
      : `${selectedValues.length} selecionados`;

  // Filtra as opções com base no termo de pesquisa antes de as renderizar.
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start font-normal">
            {buttonText}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60 p-2" align="start">
          {/* Campo de input para a pesquisa */}
          <Input
            placeholder={`Pesquisar ${label.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <DropdownMenuSeparator />

          {/* O `map` agora itera sobre as opções JÁ FILTRADAS */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                checked={selectedValues.includes(option)}
                onCheckedChange={() => onToggle(option)}
                onSelect={(e) => e.preventDefault()}
              >
                {option}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            // Feedback caso a pesquisa não encontre resultados.
            <p className="p-2 text-sm text-muted-foreground text-center">Nenhum resultado.</p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}