// lib/parseCsv.ts
import Papa, { ParseResult } from 'papaparse';
import { Imovel } from '@/lib/types';

// Função para processar os resultados do Papaparse
function handleParseComplete(results: ParseResult<string[]>, callback: (imoveis: Imovel[]) => void) {
  // O cabeçalho real está na segunda linha do arquivo (índice 1 dos dados)
  const header = results.data[1]; 
  
  // Os dados dos imóveis começam a partir da terceira linha (índice 2)
  const dataRows = results.data.slice(2);

  const imoveis: Imovel[] = dataRows.map(row => {
    const imovel: any = {};
    header.forEach((key, index) => {
      // Remove espaços extras das chaves para segurança
      const trimmedKey = key.trim();
      imovel[trimmedKey] = row[index];
    });
    return imovel as Imovel;
  }).filter(imovel => imovel['N° do imóvel']); // Filtra linhas vazias no final

  callback(imoveis);
}

export function parseCsv(
  file: File,
  callback: (imoveis: Imovel[]) => void
) {
  Papa.parse<string[]>(file, {
    // header: false é importante aqui, pois vamos processar manualmente
    header: false,
    skipEmptyLines: true,
    encoding: 'latin1',
    complete: (results) => handleParseComplete(results, callback),
  });
}