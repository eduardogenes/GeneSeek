// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ImoveisProvider } from "@/context/imoveis-context";
import { ThemeProvider } from "./theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garimpeiro Genes",
  description: "Encontre as melhores oportunidades em imóveis da Caixa",
};

// Layout principal que envolve toda a aplicação
// Configura o contexto global e fontes
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {/* Envolve o ImoveisProvider com o ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ImoveisProvider>{children}</ImoveisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}