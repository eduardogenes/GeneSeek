// lib/parseCsv.ts
import Papa, { ParseResult } from 'papaparse';
import { Imovel } from '@/lib/types';
import { HEADER_PATTERNS, ImovelKey } from './parser-config';

// Converte valores monetários brasileiros pra number
function parseBrazilianCurrency(value: string | undefined): number {
  if (!value) return 0;
  // Remove pontos de milhar, troca vírgula por ponto e converte
  const cleanedValue = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedValue) || 0;
}

// Converte percentual que pode ter vírgula ou ponto
function parsePercentage(value: string | undefined): number {
  if (!value) return 0;
  // Só troca vírgula por ponto
  const cleanedValue = value.replace(',', '.');
  return parseFloat(cleanedValue) || 0;
}


// Função que acha o cabeçalho no CSV e mapeia as colunas pros nossos campos
function findAndMapHeaders(data: string[][]): { headerRowIndex: number; mappedCols: Record<number, ImovelKey> } {
  let headerRowIndex = -1;
  let maxMatches = 0;
  let bestMap: Record<number, ImovelKey> = {};

  // Procura nas primeiras 5 linhas
  for (let i = 0; i < Math.min(data.length, 5); i++) {
    const row = data[i];
    if (!row) continue;
    
    const currentMap: Record<number, ImovelKey> = {};
    let matchesCount = 0;

    // Pra cada célula da linha, tenta fazer match com os padrões
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

    // Se essa linha teve mais matches, ela é a melhor candidata
    if (matchesCount > maxMatches) {
      maxMatches = matchesCount;
      headerRowIndex = i;
      bestMap = currentMap;
    }
  }

  // Precisa ter pelo menos 4 colunas conhecidas
  const MINIMUM_MATCHES = 4;
  if (headerRowIndex === -1 || maxMatches < MINIMUM_MATCHES) {
    throw new Error(`Cabeçalho não identificado ou com poucas colunas conhecidas (encontradas: ${maxMatches}).`);
  }

  return { headerRowIndex, mappedCols: bestMap };
}

// Pega os dados brutos do CSV e transforma em array de objetos Imovel
function processData(results: ParseResult<string[]>): Imovel[] {
    // Primeiro acha onde tá o cabeçalho
    const { headerRowIndex, mappedCols } = findAndMapHeaders(results.data);
    const dataRows = results.data.slice(headerRowIndex + 1);

    return dataRows.map((row, rowIndex) => {
      // Se a linha tá muito vazia, ignora
      if (!row || row.length < Object.keys(mappedCols).length * 0.5) return null;
      
      const imovel: Partial<Imovel> = {};
      // Mapeia cada coluna pro campo correto
      for (const colIndex in mappedCols) {
        const key = mappedCols[colIndex];
        const value = row[colIndex] ? row[colIndex].trim() : '';
        imovel[key] = value;
      }
      
      // Tenta extrair o tipo do imóvel da descrição
      if (imovel.descricao) {
        const tipoMatch = imovel.descricao.match(/^(\w+),/);
        imovel.tipoImovel = tipoMatch ? tipoMatch[1] : 'Outros';
      }

      // Formata os valores monetários e percentuais
      imovel.preco = parseBrazilianCurrency(imovel.preco).toString();
      imovel.valorAvaliacao = parseBrazilianCurrency(imovel.valorAvaliacao).toString();
      imovel.desconto = parsePercentage(imovel.desconto).toString();

      // Gera um ID único pro imóvel
      let finalId = imovel.numeroImovel || '';
      if (!finalId && imovel.link) {
        // Remove vírgulas no final e tenta extrair ID do link
        imovel.link = imovel.link.replace(/,+$/, '');
        const match = imovel.link.match(/hdnimovel=(\d+)/);
        if (match && match[1]) {
          finalId = match[1];
        }
      }
      if (!finalId) {
        // Fallback: cria ID com base nos dados
        const fallbackId = `${imovel.endereco}-${imovel.cidade}-${imovel.preco}-${rowIndex}`;
        finalId = fallbackId;
      }
      
      imovel.id = finalId;
      
      return imovel as Imovel;
    }).filter(imovel => imovel !== null && imovel.id) as Imovel[];
}

// Verifica se os dados processados fazem sentido
function isDataSane(imoveis: Imovel[]): boolean {
    if (imoveis.length === 0) return false;

    // Conta quantos imóveis não têm preço
    const invalidPriceCount = imoveis.filter(imovel => !imovel.preco || parseFloat(imovel.preco) === 0).length;
    const invalidRatio = invalidPriceCount / imoveis.length;

    // Se mais de 70% não tem preço, algo tá errado
    if (invalidRatio > 0.7) {
        console.warn(`Verificação de sanidade falhou: ${Math.round(invalidRatio * 100)}% dos imóveis estão sem preço.`);
        return false;
    }

    return true;
}

// Função principal que tenta processar o CSV com diferentes configurações
export function parseCsv(file: File, callback: (imoveis: Imovel[]) => void) {
  // Diferentes combinações de encoding e delimitador pra tentar
  const configsToTry = [
    { encoding: 'ISO-8859-1', delimiter: ';' },
    { encoding: 'utf-8', delimiter: ';' },
    { encoding: 'ISO-8859-1', delimiter: ',' },
    { encoding: 'utf-8', delimiter: ',' },
  ];

  let configIndex = 0;
  let success = false;

  // Função recursiva que tenta cada configuração
  const tryNextConfig = () => {
    if (configIndex >= configsToTry.length || success) {
      if (!success) {
        console.error("FALHA FINAL: Nenhuma configuração de parse funcionou para o arquivo enviado.");
        alert("Não foi possível ler o arquivo. O formato é desconhecido ou o arquivo está corrompido.");
        callback([]);
      }
      return;
    }
    
    const config = configsToTry[configIndex];
    configIndex++;

    Papa.parse<string[]>(file, {
      ...config,
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        if (success) return;

        if (!results.data || results.data.length < 2) {
            tryNextConfig();
            return;
        }

        try {
          const imoveis = processData(results);
          if (isDataSane(imoveis)) {
            success = true;
            console.log(`Sucesso no upload com: codificação '${config.encoding}', delimitador '${config.delimiter}'`);
            callback(imoveis);
          } else {
            tryNextConfig();
          }
        } catch {
          tryNextConfig();
        }
      },
      error: () => {
          tryNextConfig();
      },
    });
  };
  tryNextConfig();
}