# Mapa da Aprovacao -- IFCE Subarea 142

Plataforma de estudos gamificada para o concurso de **Docencia em Informatica do IFCE** (banca **AOCP**). A IA gera materiais completos por topico, o conteudo e cacheado persistentemente e cada sessao de estudo termina com um quiz no estilo da banca.

---

## Funcionalidades

- **Trilha de Missoes (Quest Trail)** -- trilha visual estilo Duolingo com 42 dias de cronograma e desbloqueio progressivo
- **Geracao de Conteudo via IA** -- material de 800-1200 palavras por topico com streaming em tempo real
- **Dual AI Engine** -- DeepSeek (primario) + Google Gemini 2.5 Flash (fallback), com troca nas Configuracoes
- **Proxy Unificado** -- chamadas de API roteadas via `/api/` (Vite proxy em dev, Vercel Serverless em producao)
- **Cache Persistente em Duas Camadas** -- conteudo salvo em `localStorage` + Supabase; sem chamadas repetidas para o mesmo topico
- **Dicionario de Prompts (PRD)** -- 160+ prompts mapeados por dia/hora, cobrindo 6 semanas de estudo com simulados de fim de semana
- **Quiz Estilo AOCP** -- 5 questoes de multipla escolha com gabarito comentado, geradas com base no material estudado
- **Timer de Foco** -- 2h (missoes principais) ou 1h (secundarias), com persistencia entre sessoes
- **Sistema de XP e Niveis** -- progressao ao completar missoes com aprovacao (>= 80%)
- **Autenticacao** -- login via Supabase Auth
- **Countdown para a Prova** -- contador regressivo ate 26/04/2026
- **Configuracoes** -- troca de motor de IA (DeepSeek/Gemini), perfil do usuario

---

## Stack Tecnologica

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Estilizacao | Tailwind CSS 3 (glassmorphism, dark mode) |
| Fontes | Fira Code (headings) + Fira Sans (body) |
| Estado global | Zustand 5 |
| Backend / Auth | Supabase (Auth + DB + RLS) |
| IA Primaria | DeepSeek Chat (streaming) |
| IA Fallback | Google Gemini 2.5 Flash (streaming) |
| Icones | Lucide React |
| Deploy | Vercel (SPA + Serverless Functions) |

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── ErrorBoundary.tsx      # Captura erros de renderizacao com tela de recuperacao
│   ├── ExamCountdown.tsx      # Contador regressivo ate o dia da prova
│   ├── Layout.tsx             # Layout com navegacao inferior (Mapa, Perfil, Config)
│   ├── MarkdownRenderer.tsx   # Renderiza Markdown da IA (guards anti-tabela malformada)
│   ├── QuestMap.tsx           # Grade visual de missoes (touch-optimized)
│   ├── QuestTimer.tsx         # Timer de sessao de estudo (SVG ring + localStorage)
│   ├── QuestTrail.tsx         # Trilha visual estilo Duolingo (zigzag nodes)
│   └── QuizEngine.tsx         # Motor de quiz (multipla escolha, touch-friendly)
├── data/
│   ├── prompts.ts             # Dicionario de 160+ prompts mapeados por dia/hora (PRD)
│   └── schedule.ts            # Cronograma de 42 dias (16/03 -> 26/04)
├── lib/
│   ├── ai.ts                  # Engine de IA unificada (DeepSeek + Gemini, streaming + fallback)
│   ├── contentSanitizer.ts    # Normaliza Markdown do LLM antes de renderizar (15 regras)
│   ├── questCache.ts          # Cache de conteudo (localStorage + Supabase)
│   └── supabase.ts            # Cliente Supabase
├── pages/
│   ├── Auth.tsx               # Pagina de autenticacao
│   ├── Profile.tsx            # Perfil do usuario e estatisticas
│   ├── QuestPlayer.tsx        # Interface principal de estudo (streaming + quiz)
│   └── Settings.tsx           # Configuracoes (troca de motor de IA)
├── store/
│   └── userStore.ts           # Estado do usuario (Zustand)
└── App.tsx                    # Roteador, dashboard e ErrorBoundary

