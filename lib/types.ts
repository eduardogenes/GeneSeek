// lib/types.ts

// Define a estrutura de dados (interface) para um único Imovel.
// Garante a tipagem e a consistência dos objetos de imóveis em toda a aplicação.
export interface Imovel {
  // Identificador único do imóvel
  id: string;

  // Número de identificação oficial da Caixa
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
  tipoImovel: string; 
  link: string;
  
  // Assinatura de índice para permitir propriedades não mapeadas
  // Usa `unknown` em vez de `any` para maior segurança de tipos
  [key: string]: string | number | boolean | null | undefined;
}