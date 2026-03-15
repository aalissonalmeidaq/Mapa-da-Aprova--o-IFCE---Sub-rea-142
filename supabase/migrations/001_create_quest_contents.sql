-- ============================================================
-- Tabela: quest_contents
-- Descrição: Cache persistente do conteúdo gerado pela IA
--            para cada missão do Mapa da Aprovação IFCE.
--
-- Execute este script no SQL Editor do Supabase:
--   https://supabase.com/dashboard/project/rnmlncsldltpeuqechhy/sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.quest_contents (
  quest_id   TEXT        PRIMARY KEY,          -- ex: "quest_2024-03-16_principal"
  topic      TEXT        NOT NULL,             -- nome do tópico da missão
  type       TEXT        NOT NULL DEFAULT '',  -- Principal | Secundaria_PT | etc.
  content    TEXT        NOT NULL,             -- conteúdo Markdown gerado pela IA
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para buscas por tipo (opcional, melhora queries de analytics)
CREATE INDEX IF NOT EXISTS idx_quest_contents_type ON public.quest_contents (type);

-- ── Row Level Security ──────────────────────────────────────
-- O conteúdo é o mesmo para todos os usuários (não é dado pessoal).
-- Qualquer usuário autenticado pode ler e escrever.

ALTER TABLE public.quest_contents ENABLE ROW LEVEL SECURITY;

-- Leitura: usuários autenticados
CREATE POLICY "Authenticated users can read quest_contents"
  ON public.quest_contents
  FOR SELECT
  TO authenticated
  USING (true);

-- Inserção: usuários autenticados
CREATE POLICY "Authenticated users can insert quest_contents"
  ON public.quest_contents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Atualização (upsert): usuários autenticados
CREATE POLICY "Authenticated users can update quest_contents"
  ON public.quest_contents
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── Comentários ──────────────────────────────────────────────
COMMENT ON TABLE  public.quest_contents            IS 'Cache do conteúdo Markdown gerado pela IA Gemini para cada missão';
COMMENT ON COLUMN public.quest_contents.quest_id   IS 'ID único da missão, vindo de schedule.ts';
COMMENT ON COLUMN public.quest_contents.content    IS 'Conteúdo Markdown completo (800-1200 palavras)';
COMMENT ON COLUMN public.quest_contents.updated_at IS 'Última vez que o cache foi atualizado (upsert)';