api/
├── deepseek/
│   └── [...path].ts           # Vercel Serverless proxy para DeepSeek API
└── gemini/
    └── [...path].ts           # Vercel Serverless proxy para Gemini API
```

---

## Instalacao e Configuracao

### Pre-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Chave de API do [DeepSeek](https://platform.deepseek.com) e/ou [Google AI Studio](https://aistudio.google.com)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variaveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-anon-key>
VITE_DEEPSEEK_API_KEY=<sua-chave-deepseek>
VITE_GEMINI_API_KEY=<sua-chave-gemini>
```

Pelo menos uma chave de IA (DeepSeek ou Gemini) e necessaria. Ambas sao recomendadas para fallback automatico.

### 3. Criar a tabela de cache no Supabase

No **SQL Editor** do seu projeto Supabase, execute o arquivo:

```
supabase/migrations/001_create_quest_contents.sql
```

Isso cria a tabela `quest_contents` com Row Level Security para usuarios autenticados.

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`.

---

## Scripts

| Comando | Descricao |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (com proxy para APIs) |
| `npm run build` | Compila TypeScript e gera build de producao |
| `npm run preview` | Visualiza o build localmente |
| `npm run lint` | Analisa o codigo com ESLint |

---

## Arquitetura de IA

### Dual Engine com Fallback

```
Usuario clica "Play" na missao
    |
    v
getPromptForQuest(questId)  -->  Busca prompt do dicionario PRD (dia/hora)
    |
    v
generateQuestContent()  -->  Monta prompt final (persona + missao + formatacao)
    |
    v
callAIStream()  -->  Tenta IA preferida (DeepSeek ou Gemini)
    |                    |
    |                    v  (se falhar)
    |               Fallback para a outra IA
    |
    v
Streaming em tempo real  -->  Conteudo aparece progressivamente no QuestPlayer
    |
    v
sanitizeMarkdown()  -->  15 etapas de normalizacao
    |
    v
