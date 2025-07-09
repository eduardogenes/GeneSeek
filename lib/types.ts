// lib/types.ts

/**
 * Define a estrutura de dados (interface) para um único Imovel.
 * Garante a tipagem e a consistência dos objetos de imóveis em toda a aplicação.
 */
export interface Imovel {
  /** Identificador único do imóvel, essencial para chaves do React. */
  id: string;

  /** Número de identificação oficial da Caixa (opcional). */
  numeroImovel?: string;
  
  uf: string;
  cidade: string;
  bairro: string;
  endereco: string;
  preco: string;
  valorAvaliacao: string;
  desconto: string;
  descricao: string;
  modalidadeVenda: string;
  link: string;
  
  /**
   * Assinatura de índice para permitir propriedades não mapeadas.
   * Torna o tipo flexível a colunas extras no CSV que não são utilizadas.
   */
  [key: string]: any;
}