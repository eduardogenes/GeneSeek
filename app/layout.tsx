// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ImoveisProvider } from "@/context/imoveis-context"; // Importe o Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garimpeiro Genes",
  description: "Encontre as melhores oportunidades em imóveis da Caixa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ImoveisProvider>{children}</ImoveisProvider> { /* Envolva o children */ }
      </body>
    </html>
  );
}

// Motivo: Ao colocar o provider no layout raiz, garantimos que o estado dos imóveis estará disponível em todas as páginas da aplicação.