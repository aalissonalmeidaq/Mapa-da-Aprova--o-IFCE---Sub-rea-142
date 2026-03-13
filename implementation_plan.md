# Mapa da Aprovação - Plano de Implementação

## Visão Geral do Arquitetura

O projeto será dividido em um frontend responsivo e gamificado (SPA) e um backend totalmente serverless gerenciado pelo Supabase. A inteligência do aplicativo (geração de conteúdo e quizzes) será processada através de chamadas à API do Gemini em Edge Functions, garantindo segurança.

### User Review Required

> [!IMPORTANT]
> **Setup do Supabase:** Para prosseguir, precisamos de um projeto no Supabase. Você já possui um projeto criado no Supabase que deseja usar, ou quer que eu crie um novo projeto usando as ferramentas do Supabase MCP? Se já tiver, precisarei das chaves `URL` e `ANON_KEY`.

> [!IMPORTANT]
> **Chaves de API da IA:** Você precisará fornecer uma chave de API válida do Google Gemini (ou OpenAI) para configurarmos os Segredos (Secrets) na Edge Function do Supabase posteriormente.

## Alterações Propostas

### 1. Setup do Frontend
- Iniciar um projeto React com **Vite**, **TypeScript** e **Tailwind CSS**.
- Configurar rotas com `react-router-dom`.
- Criar o Design System inicial (Cores modernas e vibrantes, suporte a Dark Mode para estudo noturno).
- Instalar bibliotecas auxiliares (ex: `lucide-react` para ícones, `@supabase/supabase-js`, `zustand` para gestão de estado global das quests).

### 2. Setup do Banco de Dados (Supabase PostgreSQL)
Criaremos um modelo relacional focado na jornada do usuário:
- **`profiles` / `users`**: Armazena as informações públicas, total de XP, nível atual e avatar.
- **`daily_missions`**: Tabela que define a estrutura da semana e os tópicos do edital, vinculados por data. Status: `locked`, `available`, `completed`.
- **`study_sessions`**: Registro de tempo real focado em uma missão (início e fim do Pomodoro/Sessão).
- **`quiz_results`**: Guarda o resultado das avaliações dinâmicas, o feedback da IA, e o percentual de acerto garantindo rastreabilidade do progresso.
- **`user_xp_history`**: Log de transações de XP para a gamificação.
- **RLS (Row Level Security)**: Todas as tabelas estarão protegidas para que o usuário só possa ler e atualizar seus próprios dados de estudo.

### 3. Integração com IA (Supabase Edge Functions)
Vamos criar duas Edge Functions em TypeScript-Deno:
- **`generate-quest`**: Recebe o ID da missão/tópico, constrói um prompt imersivo ("Tutor do IFCE"), faz chamada à API da Gemini e retorna o conteúdo formatado em Markdown para o frontend.
- **`generate-quiz`**: Após a sessão de estudo, envia o contexto estudado para a IA solicitando um Quiz de múltiplas escolhas ("Banca AOCP"). A função retorna um JSON tipado para o frontend renderizar as perguntas e validar localmente depois.

### 4. Componentes Principais do Frontend
- **Tela de Auth**: Login/Cadastro limpo e rápido via Supabase Auth.
- **Dashboard**: Mapa da jornada mostrando Nível atual, barra de progresso (XP) e as missões do dia dispostas num mapa interativo.
- **Quest Player**: Uma visualização limpa de leitura do resumo gerado.
- **Timer de Foco**: Componente lateral com contagem regressiva (2h específicas, 1h secundárias), imutável caso o usuário recarregue a página (vamos salvar o timestamp no localStorage/DB).
- **Quiz Engine**: Interface de questionário passo-a-passo. Confirmação instantânea de resposta certa/errada e exibição final da \%.
- **Tela de Resultado**: Animação de sucesso (>= 80%) liberando nova quest + XP em dobro, ou de falha (< 80%) com os feedbacks do erro.

## 5. Revisão de UI/UX (Pro Max)
Com base nas diretrizes do Design System "Data-Dense Dashboard", as seguintes alterações visuais e de usabilidade serão implementadas:
- **Tipografia**: Transição para `Fira Code` (Headings/Monospace) e `Fira Sans` (Body).
- **Paleta de Cores**: 
  - `Primary`: `#3B82F6` (Azul Média)
  - `Secondary`: `#60A5FA` (Azul Claro)
  - `CTA/Accent`: `#F97316` (Laranja vibrante para ações principais)
  - Fundos e Textos calibrados para contraste mínimo de 4.5:1 no light mode (`#F8FAFC` bg, `#1E293B` texto).
- **Componentes & Interações**: 
  - Adição rigorosa de `cursor-pointer` em botões, cards e elementos interativos.
  - Hover states com transições suaves (ex: `transition-all duration-200`) e sem "layout shift" (ex: trocar `active:scale-95` ou `transform: translateY` que afete a grade por mudanças sutis de sombra e cor).
  - Profundidade baseada em novas variáveis de sombra (`--shadow-sm` a `--shadow-xl`).
- **Remoção de Anti-patterns**: Exclusão de emojis em favor de ícones SVG (Lucide) consistentes.

## Plano de Verificação

### Verificação Manual
1. Iniciar o frontend localmente e realizar um cadastro de teste.
2. Acessar o Dashboard; visualizar 3 missões geradas (mockadas inicialmente).
3. Simular o clique na Missão Principal. Garantir que a Edge Function retorna o conteúdo via Gemini API.
4. Testar o Timer. Para debug, incluir um "Modo Dev" que completa o tempo instantaneamente.
5. Iniciar o Quiz. Simular dois caminhos:
   - "Falha": Errar nas respostas de propósito e ver se o sistema bloqueia o avanço e exibe a justificativa da IA.
   - "Sucesso": Acertar >= 80% (4 de 5) e ver o XP subir, e a Missão Secundária ficar com status "Available".
6. Checar painel do Supabase se todas as logs e updates (XP, status da quest) estão salvos corretamente.
