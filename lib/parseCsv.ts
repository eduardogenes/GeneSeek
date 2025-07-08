// lib/parseCsv.ts
import Papa, { ParseResult } from 'papaparse';
import { Imovel } from '@/lib/types'; // Importando nosso tipo

export function parseCsv(
  file: File,
  callback: (results: ParseResult<Imovel>) => void
) {
  Papa.parse<Imovel>(file, {
    header: true,         // Trata a primeira linha como cabeçalho
    skipEmptyLines: true,
    encoding: 'latin1',   // Ótima escolha para arquivos de órgãos brasileiros
    complete: callback,
  });
}

//  Adicionamos tipos para file e callback. Usamos o genérico Papa.parse<Imovel> para que o Papaparse saiba qual é o formato esperado dos dados no results.data, melhorando o autocomplete e a segurança do código.