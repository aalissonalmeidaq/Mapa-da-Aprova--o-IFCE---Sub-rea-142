/**
 * questCache.ts
 *
 * Cache persistente de conteúdo gerado pela IA.
 * Estratégia em duas camadas:
 *   1. localStorage  → leitura instantânea (mesmo após refresh)
 *   2. Supabase      → persistência real entre dispositivos / limpeza de cache
 *
 * Antes de qualquer chamada à API Gemini, verifique com getCachedContent().
 * Se retornar string, mostre direto — sem chamar a API.
 */

import { supabase } from './supabase'

const LS_PREFIX = 'quest_cache_v2_'

// ──────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────
export type CacheSource = 'localStorage' | 'supabase' | null

export interface CacheResult {
  content: string | null
  source: CacheSource
}

// ──────────────────────────────────────────────
// Leitura
// ──────────────────────────────────────────────

/**
 * Busca conteúdo cacheado para uma missão.
 * Retorna { content, source } onde source indica de onde veio.
 * Se não houver cache → content = null.
 */
export async function getCachedContent(questId: string): Promise<CacheResult> {
  // 1️⃣ localStorage — mais rápido
  try {
    const local = localStorage.getItem(LS_PREFIX + questId)
    if (local) return { content: local, source: 'localStorage' }
  } catch {
    // ignorar erros de localStorage (modo privado, etc.)
  }

  // 2️⃣ Supabase — persistência real
  try {
    const { data, error } = await supabase
      .from('quest_contents')
      .select('content')
      .eq('quest_id', questId)
      .maybeSingle()

    if (!error && data?.content) {
      // Preenchemos o localStorage para próximas visitas serem instantâneas
      try {
        localStorage.setItem(LS_PREFIX + questId, data.content)
      } catch { /* quota full — ok */ }

      return { content: data.content, source: 'supabase' }
    }
  } catch {
    // Supabase indisponível → geraremos novo conteúdo
  }

  return { content: null, source: null }
}

// ──────────────────────────────────────────────
// Escrita
// ──────────────────────────────────────────────

/**
 * Salva conteúdo gerado pela IA para uma missão.
 * Grava em localStorage (imediato) e Supabase (persistente).
 */
export async function saveCachedContent(
  questId: string,
  topic: string,
  type: string,
  content: string,
): Promise<void> {
  // 1️⃣ localStorage imediato
  try {
    localStorage.setItem(LS_PREFIX + questId, content)
  } catch { /* quota full */ }

  // 2️⃣ Supabase — upsert para não duplicar
  try {
    await supabase
      .from('quest_contents')
      .upsert(
        {
          quest_id: questId,
          topic,
          type,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'quest_id' },
      )
  } catch (err) {
    // Falha silenciosa — conteúdo já está em localStorage
    console.warn('questCache: falha ao salvar no Supabase', err)
  }
}

// ──────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────

/** Remove cache local para forçar regeneração via IA */
export function clearLocalCache(questId: string): void {
  try {
    localStorage.removeItem(LS_PREFIX + questId)
    // Mantemos o Supabase intacto — só limpa o localStorage
  } catch { /* ignorar */ }
}

/** Apaga o cache de uma missão em ambas as camadas */
export async function deleteCache(questId: string): Promise<void> {
  clearLocalCache(questId)
  try {
    await supabase.from('quest_contents').delete().eq('quest_id', questId)
  } catch { /* ignorar */ }
}
