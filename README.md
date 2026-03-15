# Mapa da Aprovação — IFCE Subárea 142

Plataforma de estudos gamificada para o concurso de **Docência em Informática do IFCE** (banca **AOCP**). A IA gera materiais completos por tópico, o conteúdo é cacheado persistentemente e cada sessão de estudo termina com um quiz no estilo da banca.

---

## Funcionalidades

- **Mapa de Missões** — grade visual com 42 dias de cronograma e desbloqueio progressivo
- **Geração de Conteúdo via IA** — material de 800–1200 palavras por tópico com streaming em tempo real (Gemini 2.5 Flash)
- **Cache Persistente em Duas Camadas** — conteúdo salvo em `localStorage` + Supabase; sem chamadas repetidas para o mesmo tópico
- **Quiz Estilo AOCP** — 5 questões de múltipla escolha com gabarito comentado, geradas com base no material estudado
- **Timer de Foco** — 2h (missões principais) ou 1h (secundárias), com persistência entre sessões
- **Sistema de XP e Níveis** — progressão ao completar missões com aprovação (≥ 80%)
- **Autenticação** — login via Supabase Auth

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Estilização | Tailwind CSS 3 (glassmorphism) |
| Estado global | Zustand 5 |
| Backend / Auth | Supabase |
| IA | Google Gemini 2.5 Flash (fallback para Lite) |
| Ícones | Lucide React |

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── MarkdownRenderer.tsx   # Renderiza o conteúdo Markdown da IA
│   ├── QuestMap.tsx           # Grade visual de missões
│   ├── QuestTimer.tsx         # Timer de sessão de estudo
│   └── QuizEngine.tsx         # Motor de quiz (múltipla escolha)
├── data/
│   └── schedule.ts            # Cronograma de 42 dias (16/03 → 26/04)
├── lib/
│   ├── gemini.ts              # Wrapper da API Gemini (streaming + JSON estruturado)
│   ├── questCache.ts          # Cache de conteúdo (localStorage + Supabase)
│   └── supabase.ts            # Cliente Supabase
├── pages/
│   ├── Auth.tsx               # Página de autenticação
│   └── QuestPlayer.tsx        # Interface principal de estudo
├── store/
│   └── userStore.ts           # Estado do usuário (Zustand)
└── App.tsx                    # Roteador e dashboard
supabase/
└── migrations/
    └── 001_create_quest_contents.sql  # Tabela de cache de conteúdo gerado
```

---

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Chave de API do [Google AI Studio](https://aistudio.google.com)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-anon-key>
VITE_GEMINI_API_KEY=<sua-chave-gemini>
```

### 3. Criar a tabela de cache no Supabase

No **SQL Editor** do seu projeto Supabase, execute o arquivo:

```
supabase/migrations/001_create_quest_contents.sql
```

Isso cria a tabela `quest_contents` com Row Level Security para usuários autenticados.

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`.

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Compila TypeScript e gera build de produção |
| `npm run preview` | Visualiza o build localmente |
| `npm run lint` | Analisa o código com ESLint |

---

## Cache de Conteúdo

O conteúdo gerado pela IA é salvo automaticamente para evitar chamadas desnecessárias à API:

```
Abre missão
    ↓
1️⃣ localStorage  →  acesso instantâneo (mesmo dispositivo)
    ↓ (se vazio)
2️⃣ Supabase DB   →  persistência real (qualquer dispositivo)
    ↓ (se vazio)
3️⃣ API Gemini    →  gera conteúdo → salva nas duas camadas
```

Após a primeira geração, o tópico nunca mais consome cota da API. O badge **"cache local"** ou **"cache db"** aparece no cabeçalho da missão indicando a origem.

Para forçar regeneração de um tópico, use `deleteCache(questId)` de `src/lib/questCache.ts`.

---

## Cronograma de Estudos

Plano de **42 dias** (16/03 a 26/04) em 3 fases:

| Semanas | Fase |
|---|---|
| 1–2 | Fundamentos |
| 3–5 | Intermediário |
| 6 | Sprint Final |

Cada dia possui até 4 missões:

| Tipo | Duração | Conteúdo |
|---|---|---|
| Principal | 2h | Conhecimentos Específicos de Informática |
| Secundária PT | 1h | Língua Portuguesa — gramática e pegadinhas AOCP |
| Secundária Didática / Legislação | 1h | Docência, EPT, legislação educacional |
| Revisão | — | Resumo condensado, checklists e mapa mental |

---

## Notas de Versão

- **v1.3** — Cache persistente em Supabase (`questCache.ts`) + migration SQL
- **v1.2** — Streaming de IA e cache local em `localStorage`
- **v1.1** — Otimização mobile e integração com cronograma
- **v1.0** — Lançamento com sistema de missões e quizzes

---

Desenvolvido para a aprovação na Subárea 142 — Docência em Informática. Bons estudos!
