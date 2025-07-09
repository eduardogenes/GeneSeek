// lib/parseCsv.ts
import Papa, { ParseResult } from 'papaparse';
import { Imovel } from '@/lib/types';
import { HEADER_MAP, ImovelKey } from './parser-config';

// As funções normalizeHeader e findAndMapHeaders permanecem as mesmas
function normalizeHeader(header: string): string {
  if (typeof header !== 'string') return '';
  return header.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function findAndMapHeaders(data: string[][]): { headerRowIndex: number; mappedCols: Record<number, ImovelKey> } {
  let headerRowIndex = -1;
  let maxMatches = 0;
  let bestMap: Record<number, ImovelKey> = {};

  for (let i = 0; i < Math.min(data.length, 5); i++) {
    const row = data[i];
    if (!row) continue;
    const currentMap: Record<number, ImovelKey> = {};
    let matchesCount = 0;

    row.forEach((cell, cellIndex) => {
      const normalizedCell = normalizeHeader(cell);
      for (const key in HEADER_MAP) {
        const imovelKey = key as ImovelKey;
        if (HEADER_MAP[imovelKey].map(normalizeHeader).includes(normalizedCell)) {
          currentMap[cellIndex] = imovelKey;
          matchesCount++;
          break;
        }
      }
    });

    if (matchesCount > maxMatches) {
      maxMatches = matchesCount;
      headerRowIndex = i;
      bestMap = currentMap;
    }
  }

  if (headerRowIndex === -1 || maxMatches < 4) {
    throw new Error(`Cabeçalho não identificado ou com poucas colunas conhecidas (encontradas: ${maxMatches}).`);
  }

  return { headerRowIndex, mappedCols: bestMap };
}

// Processa os dados brutos para transformá-los em uma lista de objetos Imovel
function processData(results: ParseResult<string[]>, callback: (imoveis: Imovel[]) => void) {
  try {
    const { headerRowIndex, mappedCols } = findAndMapHeaders(results.data);
    const dataRows = results.data.slice(headerRowIndex + 1);

    const imoveis: Imovel[] = dataRows.map((row, rowIndex) => {
      if (!row || row.length < 5) return null; // Aumentando a segurança para linhas válidas
      
      const imovel: Partial<Imovel> = {};
      for (const colIndex in mappedCols) {
        const key = mappedCols[colIndex];
        const value = row[colIndex] ? row[colIndex].trim() : '';
        imovel[key] = value;
      }

      // --- LÓGICA DE LIMPEZA E EXTRAÇÃO DE ID (VERSÃO FINAL) ---

      // 1. Limpa as vírgulas extras do final do link, se o link existir
      if (imovel.link) {
        imovel.link = imovel.link.replace(/,+$/, '');
      }

      // 2. Tenta extrair o ID do link, se o link existir
      if (!imovel.id && imovel.link) {
        const match = imovel.link.match(/hdnimovel=(\d+)/);
        if (match && match[1]) {
          imovel.id = match[1];
        }
      }
      
      // 3. PLANO C: Se AINDA não tivermos um ID, criamos um ID único artificial
      if (!imovel.id) {
        // Concatenamos informações que provavelmente tornam o imóvel único.
        // Adicionamos o rowIndex para garantir 100% de unicidade dentro deste arquivo.
        const fallbackId = `${imovel.endereco}-${imovel.cidade}-${imovel.preco}-${rowIndex}`;
        imovel.id = fallbackId;
      }
      
      return imovel as Imovel;
    }).filter(imovel => imovel !== null) as Imovel[];

    // O filtro final agora só precisa garantir que o objeto existe, pois garantimos um ID para todos.
    const imoveisFinais = imoveis.filter(imovel => imovel);
    
    callback(imoveisFinais);

  } catch (error) {
    // Este erro agora só deve acontecer se o cabeçalho for realmente inválido.
    console.error("Erro ao processar os dados:", error);
    alert("Erro ao processar o arquivo. O formato do cabeçalho não foi reconhecido.");
    callback([]);
  }
}


// Função principal que inicia o parse.
export function parseCsv(file: File, callback: (imoveis: Imovel[]) => void) {
  const handleFinalError = (parserError?: Error) => {
    console.error("FALHA FINAL: Não foi possível processar o arquivo.", parserError);
    alert("Não foi possível processar o arquivo. O formato é desconhecido ou o arquivo está corrompido.");
    callback([]);
  };

  // Função para tentar processar com um delimitador específico
  const tryParseWithDelimiter = (delimiter: string, isRetry = false) => {
    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: true,
      delimiter,
      complete: (results: Papa.ParseResult<string[]>) => {
        const sampleRow = results.data.find((row: string[]) => row.length > 5);
        if (sampleRow) {
          try {
            processData(results, callback);
          } catch (error) {
            if (!isRetry) {
              // Se for a primeira tentativa, tenta com o outro delimitador
              tryParseWithDelimiter(delimiter === ';' ? ',' : ';', true);
            } else {
              handleFinalError(error as Error);
            }
          }
        } else if (!isRetry) {
          // Se não encontrou dados suficientes e é a primeira tentativa, tenta com o outro delimitador
          tryParseWithDelimiter(delimiter === ';' ? ',' : ';', true);
        } else {
          handleFinalError();
        }
      },
      error: isRetry ? handleFinalError : undefined // Só trata erro na segunda tentativa
    });
  };

  // Inicia o parse com ponto e vírgula primeiro
  tryParseWithDelimiter(';');
}