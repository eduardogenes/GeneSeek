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

// Componente de filtro que permite selecionar múltiplas opções
// Tem busca interna pra quando a lista fica muito grande
export function MultiSelectFilter({
  label,
  placeholder,
  options,
  selectedValues = [],
  onToggle,
}: MultiSelectFilterProps) {
  // Estado local pra controlar a busca dentro do dropdown
  const [searchTerm, setSearchTerm] = useState('');

  // Texto do botão baseado na quantidade selecionada
  const buttonText =
    selectedValues.length === 0
      ? placeholder
      : selectedValues.length === 1
      ? selectedValues[0]
      : `${selectedValues.length} selecionados`;

  // Filtra as opções com base no que o usuário digitou
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
          {/* Campo de busca dentro do dropdown */}
          <Input
            placeholder={`Pesquisar ${label.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <DropdownMenuSeparator />

          {/* Lista as opções já filtradas pela busca */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                checked={selectedValues.includes(option)}
                onCheckedChange={() => onToggle(option)}
                onSelect={(e) => e.preventDefault()} // Impede que feche o dropdown ao selecionar
              >
                {option}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            // Feedback quando a busca não encontra nada
            <p className="p-2 text-sm text-muted-foreground text-center">Nenhum resultado.</p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}