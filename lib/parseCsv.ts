// lib/parseCsv.ts
import Papa, { ParseResult } from 'papaparse';
import { Imovel } from '@/lib/types';
import { HEADER_PATTERNS, ImovelKey } from './parser-config';

/**
 * Converte um número em formato string brasileiro (ex: "1.234,56") para um número.
 */
function parseBrazilianNumber(value: string | undefined): number {
  if (!value) return 0;
  // Remove pontos de milhar, troca a vírgula decimal por ponto e converte para float.
  const cleanedValue = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedValue) || 0;
}

/**
 * Identifica a linha do cabeçalho no CSV e mapeia as colunas para as chaves padronizadas.
 */
function findAndMapHeaders(data: string[][]): { headerRowIndex: number; mappedCols: Record<number, ImovelKey> } {
  let headerRowIndex = -1;
  let maxMatches = 0;
  let bestMap: Record<number, ImovelKey> = {};

  // Itera sobre as primeiras 5 linhas para encontrar a que mais se assemelha a um cabeçalho.
  for (let i = 0; i < Math.min(data.length, 5); i++) {
    const row = data[i];
    if (!row) continue;
    
    const currentMap: Record<number, ImovelKey> = {};
    let matchesCount = 0;

    row.forEach((cell, cellIndex) => {
      if (typeof cell !== 'string') return;
      
      const cleanedCell = cell.trim();
      for (const { pattern, name } of HEADER_PATTERNS) {
        if (pattern.test(cleanedCell)) {
          currentMap[cellIndex] = name;
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

  // Define um limiar mínimo de colunas para considerar o arquivo válido.
  const MINIMUM_MATCHES = 4;
  if (headerRowIndex === -1 || maxMatches < MINIMUM_MATCHES) {
    throw new Error(`Cabeçalho não identificado ou com poucas colunas conhecidas (encontradas: ${maxMatches}).`);
  }

  return { headerRowIndex, mappedCols: bestMap };
}

/**
 * Transforma os dados brutos do CSV em um array de objetos `Imovel`.
 */
function processData(results: ParseResult<string[]>): Imovel[] {
    const { headerRowIndex, mappedCols } = findAndMapHeaders(results.data);
    const dataRows = results.data.slice(headerRowIndex + 1);

    return dataRows.map((row, rowIndex) => {
      if (!row || row.length < Object.keys(mappedCols).length * 0.5) return null;
      
      const imovel: Partial<Imovel> = {};
      for (const colIndex in mappedCols) {
        const key = mappedCols[colIndex];
        const value = row[colIndex] ? row[colIndex].trim() : '';
        imovel[key] = value;
      }
      
      // --- Limpeza e Extração de Dados ---
      if (imovel.descricao) {
        const tipoMatch = imovel.descricao.match(/^(\w+),/);
        imovel.tipoImovel = tipoMatch ? tipoMatch[1] : 'Outros';
      }

      imovel.preco = parseBrazilianNumber(imovel.preco).toString();
      imovel.valorAvaliacao = parseBrazilianNumber(imovel.valorAvaliacao).toString();
      imovel.desconto = parseBrazilianNumber(imovel.desconto).toString();

      // --- Lógica de Geração de ID ---
      let finalId = imovel.numeroImovel || '';
      if (!finalId && imovel.link) {
        imovel.link = imovel.link.replace(/,+$/, '');
        const match = imovel.link.match(/hdnimovel=(\d+)/);
        if (match && match[1]) {
          finalId = match[1];
        }
      }
      if (!finalId) {
        const fallbackId = `${imovel.endereco}-${imovel.cidade}-${imovel.preco}-${rowIndex}`;
        finalId = fallbackId;
      }
      
      imovel.id = finalId;
      
      return imovel as Imovel;
    }).filter(imovel => imovel !== null && imovel.id) as Imovel[];
}

/**
 * Verifica se os dados processados são válidos.
 */
function isDataSane(imoveis: Imovel[]): boolean {
    if (imoveis.length === 0) return false;

    const invalidPriceCount = imoveis.filter(imovel => !imovel.preco || parseFloat(imovel.preco) === 0).length;
    const invalidRatio = invalidPriceCount / imoveis.length;

    if (invalidRatio > 0.7) {
        console.warn(`Verificação de sanidade falhou: ${Math.round(invalidRatio * 100)}% dos imóveis estão sem preço.`);
        return false;
    }

    return true;
}

/**
 * Orquestra a análise do arquivo CSV, testando diferentes configurações.
 */
export function parseCsv(file: File, callback: (imoveis: Imovel[]) => void) {
  const configsToTry = [
    { encoding: 'ISO-8859-1', delimiter: ';' },
    { encoding: 'utf-8', delimiter: ';' },
    { encoding: 'ISO-8859-1', delimiter: ',' },
    { encoding: 'utf-8', delimiter: ',' },
  ];

  let configIndex = 0;

  const tryNextConfig = () => {
    if (configIndex >= configsToTry.length) {
      console.error("FALHA FINAL: Nenhuma configuração de parse funcionou.");
      alert("Não foi possível ler o arquivo. O formato é desconhecido ou o arquivo está corrompido.");
      callback([]);
      return;
    }
    
    const config = configsToTry[configIndex];
    configIndex++;

    Papa.parse<string[]>(file, {
      ...config,
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        if (!results.data || results.data.length < 2) {
            tryNextConfig();
            return;
        }

        try {
          const imoveis = processData(results);
          if (isDataSane(imoveis)) {
            console.log(`Sucesso com: codificação '${config.encoding}', delimitador '${config.delimiter}'`);
            callback(imoveis);
          } else {
            tryNextConfig();
          }
        } catch (error) {
          // log para saber por que uma configuração específica falhou.
          // console.warn(`Processamento falhou para a config: '${config.encoding}', '${config.delimiter}'`, error);
          tryNextConfig();
        }
      },
      error: (err) => {
          // console.warn(`PapaParse falhou para a config: '${config.encoding}', '${config.delimiter}'`, err);
          tryNextConfig();
      },
    });
  };

  tryNextConfig();
}