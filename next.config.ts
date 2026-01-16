import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Pra exportar uma página estática, é necessário descomentar as linhas abaixo: */
  //output: 'export', // Gera HTML/CSS/JS estáticos na pasta 'out'
  //basePath: '/eventos-escoteiros', // Nome do repo no GitHub Pages
  //images: { unoptimized: true } // Necessário pois otimização não funciona em static
};

export default nextConfig;
