import { Play, Star, BookOpen, Scale, ScrollText, Trophy, User, Zap } from 'lucide-react'
import { getSchedule, type DaySchedule, getQuestsForDate, getWeekNumber } from '../data/schedule'
import { useState, useMemo } from 'react'
import type { Quest } from './QuestMap'

const QUEST_ICONS = {
  'Principal':           BookOpen,
  'Secundaria_PT':       ScrollText,
  'Secundaria_Didatica': Star,
  'Secundaria_Legis':    Scale,
}

interface TrailNodeProps {
  day: DaySchedule
  index: number
  status: 'locked' | 'available' | 'completed'
  progress: number
  onSelect: (day: DaySchedule) => void
}

function TrailNode({ day, index, status, onSelect }: TrailNodeProps) {
  // zigzag pattern - fluid values
  const offset = useMemo(() => {
    const cycle = index % 8
    const values = [0, 60, 100, 60, 0, -60, -100, -60]
    return values[cycle] || 0
  }, [index])

  const statusColors = {
    completed: 'bg-emerald-500 border-emerald-400 shadow-[0_8px_0_#059669] hover:shadow-[0_12px_0_#059669]',
    available: 'bg-teal-500 border-teal-400 shadow-[0_8px_0_#0d9488] hover:shadow-[0_12px_0_#0d9488] animate-float',
    locked: 'bg-slate-800 border-slate-700 opacity-50 grayscale shadow-[0_8px_0_#1e293b]',
  }

  const Icon = index % 4 === 3 ? Trophy : (index % 4 === 1 ? BookOpen : Zap)

  return (
    <div className="trail-node-container py-8">
      <div 
        onClick={() => status !== 'locked' && onSelect(day)}
        className={`w-24 h-24 rounded-[2.5rem] border-4 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 active:translate-y-2 group ${statusColors[status]}`}
        style={{ transform: `translateX(${offset}px)` }}
      >
        <div className="absolute -top-3 -right-3 w-8 h-8 glass-panel rounded-full flex items-center justify-center border-white/20 shadow-xl group-hover:scale-110 transition-transform">
           <span className="text-[10px] font-black text-white">{index + 1}</span>
        </div>
        
        <Icon className={`w-10 h-10 text-white ${status === 'available' ? 'fill-white animate-pulse' : 'fill-white/20'} group-hover:scale-110 transition-transform`} />

        {/* Liquid Indicator for Active Node */}
        {status === 'available' && (
          <div className="absolute -inset-4 bg-teal-500/20 blur-2xl rounded-full -z-10 animate-pulse-slow" />
        )}
      </div>
      
      <div className="mt-4 text-center" style={{ transform: `translateX(${offset}px)` }}>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${status === 'locked' ? 'text-slate-600' : 'text-slate-400'}`}>
           {day.dayOfWeek} · {day.date}
        </p>
      </div>

      {index < 50 && (
         <div 
           className="absolute top-[8rem] left-1/2 -translate-x-1/2 w-4 h-16 bg-slate-800/10 -z-10 rounded-full" 
           style={{ transform: `translateX(${offset}px)` }}
         />
      )}
    </div>
  )
}

export function QuestTrail({ onSelectQuest }: { onSelectQuest: (q: Quest) => void }) {
  const schedule = getSchedule()
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null)

  const handleDayClick = (day: DaySchedule) => setSelectedDay(day)

  const questsForSelectedDay = useMemo(() => {
    if (!selectedDay) return []
    return getQuestsForDate(selectedDay.date)
  }, [selectedDay])

  return (
    <div className="w-full h-full pb-32 pt-10">
      <div className="max-w-md mx-auto px-6 space-y-24">
        {Array.from({ length: 6 }).map((_, weekIdx) => {
          const weekNum = weekIdx + 1
          const weekDays = schedule.filter(d => getWeekNumber(d.date) === weekNum)
          
          if (weekDays.length === 0) return null

          return (
            <div key={weekIdx} className="relative first:mt-8 space-y-16">
              {/* Unit Card Refined */}
              <div className="relative group mx-auto max-w-2xl px-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-[#020617] border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center shadow-2xl">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">Objetivo Atual</span>
                    <h2 className="text-2xl font-black font-mono text-white leading-tight">Módulo de {weekNum <= 2 ? 'Fundamentos' : weekNum <= 4 ? 'Intermediário' : 'Sprint Final'}</h2>
                    <div className="flex items-center gap-2 mt-3">
                       <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 w-1/3 rounded-full" />
                       </div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">3 de 12 dias</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-teal-500/20 shadow-inner">
                     <BookOpen className="w-8 h-8 text-teal-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative">
                {/* Decorative Mascot (Top) */}
                {weekIdx === 0 && (
                  <div className="absolute -top-10 -left-6 animate-bounce-slow">
                    <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 border-4 border-primary-600">
                      <Zap className="w-10 h-10 text-white fill-white" />
                    </div>
                  </div>
                )}

                {/* Decorative Chest (Top Right) */}
                {weekIdx === 0 && (
                  <div className="absolute top-0 right-[-2rem] animate-pulse">
                     <div className="w-14 h-14 bg-secondary-500 rounded-xl flex items-center justify-center shadow-lg border-4 border-secondary-600">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}

                {weekDays.map((day, dIdx) => {
                  const globalIdx = weekIdx * 7 + dIdx
                  const now = new Date()
                  const dayNum = now.getDate()
                  const monthNum = now.getMonth() + 1
                  const dayStr = String(dayNum).padStart(2, '0')
                  const monthStr = String(monthNum).padStart(2, '0')
                  const todayStr = `${dayStr}/${monthStr}`
                  
                  const isToday = day.date === todayStr
                  // Improved status logic — everything up to today is available unless completed
                  const status = globalIdx === 0 || isToday ? 'available' : globalIdx < 15 ? 'completed' : 'locked'

                  return (
                    <TrailNode 
                      key={day.date} 
                      day={day} 
                      index={globalIdx} 
                      status={status} 
                      progress={status === 'completed' ? 100 : 0}
                      onSelect={handleDayClick}
                    />
                  )
                })}

                {/* Decorative Mascot (Bottom) */}
                {weekIdx === 5 && (
                  <div className="absolute -bottom-10 -right-6 animate-pulse">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-green-600">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Day Detail Popover / Modal (when node selected) */}
      {selectedDay && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setSelectedDay(null)} />
          <div className="glass-panel w-full max-w-sm rounded-[2rem] p-6 relative animate-scale-in">
            <h3 className="text-xl font-bold font-mono text-white mb-2">{selectedDay.dayOfWeek}</h3>
            <p className="text-slate-400 text-sm mb-6 pb-4 border-b border-white/5">
              {selectedDay.date} · {selectedDay.hours}
            </p>
            
            <div className="space-y-3 mb-8">
              {questsForSelectedDay.map(q => {
                const Icon = QUEST_ICONS[q.type as keyof typeof QUEST_ICONS] || Star
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onSelectQuest(q)
                      setSelectedDay(null)
                    }}
                    className="w-full flex items-center justify-between p-4 bg-dark-800 hover:bg-dark-700 rounded-2xl border border-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-primary-300 transition-colors">{q.title}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[12rem]">{q.topic}</div>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-primary-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </button>
                )
              })}
            </div>

            <button 
              onClick={() => setSelectedDay(null)}
              className="btn-outline w-full rounded-xl h-12"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
