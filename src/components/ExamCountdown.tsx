import { useState, useEffect } from 'react'
import { Calendar, AlertTriangle } from 'lucide-react'

const EXAM_DATE = new Date('2026-04-26T08:00:00')

export function ExamCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = EXAM_DATE.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft(null)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) return null

  return (
    <div className="glass-panel p-6 rounded-[2.5rem] border-white/10 bg-slate-900/40 relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-orange-500/10 rounded-xl ring-1 ring-orange-500/20 shadow-inner">
            <Calendar className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none mb-1">DATA DA PROVA</h4>
            <span className="text-sm font-black text-white font-mono uppercase tracking-tighter">26 DE ABRIL, 2026</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <TimeBlock value={timeLeft.days} label="DIAS" />
          <TimeBlock value={timeLeft.hours} label="HORAS" />
          <TimeBlock value={timeLeft.minutes} label="MIN" />
          <TimeBlock value={timeLeft.seconds} label="SEG" isLast />
        </div>

        <div className="bg-orange-500/5 rounded-2xl p-4 border border-orange-500/10 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
          <p className="text-[10px] text-orange-200/60 leading-tight font-medium">
            Reta final! Intensifique seus estudos na <span className="text-orange-400 font-black">Subárea 142</span>. Cada minuto conta para sua aprovação no IFCE.
          </p>
        </div>
      </div>
    </div>
  )
}

function TimeBlock({ value, label, isLast = false }: { value: number; label: string; isLast?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner mb-2 group-hover:border-orange-500/20 transition-colors">
        <span className="text-lg font-black font-mono text-white tracking-tighter">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">{label}</span>
      {!isLast && (
        <div className="absolute top-1/2 -translate-y-1/2 -right-1 text-slate-700 font-mono hidden">:</div>
      )}
    </div>
  )
}
