// lib/parser-config.ts

/**
 * Define as chaves padronizadas para o objeto Imovel.
 * Garante consistência em toda a aplicação.
 */
export type ImovelKey = 'numeroImovel' | 'uf' | 'cidade' | 'bairro' | 'endereco' | 'preco' | 'valorAvaliacao' | 'desconto' | 'descricao' | 'modalidadeVenda' | 'link' | 'id' | 'tipoImovel'; // ADICIONADO 'tipoImovel'

/**
 * Mapeamento de padrões de cabeçalho para as chaves padronizadas de Imovel.
 * Usa RegExp para lidar com variações comuns nos nomes das colunas dos arquivos CSV da Caixa,
 * como acentuação, maiúsculas/minúsculas e palavras alternativas.
 */
export const HEADER_PATTERNS: { pattern: RegExp; name: ImovelKey }[] = [
  { pattern: /n[º°]\s*do\s*im[oó]vel/i, name: 'numeroImovel' },
  { pattern: /uf|estado/i, name: 'uf' },
  { pattern: /cidade|munic[ií]pio/i, name: 'cidade' },
  { pattern: /bairro/i, name: 'bairro' },
  { pattern: /endere[çc]o/i, name: 'endereco' },
  { pattern: /pre[çc]o/i, name: 'preco' },
  { pattern: /valor\s*de\s*avalia[çc][aã]o|avalia[çc][aã]o/i, name: 'valorAvaliacao' },
  { pattern: /desconto|%\s*de\s*desconto/i, name: 'desconto' },
  { pattern: /descri[çc][aã]o|caracter[ií]sticas/i, name: 'descricao' },
  { pattern: /modalidade|tipo\s*de\s*venda/i, name: 'modalidadeVenda' },
  { pattern: /tipo\s*de\s*im[oó]vel/i, name: 'tipoImovel' },
  { pattern: /link|acesso|url/i, name: 'link' }
];