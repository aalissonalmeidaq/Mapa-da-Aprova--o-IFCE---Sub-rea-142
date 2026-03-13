# Mapa da Aprovação IFCE - Task Checklist

## Fase 1: Setup e Infraestrutura
- [x] 1.1 Configurar projeto Frontend (Vite + React + TypeScript + TailwindCSS)
- [x] 1.2 Definir e aplicar Design System (Cores vibrantes, Dark Mode, Tipografia moderna)
- [x] 1.3 Inicializar ou conectar Projeto no Supabase
- [x] 1.4 Criar tabelas e relacionamentos (PostgreSQL no Supabase)
  - `users` (xp, level)
  - `daily_missions` (status, tipo)
  - `study_sessions` (tempo)
  - `quiz_results` (notas, feedback)
- [x] 1.5 Configurar Row Level Security (RLS) nas tabelas

## Fase 2: Autenticação e Edge Functions (IA)
- [x] 2.1 Configurar Supabase Auth e Tela de Login/Cadastro
- [x] 2.2 Desenvolver Edge Function `generate-quest-content` (Resumo da matéria com Gemini API)
- [x] 2.3 Desenvolver Edge Function `generate-quiz` (Questões e JSON de avaliação)
- [x] 2.4 Testar integração das Edge Functions e regras da IA ("Banca AOCP rigorosa")

## Fase 3: Desenvolvimento do Frontend (UI/UX)
- [x] 3.1 Desenvolver Dashboard Gamificado (XP, Mundo Atual, Progressão)
- [x] 3.2 Criar componentes do Mapa de Missões Diárias (Bloqueio intuitivo visual)
- [x] 3.3 Desenvolver Tela da Quest (Visualização do Resumo Gerado)
- [x] 3.4 Implementar Cronômetro Regressivo (2h específicas / 1h secundárias)
- [x] 3.5 Desenvolver Interface de Quiz Dinâmica

## Fase 4: Integração Principal e Regras de Negócio
- [ ] 4.1 Integrar Frontend com Supabase Database (leitura/escrita de progresso)
- [ ] 4.2 Lógica de validação de progresso (Mínimo de 80% para desbloquear próxima Quest)
- [ ] 4.3 Sistema de Ganho de XP e Multiplicadores (Peso 2 Principal, etc.)
- [ ] 4.4 Lógica de refazer Quiz com novo conteúdo caso % < 80%

## Fase 5: Refinamentos e "Boss Fights"
- [ ] 5.1 Adicionar animações e micro-interações (Success/Failure states)
- [ ] 5.2 Estruturar testes/simulados de Domingo ("Chefão da Semana")
- [ ] 5.3 Validação final de responsividade e usabilidade
