// lib/types.ts
export interface Imovel {
  id: string;
  uf: string;
  cidade: string;
  bairro: string;
  endereco: string;
  preco: string;
  valorAvaliacao: string;
  desconto: string;
  descricao: string;
  modalidade: string;
  link: string;
  areaPrivativa?: string;
  // Permite que outras propriedades existam sem quebrar o tipo
  [key: string]: any;
}