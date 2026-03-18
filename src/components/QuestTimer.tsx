import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, Play, Pause } from 'lucide-react'

interface QuestTimerProps {
  questId: string
  durationMinutes: number
  onComplete: () => void
}

const RADIUS = 72
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getStorageKey(questId: string) {
  return `quest_timer_${questId}`
}

function loadPersistedTimer(questId: string, durationSeconds: number) {
  try {
    const raw = localStorage.getItem(getStorageKey(questId))
    if (!raw) return { timeLeft: durationSeconds, running: false }
    const parsed = JSON.parse(raw)
    const startTime = typeof parsed.startTime === 'number' ? parsed.startTime : 0
    const duration = typeof parsed.duration === 'number' ? parsed.duration : durationSeconds
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const timeLeft = Math.max(0, duration - elapsed)
    return { timeLeft, running: timeLeft > 0 }
  } catch {
    return { timeLeft: durationSeconds, running: false }
  }
}

export function QuestTimer({ questId, durationMinutes, onComplete }: QuestTimerProps) {
  const durationSeconds = durationMinutes * 60
  // Single call to avoid double-read race condition
  const [initialState] = useState(() => loadPersistedTimer(questId, durationSeconds))
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft)
  const [isActive, setIsActive] = useState(initialState.running)
  const [completed, setCompleted] = useState(initialState.timeLeft === 0)

  const handleComplete = useCallback(() => {
    setIsActive(false)
    setCompleted(true)
    localStorage.removeItem(getStorageKey(questId))
    onComplete()
  }, [questId, onComplete])

  // Persist start time when activated
  const handleStart = () => {
    const remaining = timeLeft
    localStorage.setItem(getStorageKey(questId), JSON.stringify({
      startTime: Date.now() - (durationSeconds - remaining) * 1000,
      duration: durationSeconds,
    }))
    setIsActive(true)
  }

  const handlePause = () => {
    // Save new start reference so on resume it picks up correctly
    localStorage.setItem(getStorageKey(questId), JSON.stringify({
      startTime: Date.now() - (durationSeconds - timeLeft) * 1000,
      duration: durationSeconds,
    }))
    setIsActive(false)
  }

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval)
          handleComplete()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive, handleComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = timeLeft / durationSeconds
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  // Color shifts from blue → orange → red as time decreases
  const ringColor =
    progress > 0.5 ? '#3b82f6' :
    progress > 0.2 ? '#f97316' :
    '#ef4444'

  return (
    <div className="glass-panel p-6 rounded-[1.5rem] flex flex-col items-center gap-5 border-t-4 border-t-primary-500">
      <h3 className="text-slate-400 font-medium uppercase tracking-widest text-xs font-sans">
        Tempo de Foco
      </h3>

      {/* Circular Progress Ring */}
      <div className="relative flex items-center justify-center">
        <svg width="176" height="176" className="-rotate-90">
          {/* Track */}
          <circle
            cx="88" cy="88" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="88" cy="88" r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
        </svg>

        {/* Time display inside ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {completed ? (
            <CheckCircle className="w-10 h-10 text-green-400" />
          ) : (
            <>
              <span className="font-mono text-3xl font-bold text-white tabular-nums leading-none">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-500 mt-1 font-sans">
                {durationMinutes}min
              </span>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      {completed ? (
        <div className="w-full flex items-center justify-center gap-3 text-green-400 font-semibold
                        bg-green-500/10 rounded-xl px-4 py-3 border border-green-500/20 animate-scale-in">
          <CheckCircle className="w-5 h-5" />
          Sessão Concluída!
        </div>
      ) : !isActive ? (
        <button onClick={handleStart} className="btn-primary w-full">
          <Play className="w-4 h-4" />
          {timeLeft < durationSeconds ? 'Retomar Sessão' : 'Iniciar Sessão'}
        </button>
      ) : (
        <button onClick={handlePause} className="btn-outline w-full">
          <Pause className="w-4 h-4" />
          Pausar Sessão
        </button>
      )}

      {/* Progress bar (linear, secondary info) */}
      {!completed && (
        <div className="w-full space-y-1">
          <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(1 - progress) * 100}%`,
                backgroundColor: ringColor,
              }}
            />
          </div>
          <p className="text-center text-xs text-slate-600 font-sans">
            {((1 - progress) * 100).toFixed(0)}% concluído
          </p>
        </div>
      )}

      {/* Dev skip — only when timer not complete */}
      {!completed && (
        <button
          onClick={() => { setTimeLeft(0); handleComplete(); }}
          className="text-xs text-dark-600 hover:text-slate-500 transition-colors cursor-pointer font-sans"
        >
          [Dev] Pular Timer
        </button>
      )}
    </div>
  )
}
