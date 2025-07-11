# Garimpeiro Genes 

![GitHub last commit](https://img.shields.io/github/last-commit/eduardogenes/geneseek?style=for-the-badge&logo=github&color=7C3AED)
![GitHub language count](https://img.shields.io/github/languages/count/eduardogenes/geneseek?style=for-the-badge&color=7C3AED)
![GitHub repo size](https://img.shields.io/github/repo-size/eduardogenes/geneseek?style=for-the-badge&color=7C3AED)

> **Garimpeiro de oportunidades** em imóveis da Caixa Econômica Federal com análise inteligente e visualização moderna.

O Garimpeiro Genes transforma a complexa planilha de imóveis da Caixa em uma plataforma web intuitiva e poderosa, permitindo análise detalhada, filtros avançados e identificação rápida das melhores oportunidades de investimento.

---

###  Demonstração

 **[Demo](https://geneseek.vercel.app/)**

---

###  Sobre o Projeto

A Caixa Econômica Federal disponibiliza milhares de imóveis para venda em planilhas CSV extensas e complexas. Analisar esses dados manualmente é trabalhoso e ineficiente.

O **Garimpeiro Genes** revoluciona essa experiência oferecendo:
- **Upload inteligente** de planilhas com parsing robusto
- **Busca automática** por estado diretamente dos servidores da Caixa
- **Interface moderna** com filtros avançados e sistema de favoritos
- **Visualização otimizada** para desktop e mobile

---

###  Principais Funcionalidades

####  **Análise de Dados**
- **Parser CSV Robusto:** Detecta automaticamente codificação (UTF-8, ISO-8859-1) e delimitadores
- **Mapeamento Inteligente:** Reconhece variações nos nomes das colunas automaticamente
- **Validação de Dados:** Filtra e limpa dados inconsistentes

####  **Busca e Filtros**
- **Busca Automática:** Download direto dos CSVs da Caixa por estado
- **Filtros Avançados:** Cidade, modalidade, tipo de imóvel, bairro, preço máximo, desconto mínimo
- **Busca com Debounce:** Filtros responsivos que não travam a interface
- **Ordenação Múltipla:** Por preço, desconto, cidade, etc.

####  **Sistema de Favoritos**
- **Favoritos Persistentes:** Salva no localStorage do navegador
- **Página Dedicada:** Visualização exclusiva dos imóveis favoritados
- **Toggle Rápido:** Adiciona/remove favoritos com um clique

####  **Interface e Experiência**
- **Design Responsivo:** Funciona perfeitamente em desktop, tablet e mobile
- **Tema Escuro/Claro:** Alternância automática baseada na preferência do sistema
- **Cards Informativos:** Visualização clara com todas as informações relevantes
- **Navegação Intuitiva:** Páginas de detalhes e navegação fluida

####  **Integração Externa**
- **Links Diretos:** Acesso ao anúncio original da Caixa
- **Download Automático:** API interna que busca dados atualizados

---

###  Tecnologias Utilizadas

**Frontend:**
- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

**Estilização:**
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/) 

**Processamento de Dados:**
- [Papaparse](https://www.papaparse.com/) - Parsing de CSV
- [iconv-lite](https://github.com/ashtuchkin/iconv-lite) - Decodificação de caracteres

**Estado e Context:**
- React Context API
- Custom Hooks para gerenciamento de estado
- localStorage para persistência

---

###  Estrutura do Projeto

```
geneseek/
├── app/                          # Páginas e rotas (App Router)
│   ├── page.tsx                  # Página inicial
│   ├── layout.tsx                # Layout global
│   ├── imoveis/
│   │   ├── page.tsx              # Lista de imóveis
│   │   └── [id]/page.tsx         # Detalhes do imóvel
│   ├── favoritos/page.tsx        # Página de favoritos
│   └── api/download-caixa/       # API para busca automática
├── components/
│   ├── features/                 # Componentes de funcionalidades
│   │   ├── CardImovel.tsx        # Card do imóvel
│   │   ├── ImovelFilters.tsx     # Sistema de filtros
│   │   ├── DownloadCaixaButton.tsx # Busca automática
│   │   └── filters/              # Componentes de filtro
│   └── ui/                       # Componentes base (Shadcn)
├── lib/
│   ├── parseCsv.ts               # Parser principal
│   ├── parser-config.ts          # Configurações de mapeamento
│   ├── types.ts                  # Tipos TypeScript
│   └── hooks/                    # Custom hooks
│       ├── useImovelFilters.ts   # Hook de filtros
│       └── useFavorites.ts       # Hook de favoritos
└── context/
    └── imoveis-context.tsx       # Context global
```

---

###  Começando

#### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [Git](https://git-scm.com/)

#### Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/eduardogenes/geneseek.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd geneseek
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Execute em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse:** [http://localhost:3000](http://localhost:3000)

#### Scripts Disponíveis

```bash
npm run dev      # Execução em modo desenvolvimento
npm run build    # Build para produção
npm run start    # Execução em modo produção
npm run lint     # Verificação de código
```

---

###  Como Usar

#### **Opção 1: Upload de Planilha**
1. Baixe a planilha CSV de imóveis da Caixa
2. Clique em "Escolher arquivo" na página inicial
3. Faça upload do arquivo CSV
4. Navegue pelos imóveis com filtros e favoritos

#### **Opção 2: Busca Automática**
1. Clique em "Buscar automaticamente"
2. Selecione o estado desejado
3. Aguarde o download e processamento automático
4. Explore os resultados com todas as funcionalidades

---

###  Configuração Avançada

#### **Parser CSV**
O sistema é altamente configurável e suporta:
- Múltiplas codificações (UTF-8, ISO-8859-1)
- Diferentes delimitadores (vírgula, ponto-e-vírgula)
- Variações nos nomes das colunas
- Validação e limpeza automática de dados

#### **Personalização de Filtros**
Todos os filtros são configuráveis em `lib/hooks/useImovelFilters.ts`:
- Tipos de ordenação
- Campos de filtro
- Lógica de busca

---

###  Funcionalidades Implementadas

- [x] Upload e parsing robusto de CSV
- [x] Busca automática por estado
- [x] Filtros avançados (cidade, modalidade, tipo, bairro, preço, desconto)
- [x] Sistema de favoritos com persistência
- [x] Páginas de detalhes dos imóveis
- [x] Interface responsiva com tema escuro/claro
- [x] API interna para download da Caixa
- [x] Navegação otimizada e links externos
- [x] Context API para estado global
- [x] Custom hooks para lógica complexa
- [x] Validação e tratamento de erros

---

###  Roadmap Futuro

- [ ] Integração com APIs de localização
- [ ] Dashboard com gráficos e estatísticas
- [ ] Exportação de dados filtrados
- [ ] Notificações de novos imóveis
- [ ] Comparação lado a lado de imóveis
- [ ] Sistema de alertas por critérios
- [ ] Histórico de preços

---

###  Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

###  Autor

Feito com  por **Eduardo Genes**

[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/eduardogenes/)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/eduardogenes)

---

###  Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

* Se este projeto te interessou, considere dar uma estrela no repositório!*