saveCachedContent()  -->  localStorage + Supabase (nunca mais consome API)
```

### Proxy de APIs

Em **desenvolvimento**, o Vite proxy redireciona `/api/deepseek/*` e `/api/gemini/*` para as APIs reais. Em **producao** (Vercel), serverless functions em `api/deepseek/[...path].ts` e `api/gemini/[...path].ts` fazem o mesmo papel, evitando problemas de CORS.

---

## Dicionario de Prompts (PRD)

O arquivo `src/data/prompts.ts` contem o mapeamento completo de **160+ prompts** organizados por data e hora:

| Semana | Periodo | Foco |
|---|---|---|
| 1 | 16/03 - 22/03 | Algoritmos e Fundamentos |
| 2 | 23/03 - 29/03 | Estruturas Avancadas, Redes e SO |
| 3 | 30/03 - 05/04 | Banco de Dados e Leis Federais |
| 4 | 06/04 - 12/04 | Engenharia de Software e Testes |
| 5 | 13/04 - 19/04 | Linguagens, Web, SQL e BI |
| 6 | 20/04 - 24/04 | Reta Final (questoes intensivas) |

### Estrutura por dia (seg-sex)

| Hora | Tipo | Conteudo |
|---|---|---|
| H1 | Principal | Conhecimentos Especificos de TI (teoria + codigo + questoes) |
| H2 | Principal | Conhecimentos Especificos de TI (continuacao) |
| H3 | Secundaria | Didatica/Legislacao (EPT, CF/88, Lei 8.112, etc.) |
| H4 | Secundaria | Lingua Portuguesa / Bateria de questoes |

### Fins de semana

Cada sabado/domingo possui um **Simulado Pratico** com 60 questoes abrangendo os temas da semana.

### Semana 6 (Reta Final)

A partir de 20/04, o sistema usa um **prompt unico de exaustao** para as horas 1 e 2: 15 questoes avancadas (10 TI + 5 Portugues) com foco em pegadinhas. Horas 3 e 4 sao reservadas para leitura passiva.

---

## Cache de Conteudo

O conteudo gerado pela IA e salvo automaticamente para evitar chamadas desnecessarias:

```
Abre missao
    |
    v
1. localStorage  -->  acesso instantaneo (mesmo dispositivo)
    | (se vazio)
    v
2. Supabase DB   -->  persistencia real (qualquer dispositivo)
    | (se vazio)
    v
3. API de IA     -->  gera conteudo via streaming --> salva nas duas camadas
```

Apos a primeira geracao, o topico nunca mais consome cota da API. O badge **"Cache Ativado"** aparece no cabecalho da missao indicando a origem.

Para forcar regeneracao de um topico, use `deleteCache(questId)` de `src/lib/questCache.ts`.

---

## Sanitizacao de Conteudo

O `contentSanitizer.ts` normaliza o Markdown bruto do LLM antes de renderizar e antes de salvar no cache.

Pipeline de 15 etapas (`sanitizeMarkdown`):

| # | Etapa | O que corrige |
|---|---|---|
| 1 | Normalizar quebras de linha | `\r\n` -> `\n` |
| 2 | Remover BOM e invisiveis | `\uFEFF`, `\u200B` etc. |
| 3 | Remover preambulo | Frases antes do primeiro `#` |
| 4 | Remover comentarios finais | "Espero que ajude", "Bons estudos!" |
| 5 | Remover titulo duplicado | `# Topico` igual ao titulo do QuestPlayer |
| 6 | Normalizar headings | Sobe niveis para nao conflitar com H1 do player |
| 7 | Corrigir bold com espacos | `** texto **` -> `**texto**` |
| 8 | Corrigir blockquotes | `>texto` -> `> texto` |
| 9 | Normalizar marcadores | `*` e `+` de lista -> `-` |
| 10 | Linha em branco antes de headings | Garante separacao visual |
| 11 | Linha em branco ao redor de codigo | Evita fusao com paragrafos |
| 12 | Linha em branco antes de blockquotes | Idem |
| 13 | Remover tabelas malformadas | Tabelas com >7 colunas curtas -> aviso |
| 14 | Colapsar linhas em branco | 3+ linhas -> 2 |
| 15 | Trim global | Remove espacos desnecessarios |

---

## Design System

| Elemento | Valor |
|---|---|
| Cor primaria | Blue `#3B82F6` (Tailwind `primary-500`) |
| Cor CTA | Orange `#F97316` (Tailwind `secondary-500`) |
| Base escura | `#0f172a` / `#1e293b` |
| Fonte headings | Fira Code (monospace) |
| Fonte body | Fira Sans |
| Icones | Lucide React (sem emojis) |
| Estilo | Glassmorphism com blur e bordas `border-white/10` |

---

## Deploy (Vercel)

O projeto esta configurado para deploy no Vercel com:

- **SPA Routing** -- `vercel.json` redireciona todas as rotas para `/index.html`
- **Serverless Functions** -- `api/deepseek/[...path].ts` e `api/gemini/[...path].ts` servem como proxy CORS
- **Variaveis de ambiente** -- configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DEEPSEEK_API_KEY` e `VITE_GEMINI_API_KEY` no painel do Vercel

---

## Notas de Versao

- **v2.0** -- Dual AI Engine (DeepSeek + Gemini 2.5 Flash), dicionario completo de 160+ prompts PRD com simulados de fim de semana e reta final, Vercel Serverless proxy para CORS, Quest Trail (trilha estilo Duolingo), paginas de Perfil e Configuracoes, Layout com navegacao inferior, ExamCountdown
- **v1.6** -- Correcao de build em producao (Vercel)
- **v1.5** -- Sanitizador de conteudo, defesa em tres camadas contra tabelas malformadas
- **v1.4** -- Correcoes de overflow do conteudo gerado
- **v1.3** -- Cache persistente em Supabase
- **v1.2** -- Streaming de IA e cache local
- **v1.1** -- Otimizacao mobile e integracao com cronograma
- **v1.0** -- Lancamento com sistema de missoes e quizzes

---

Desenvolvido para a aprovacao na Subarea 142 -- Docencia em Informatica (IFCE). Bons estudos!
