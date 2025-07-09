// lib/parser-config.ts

export type ImovelKey = 'id' | 'uf' | 'cidade' | 'bairro' | 'endereco' | 'preco' | 'valorAvaliacao' | 'desconto' | 'descricao' | 'modalidade' | 'link';

export const HEADER_MAP: Record<ImovelKey, string[]> = {
  // Adicionamos as versões com erro de codificação encontradas no log
  id: ['n° do imóvel', 'n do imovel', 'numero do imovel', 'nÂ° do imÃ³vel'],
  uf: ['uf', 'estado'],
  cidade: ['cidade', 'município', 'municipio'],
  bairro: ['bairro'],
  endereco: ['endereço', 'endereco', 'endereÃ§o'],
  preco: ['preço', 'preco', 'valor de venda', 'preÃ§o'],
  valorAvaliacao: ['valor de avaliação', 'valor de avaliacao', 'avaliação', 'valor de avaliaÃ§Ã£o'],
  desconto: ['desconto', '% desconto'],
  descricao: ['descrição', 'descricao', 'descriÃ§Ã£o'],
  modalidade: ['modalidade de venda', 'modalidade'],
  link: ['link de acesso', 'link', 'url'],
};