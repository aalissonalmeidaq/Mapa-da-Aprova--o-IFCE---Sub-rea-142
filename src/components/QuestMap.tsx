import { Lock, Play, CheckCircle2, Star, BookOpen, Scale, ScrollText, Clock } from 'lucide-react'

export interface Quest {
  id: string
  title: string
  topic: string
  type: string
  status: 'locked' | 'available' | 'completed'
  duration: number
  xpReward: number
}

const QUEST_ICONS = {
  'Principal':           BookOpen,
  'Secundaria_PT':       ScrollText,
  'Secundaria_Didatica': Star,
  'Secundaria_Legis':    Scale,
}

const TYPE_LABELS: Record<string, string> = {
  'Principal':           'Missão Principal',
  'Secundaria_PT':       'Português',
  'Secundaria_Didatica': 'Didática',
  'Secundaria_Legis':    'Legislação',
}

interface QuestMapProps {
  quests: Quest[]
  onSelectQuest: (q: Quest) => void
}

export function QuestMap({ quests, onSelectQuest }: QuestMapProps) {
  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="relative">
        {/* Connector line — desktop only */}
        <div className="absolute top-[4.5rem] left-[10%] right-[10%] h-0.5
                        bg-gradient-to-r from-transparent via-dark-700 to-transparent
                        hidden lg:block z-0 pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-5 md:gap-6 relative z-10">
          {quests.map((quest, idx) => {
            const Icon     = QUEST_ICONS[quest.type as keyof typeof QUEST_ICONS] || Star
            const label    = TYPE_LABELS[quest.type] || quest.type.replace('_', ' ')
            const isAvail  = quest.status === 'available'
            const isDone   = quest.status === 'completed'
            const isLocked = quest.status === 'locked'

            return (
              <div
                key={quest.id}
                role={isAvail ? 'button' : undefined}
                tabIndex={isAvail ? 0 : undefined}
                onClick={() => isAvail && onSelectQuest(quest)}
                onKeyDown={(e) => e.key === 'Enter' && isAvail && onSelectQuest(quest)}
                aria-disabled={!isAvail}
                className={[
                  'relative flex-1 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8',
                  'transition-all duration-300',
                  'active:scale-[0.98] active:transition-transform',
                  isAvail
                    ? 'glass-panel cursor-pointer hover:-translate-y-2 hover:shadow-primary-glow ring-1 ring-primary-500/40'
                    : isDone
                    ? 'bg-dark-800/80 border border-green-500/20 shadow-lg'
                    : 'bg-dark-900/50 border border-white/4 opacity-60 grayscale cursor-default',
                ].join(' ')}
              >
                {/* Mobile connector */}
                {idx < quests.length - 1 && (
                  <div className="absolute bottom-[-1.5rem] left-1/2 w-0.5 h-6
                                  bg-dark-700 -translate-x-1/2 lg:hidden" />
                )}

                {/* Header row */}
                <div className="flex justify-between items-start mb-5">
                  <div className={[
                    'p-3 rounded-2xl',
                    isAvail
                      ? 'bg-primary-500/15 text-primary-400 ring-1 ring-primary-500/30'
                      : isDone
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-dark-700 text-slate-600',
                  ].join(' ')}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="flex items-center gap-1.5 bg-dark-950/60 px-3 py-1.5
                                  rounded-full border border-white/5">
                    {isDone   && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                    {isLocked && <Lock         className="w-5 h-5 text-slate-600" />}
                    {isAvail  && <Play         className="w-5 h-5 text-primary-400 animate-pulse" />}
                    <span className={[
                      'text-xs font-bold',
                      isDone   ? 'text-green-400' :
                      isAvail  ? 'text-primary-400' :
                      'text-slate-600',
                    ].join(' ')}>
                      {isDone ? 'Concluída' : isAvail ? 'Disponível' : 'Bloqueada'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2.5">
                  <span className={[
                    'text-[11px] font-black uppercase tracking-widest font-sans',
                    isLocked ? 'text-dark-600' : 'text-slate-500',
                  ].join(' ')}>
                    {label}
                  </span>
                  <h3 className={[
                    'text-lg md:text-xl font-bold leading-snug font-mono',
                    isLocked ? 'text-slate-600' : 'text-white',
                  ].join(' ')}>
                    {quest.title}
                  </h3>
                  <p className={[
                    'text-sm md:text-sm font-sans line-clamp-2 leading-relaxed',
                    isLocked ? 'text-slate-700' : 'text-slate-400',
                  ].join(' ')}>
                    {quest.topic}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-7 pt-5 border-t border-white/5
                                flex items-center justify-between">
                  <span className={[
                    'flex items-center gap-1.5 text-sm font-medium font-sans',
                    isLocked ? 'text-slate-700' : 'text-slate-400',
                  ].join(' ')}>
                    <Clock className="w-4 h-4" />
                    {quest.duration}min
                  </span>

                  <span className={[
                    'badge text-xs',
                    isLocked
                      ? 'bg-dark-700 text-slate-700'
                      : isDone
                      ? 'bg-green-900/30 text-green-400 ring-1 ring-green-500/20'
                      : 'bg-primary-500/15 text-primary-300 ring-1 ring-primary-500/25',
                  ].join(' ')}>
                    +{quest.xpReward} XP
                  </span>
                </div>

                {/* Available glow accent */}
                {isAvail && (
                  <div className="absolute inset-0 rounded-[2rem] pointer-events-none
                                  ring-1 ring-primary-400/20 animate-pulse-slow" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
