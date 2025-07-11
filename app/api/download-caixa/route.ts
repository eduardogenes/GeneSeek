// app/api/download-caixa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { Imovel } from '@/lib/types';
import { HEADER_PATTERNS, ImovelKey } from '@/lib/parser-config';
import iconv from 'iconv-lite';

// Mesmas funções de processamento que do cliente, mas agora no servidor
// Converte valores monetários brasileiros pra number
function parseBrazilianCurrency(value: string | undefined): number {
  if (!value) return 0;
  const cleanedValue = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedValue) || 0;
}

// Converte percentual que pode ter vírgula ou ponto
function parsePercentage(value: string | undefined): number {
  if (!value) return 0;
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
    throw new Error(`Cabeçalho não identificado (encontradas: ${maxMatches}).`);
  }

  return { headerRowIndex, mappedCols: bestMap };
}

// Pega os dados brutos do CSV e transforma em array de objetos Imovel
function processData(results: Papa.ParseResult<string[]>): Imovel[] {
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
    return invalidRatio <= 0.7;
}


// Esta é a função principal da API - roda no servidor quando chamada
// Next.js automaticamente cria a rota /api/download-caixa quando esse arquivo existe
export async function GET(request: NextRequest) {
  // Pega o parâmetro "estado" da URL (ex: ?estado=CE)
  const { searchParams } = new URL(request.url);
  const estado = searchParams.get('estado');

  if (!estado) {
    return NextResponse.json({ error: 'O parâmetro "estado" é obrigatório' }, { status: 400 });
  }

  try {
    // Monta a URL do arquivo CSV da Caixa baseado no estado
    // Se for 'TODOS', usa 'geral', senão usa o estado em minúscula
    const estadoFormatado = estado === 'TODOS' ? 'geral' : estado.toLowerCase();
    const url = `https://venda-imoveis.caixa.gov.br/listaweb/Lista_imoveis_${estadoFormatado}.csv`;

    // Faz o download do arquivo CSV diretamente do site da Caixa
    // Usa User-Agent pra fingir que é um browser normal
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar o arquivo da Caixa: ${response.status}`);
    }

    // Pega o arquivo como ArrayBuffer (dados binários)
    const buffer = await response.arrayBuffer();
    
    // Configurações diferentes pra tentar decodificar o arquivo
    // Porque os CSVs da Caixa podem vir em encoding diferente
    const configsToTry = [
      { encoding: 'iso-8859-1', delimiter: ';' },
      { encoding: 'utf-8', delimiter: ';' },
      { encoding: 'iso-8859-1', delimiter: ',' },
      { encoding: 'utf-8', delimiter: ',' },
    ];

    // Tenta cada configuração até uma dar certo
    for (const config of configsToTry) {
      try {
        // Usa iconv-lite pra converter o buffer pro encoding correto
        const csvText = iconv.decode(Buffer.from(buffer), config.encoding);
        
        // Usa Papa Parse pra transformar o CSV em array de arrays
        const parsedResult = Papa.parse<string[]>(csvText, {
          skipEmptyLines: true,
          delimiter: config.delimiter,
        });

        // Se não tem dados suficientes, tenta próxima configuração
        if (!parsedResult.data || parsedResult.data.length < 2) continue;
        
        // Processa os dados usando nossa função
        const imoveis = processData(parsedResult);
        
        // Se os dados fazem sentido, retorna como JSON
        if (isDataSane(imoveis)) {
          console.log(`Sucesso na API com: codificação '${config.encoding}', delimitador '${config.delimiter}'`);
          return NextResponse.json(imoveis);
        }
      } catch {
        // Se der erro, continua tentando próxima configuração
        continue;
      }
    }

    // Se chegou aqui, nenhuma configuração funcionou
    throw new Error("Não foi possível processar o arquivo CSV com nenhuma das configurações conhecidas.");

  } catch (error: unknown) {
    console.error('Erro final na API de processamento:', error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}