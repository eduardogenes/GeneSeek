// lib/types.ts
export interface Imovel {
    // Use os nomes exatos das colunas do seu CSV
    "Endereço do Imóvel": string;
    "Bairro": string;
    "Cidade": string;
    "UF": string;
    "Preço de Avaliação": string; // Papaparse lê tudo como string inicialmente
    "Valor de venda": string;
    "Desconto": string;
    // Adicione outros campos que você precisar
  }

  // Motivo: Centralizar a definição do tipo Imovel permite reutilizá-la em toda a aplicação, garantindo consistência.