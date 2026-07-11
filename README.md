# LinkLab — Frontend

Frontend do **LinkLab**, um encurtador de links com dashboard, QR Code e
estatísticas de cliques. Construído com Next.js (App Router) e Tailwind CSS.

## O que este projeto faz

- Landing page com formulário de encurtar link
- Dashboard com lista de links e contagem de cliques
- Página de criar link com geração de QR Code
- Tema claro/escuro

Consome a API do repositório [`encurtador-api`](../encurtador-api), que precisa
estar rodando à parte.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4**
- **recharts** — gráficos do dashboard
- **lucide-react** — ícones
- **next-themes** — tema claro/escuro

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- A API (`encurtador-api`) rodando localmente — veja o README dela

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Ajuste `NEXT_PUBLIC_API_URL` se a API estiver rodando em outro endereço.

### 3. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Comando         | O que faz                          |
|-----------------|-------------------------------------|
| `npm run dev`   | Sobe o servidor de desenvolvimento   |
| `npm run build` | Gera o build de produção            |
| `npm run start` | Roda o build de produção            |
| `npm run lint`  | Roda o linter (ESLint)              |

## Estrutura do projeto
app/
page.tsx              # Landing page
layout.tsx            # Layout raiz (fontes, tema)
dashboard/
page.tsx            # Dashboard principal
criar/page.tsx       # Página de criar link (QR Code)
layout.tsx           # Layout do dashboard (sidebar, navbar)
components/
Navbar.tsx
Sidebar.tsx
ShortenForm.tsx        # Formulário de encurtar link (usado na landing)
ThemeProvider.tsx
ThemeToggle.tsx
DashboardPreview.tsx
public/                  # Ícones e assets estáticos
