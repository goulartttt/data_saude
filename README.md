# Data Saude

Plataforma de monitoramento de saude publica de Sao Paulo com dados reais de doencas infecciosas.

## Sobre o Projeto

Este projeto apresenta um painel interativo com dados de saude publica, incluindo:

- **Dashboard de Doencas**: Visualizacao de casos de AIDS, Dengue, HIV e Malaria
- **Graficos Interativos**: Evolucao temporal dos casos por mes e ano
- **Mapa de Risco**: Visualizacao geografica por zonas e bairros
- **Dados de Vacinacao**: Cobertura vacinal por regiao
- **Conscientizacao**: Informacoes sobre prevencao e postos de saude

## Tecnologias

- [Next.js](https://nextjs.org) - Framework React
- [Supabase](https://supabase.com) - Banco de dados PostgreSQL
- [Tailwind CSS](https://tailwindcss.com) - Estilizacao
- [shadcn/ui](https://ui.shadcn.com) - Componentes de interface
- [Recharts](https://recharts.org) - Graficos interativos
- [Leaflet](https://leafletjs.com) - Mapas interativos

## Primeiros Passos

1. Clone o repositorio
2. Instale as dependencias:

```bash
pnpm install
```

3. Configure as variaveis de ambiente:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Execute o servidor de desenvolvimento:

```bash
pnpm dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Banco de Dados

O projeto utiliza uma tabela `disease_monthly_data` com a seguinte estrutura:

- `id`: Identificador unico
- `doenca`: Nome da doenca (AIDS, Dengue, HIV, Malaria)
- `ano`: Ano de referencia
- `jan` a `deze`: Casos mensais
- `total_anual`: Total de casos no ano

## Fontes de Dados

Os dados apresentados sao baseados em informacoes de saude publica do Brasil.

## Licenca

Este projeto e de uso educacional e informativo.
