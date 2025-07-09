// lib/parseCsv.ts
import Papa, { ParseResult } from 'papaparse';
import { Imovel } from '@/lib/types';
import { HEADER_PATTERNS, ImovelKey } from './parser-config';

/**
 * Identifica a linha do cabeçalho no CSV e mapeia as colunas para as chaves padronizadas.
 * Utiliza expressões regulares para ser resiliente a variações de texto.
 * @param data As linhas de dados extraídas do CSV.
 * @returns Um objeto com o índice da linha do cabeçalho e o mapeamento das colunas.
 * @throws Lança um erro se um cabeçalho com colunas suficientes não for encontrado.
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

    // A linha com mais correspondências é considerada o cabeçalho correto.
    if (matchesCount > maxMatches) {
      maxMatches = matchesCount;
      headerRowIndex = i;
      bestMap = currentMap;
    }
  }

  // Define um limiar mínimo de colunas para considerar o arquivo válido.
  if (headerRowIndex === -1 || maxMatches < 4) {
    throw new Error(`Cabeçalho não identificado ou com poucas colunas conhecidas (encontradas: ${maxMatches}).`);
  }

  return { headerRowIndex, mappedCols: bestMap };
}

/**
 * Transforma os dados brutos do CSV em um array de objetos `Imovel`.
 * @param results O objeto de resultado do PapaParse.
 * @returns Um array de objetos `Imovel` formatados.
 */
function processData(results: ParseResult<string[]>): Imovel[] {
    const { headerRowIndex, mappedCols } = findAndMapHeaders(results.data);
    const dataRows = results.data.slice(headerRowIndex + 1);

    return dataRows.map((row, rowIndex) => {
      // Ignora linhas que são muito curtas para serem válidas.
      if (!row || row.length < Object.keys(mappedCols).length * 0.5) return null;
      
      const imovel: Partial<Imovel> = {};
      for (const colIndex in mappedCols) {
        const key = mappedCols[colIndex];
        const value = row[colIndex] ? row[colIndex].trim() : '';
        imovel[key] = value;
      }

      // --- Lógica de Geração de ID ---
      // Garante um ID único para cada imóvel, essencial para o React.
      let finalId = imovel.numeroImovel || '';
      if (!finalId && imovel.link) {
        imovel.link = imovel.link.replace(/,+$/, '');
        const match = imovel.link.match(/hdnimovel=(\d+)/);
        if (match && match[1]) {
          finalId = match[1];
        }
      }
      // Fallback para garantir que todo imóvel tenha um ID.
      if (!finalId) {
        const fallbackId = `${imovel.endereco}-${imovel.cidade}-${imovel.preco}-${rowIndex}`;
        finalId = fallbackId;
      }
      
      imovel.id = finalId;
      
      return imovel as Imovel;
    }).filter(imovel => imovel !== null && imovel.id) as Imovel[];
}


/**
 * Verifica a "sanidade" dos dados processados. Se a maioria dos imóveis
 * não tiver um preço válido, assume-se que a codificação do arquivo falhou.
 * @param imoveis A lista de imóveis processada.
 * @returns `true` se os dados forem considerados válidos, `false` caso contrário.
 */
function isDataSane(imoveis: Imovel[]): boolean {
    if (imoveis.length === 0) return false;

    // Calcula a proporção de imóveis com preços inválidos.
    const invalidPriceCount = imoveis.filter(imovel => !imovel.preco || imovel.preco === 'N/A' || parseFloat(imovel.preco) === 0).length;
    const invalidRatio = invalidPriceCount / imoveis.length;

    // Se mais de 70% dos preços forem inválidos, a leitura provavelmente está corrompida.
    if (invalidRatio > 0.7) {
        console.warn(`Verificação de sanidade falhou: ${Math.round(invalidRatio * 100)}% dos imóveis estão sem preço.`);
        return false;
    }

    return true;
}


/**
 * Orquestra a análise do arquivo CSV, testando uma sequência de configurações
 * (codificação e delimitador) até encontrar uma que produza dados válidos.
 * @param file O arquivo CSV enviado pelo usuário.
 * @param callback A função a ser chamada com a lista final de imóveis.
 */
export function parseCsv(file: File, callback: (imoveis: Imovel[]) => void) {
  
  // Lista de configurações a serem testadas, em ordem de prioridade.
  const configsToTry = [
    { encoding: 'utf-8', delimiter: ';' },
    { encoding: 'utf-8', delimiter: ',' },
    { encoding: 'ISO-8859-1', delimiter: ';' }, // Fallback para arquivos legados (comum em Excel/Windows)
    { encoding: 'ISO-8859-1', delimiter: ',' }
  ];

  let configIndex = 0;

  // Tenta analisar o arquivo com a próxima configuração da lista.
  const tryNextConfig = () => {
    // Se todas as tentativas falharam, informa o usuário.
    if (configIndex >= configsToTry.length) {
      console.error("FALHA FINAL: Nenhuma configuração de parse funcionou.");
      alert("Não foi possível ler o arquivo. O formato é desconhecido ou o arquivo está corrompido.");
      callback([]);
      return;
    }
    
    const config = configsToTry[configIndex];
    configIndex++;

    console.log(`Tentando com: codificação '${config.encoding}', delimitador '${config.delimiter}'`);

    Papa.parse<string[]>(file, {
      ...config,
      skipEmptyLines: true,
      header: false,
      complete: (results) => {
        // Se o resultado for inválido, tenta a próxima configuração.
        if (!results.data || results.data.length < 2) {
            tryNextConfig();
            return;
        }

        try {
          const imoveis = processData(results);

          // Ponto chave: Apenas aceita o resultado se passar na verificação de sanidade.
          if (isDataSane(imoveis)) {
            console.log(`Sucesso com: codificação '${config.encoding}', delimitador '${config.delimiter}'`);
            callback(imoveis); // Sucesso: envia os dados e encerra o processo.
          } else {
            tryNextConfig(); // Falha na sanidade: tenta a próxima configuração.
          }
        } catch (error) {
          // Falha no processamento (ex: cabeçalho não encontrado): tenta a próxima.
          console.warn(`Processamento falhou para a configuração atual:`, error);
          tryNextConfig();
        }
      },
      // Falha no próprio PapaParse: tenta a próxima.
      error: (err) => {
          console.warn(`PapaParse falhou para a configuração atual:`, err);
          tryNextConfig();
      },
    });
  };

  // Inicia a primeira tentativa.
  tryNextConfig();
}