import { useState } from 'react'
import { CheckCircle2, XCircle, ChevronRight, Info } from 'lucide-react'

export interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizProps {
  questions: Question[]
  onComplete: (score: number, passed: boolean) => void
}

export function QuizEngine({ questions, onComplete }: QuizProps) {
  const [currentIdx,     setCurrentIdx]     = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showAnswer,     setShowAnswer]     = useState(false)
  const [score,          setScore]          = useState(0)

  const question = questions[currentIdx]

  const handleConfirm = () => {
    if (selectedOption === null) return
    if (selectedOption === question.correctIndex) setScore(s => s + 1)
    setShowAnswer(true)
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
      setSelectedOption(null)
      setShowAnswer(false)
    } else {
      const finalScore = score / questions.length * 100
      onComplete(finalScore, finalScore >= 80)
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full glass-panel rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-12
                    animate-fade-in shadow-xl">

      {/* Quiz header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 md:mb-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
          <span className="text-slate-400 font-semibold uppercase tracking-widest
                           text-xs font-sans">
            Avaliação — Banca AOCP
          </span>
        </div>

        {/* Progress pills */}
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                i < currentIdx
                  ? 'w-4 bg-green-500'
                  : i === currentIdx
                  ? 'w-6 bg-primary-400'
                  : 'w-4 bg-dark-700',
              ].join(' ')}
            />
          ))}
          <span className="ml-1 text-xs text-slate-500 font-sans tabular-nums">
            {currentIdx + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-lg md:text-2xl font-bold text-white mb-6 md:mb-8 leading-snug font-mono">
        {question.text}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === idx
          const isCorrect  = idx === question.correctIndex

          let cls = 'border-white/8 bg-dark-800/50 hover:bg-dark-700/80 hover:border-white/15 text-slate-300 cursor-pointer'

          if (showAnswer) {
            if (isCorrect)            cls = 'border-green-500 bg-green-500/10 text-green-300 ring-1 ring-green-500/20 cursor-default'
            else if (isSelected)      cls = 'border-red-500/70 bg-red-500/10 text-red-400 opacity-70 cursor-default'
            else                      cls = 'border-white/4 bg-dark-900/30 opacity-30 text-slate-500 cursor-default'
          } else if (isSelected) {
            cls = 'border-primary-500 bg-primary-500/15 text-white ring-1 ring-primary-500/30 cursor-pointer'
          }

          return (
            <button
              key={idx}
              disabled={showAnswer}
              onClick={() => setSelectedOption(idx)}
              className={[
                'w-full text-left p-4 md:p-5 rounded-[1.25rem] border-2',
                'flex items-start gap-3 md:gap-4',
                'font-medium transition-all duration-200',
                'min-h-[3.5rem]',
                !showAnswer && isSelected ? 'scale-[1.01]' : '',
                cls,
              ].join(' ')}
            >
              <div className={[
                'shrink-0 w-9 h-9 rounded-full border-2',
                'flex items-center justify-center font-bold text-sm',
                showAnswer && isCorrect
                  ? 'border-green-500 bg-green-500 text-white'
                  : isSelected && !showAnswer
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-slate-600 bg-dark-900/50 text-slate-400',
              ].join(' ')}>
                {String.fromCharCode(65 + idx)}
              </div>

              <span className="leading-relaxed text-sm md:text-base font-sans flex-1">{opt}</span>

              {showAnswer && isCorrect  && <CheckCircle2 className="w-6 h-6 ml-auto text-green-400 shrink-0 mt-0.5" />}
              {showAnswer && isSelected && !isCorrect && <XCircle className="w-6 h-6 ml-auto text-red-400 shrink-0 mt-0.5" />}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showAnswer && (
        <div className="mb-8 p-5 bg-dark-950 rounded-2xl border border-white/5
                        flex gap-4 animate-slide-up relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-2xl" />
          <Info className="w-6 h-6 text-primary-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-primary-300 mb-1.5 text-xs uppercase
                           tracking-widest font-sans">
              Gabarito Comentado (IA)
            </h4>
            <p className="text-slate-300 leading-relaxed text-base font-sans">
              {question.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Action row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-white/10">
        {/* Score tracker */}
        <span className="text-sm text-slate-500 font-sans">
          {score} acerto{score !== 1 ? 's' : ''} até agora
        </span>

        {!showAnswer ? (
          <button
            disabled={selectedOption === null}
            onClick={handleConfirm}
            className={[
              'h-12 px-8 font-bold rounded-xl transition-all duration-200 font-sans',
              selectedOption === null
                ? 'bg-dark-700 text-slate-500 cursor-not-allowed'
                : 'btn-primary cursor-pointer',
            ].join(' ')}
          >
            Confirmar Resposta
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-secondary h-12 px-8 rounded-xl group flex items-center gap-2 cursor-pointer"
          >
            {currentIdx < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Sessão'}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        )}
      </div>
    </div>
  )
}
