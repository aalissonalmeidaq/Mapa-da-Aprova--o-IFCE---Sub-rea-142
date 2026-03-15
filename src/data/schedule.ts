import type { Quest } from '../components/QuestMap'

export interface DaySchedule {
  date: string
  dayOfWeek: string
  hours: string
  specificTopics: string | null
  teachingTopics: string | null
  portugueseTopics: string | null
  reviewActivity: string | null
}

const SCHEDULE: DaySchedule[] = [
  { date: '16/03', dayOfWeek: 'Segunda-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Metodologia de desenvolvimento de algoritmos, tipos estruturados e comandos', teachingTopics: 'A Didática e a formação de professores', portugueseTopics: 'Compreensão de textos e gêneros textuais', reviewActivity: null },
  { date: '17/03', dayOfWeek: 'Terça-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Recursividade, estruturas sequenciais, condicionais e de repetição', teachingTopics: 'Constituição Federal de 1988 (arts. 37 ao 41)', portugueseTopics: 'Ortografia oficial e acentuação gráfica', reviewActivity: null },
  { date: '18/03', dayOfWeek: 'Quarta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Vetores, matrizes, análise de corretude e complexidade (tempo e espaço)', teachingTopics: 'A ação docente numa perspectiva crítica e planejamento', portugueseTopics: 'Resolução de questões AOCP (Compreensão e Ortografia)', reviewActivity: null },
  { date: '19/03', dayOfWeek: 'Quinta-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Paradigmas (divisão e conquista, guloso) e busca sequencial e binária', teachingTopics: 'Lei 8.112/90: Provimento, vacância, remoção e redistribuição', portugueseTopics: 'Coesão textual, conectores e referenciação', reviewActivity: null },
  { date: '20/03', dayOfWeek: 'Sexta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Algoritmos de ordenação (inserção, seleção, merge sort, quicksort)', teachingTopics: 'A avaliação no processo de ensino-aprendizagem', portugueseTopics: 'Emprego e correlação de tempos e modos verbais', reviewActivity: null },
  { date: '21/03', dayOfWeek: 'Sábado', hours: '4h', specificTopics: 'Estruturas básicas e ordenação', teachingTopics: 'Didática', portugueseTopics: null, reviewActivity: 'Revisão da Semana 1: Leitura de resumos e resolução de bateria de questões' },
  { date: '22/03', dayOfWeek: 'Domingo', hours: '4h', specificTopics: 'Conhecimentos Específicos (foco na correção)', teachingTopics: null, portugueseTopics: null, reviewActivity: 'Simulado Prático: 60 questões com controle de tempo e correção de erros' },
  { date: '23/03', dayOfWeek: 'Segunda-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Listas ordenadas e encadeadas, pilhas e filas', teachingTopics: 'A relação professor-aluno: abordagens e concepções', portugueseTopics: 'Estrutura morfossintática do período e pontuação', reviewActivity: null },
  { date: '24/03', dayOfWeek: 'Terça-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Árvores binárias, árvores de busca e balanceadas', teachingTopics: 'Lei 8.112/90: Direitos e vantagens', portugueseTopics: 'Concordância verbal e nominal', reviewActivity: null },
  { date: '25/03', dayOfWeek: 'Quarta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Árvores AVL e Rubro-Negra', teachingTopics: 'Novas tecnologias de informação e comunicação na educação', portugueseTopics: 'Resolução de questões AOCP (Sintaxe e Concordância)', reviewActivity: null },
  { date: '26/03', dayOfWeek: 'Quinta-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Tabelas hash, grafos e suas representações e complexidade', teachingTopics: 'Lei 8.112/90: Regime disciplinar (penalidades e processo)', portugueseTopics: 'Emprego do sinal indicativo de crase', reviewActivity: null },
  { date: '27/03', dayOfWeek: 'Sexta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Sistemas Operacionais (processos, comunicação, concorrência e sincronização)', teachingTopics: 'História, Princípios e Legislação da Educação Profissional (EPT)', portugueseTopics: 'Colocação dos pronomes átonos', reviewActivity: null },
  { date: '28/03', dayOfWeek: 'Sábado', hours: '4h', specificTopics: 'Árvores, Grafos e SO', teachingTopics: 'Lei 8.112/90', portugueseTopics: null, reviewActivity: 'Revisão da Semana 2: Leitura de resumos' },
  { date: '29/03', dayOfWeek: 'Domingo', hours: '4h', specificTopics: 'Estruturas de Dados Avançadas', teachingTopics: 'Legislação', portugueseTopics: 'Língua Portuguesa', reviewActivity: 'Simulado Prático abrangente' },
  { date: '30/03', dayOfWeek: 'Segunda-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'SO (Escalonamento, deadlocks, gerenciamento de E/S, memória, paginação)', teachingTopics: 'Indissociabilidade entre ensino, pesquisa e extensão na EPT', portugueseTopics: 'Reescritura de frases e substituição de palavras', reviewActivity: null },
  { date: '31/03', dayOfWeek: 'Terça-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Redes de computadores: Modelo OSI e arquitetura TCP/IP', teachingTopics: 'Lei 9.784/99: Processo Administrativo', portugueseTopics: 'Análise do discurso: pressupostos, subentendidos e implícitos', reviewActivity: null },
  { date: '01/04', dayOfWeek: 'Quarta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Sistemas de arquivos: FAT, NTFS, EXT, métodos de acesso e permissões', teachingTopics: 'Concepções de currículo e currículo integrado na EPT', portugueseTopics: 'Resolução de questões de interpretação e discurso', reviewActivity: null },
  { date: '02/04', dayOfWeek: 'Quinta-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Bancos de Dados: Modelagem, Modelo ER, Modelo Relacional, Normalização', teachingTopics: 'Decreto 1.171/94: Código de Ética Profissional', portugueseTopics: 'Bateria de exercícios gerais da banca AOCP', reviewActivity: null },
  { date: '03/04', dayOfWeek: 'Sexta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'SGBD: Transações, propriedades ACID, concorrência, logs e checkpoints', teachingTopics: 'Metodologias de ensino e a interdisciplinaridade na EPT', portugueseTopics: 'Bateria de exercícios gerais da banca AOCP', reviewActivity: null },
  { date: '04/04', dayOfWeek: 'Sábado', hours: '4h', specificTopics: 'Modelo Relacional, SGBD e Redes de Computadores', teachingTopics: null, portugueseTopics: null, reviewActivity: 'Revisão da Semana 3' },
  { date: '05/04', dayOfWeek: 'Domingo', hours: '4h', specificTopics: 'Sistemas Operacionais, Redes e Fundamentos de Banco de Dados', teachingTopics: null, portugueseTopics: null, reviewActivity: 'Simulado Prático' },
  { date: '06/04', dayOfWeek: 'Segunda-feira', hours: '2h (Específicos), 1h (Docência), 1h (Legislação)', specificTopics: 'LGPD (Lei 13.709/2018) e segurança da informação (ISO/IEC 27002)', teachingTopics: 'Princípios, diretrizes e objetivos da PNEPT; Lei 11.892/08', portugueseTopics: null, reviewActivity: null },
  { date: '07/04', dayOfWeek: 'Terça-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Eng. de Software: Manutenção, modelos (cascata, ágil, Scrum), métricas', teachingTopics: 'Lei 11.892/08 (Criação dos Institutos Federais)', portugueseTopics: 'Correção dos pontos fracos identificados nos simulados', reviewActivity: null },
  { date: '08/04', dayOfWeek: 'Quarta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Eng. de Software: Controle de versão (GIT), UML (diagramas)', teachingTopics: 'Revisão de tendências pedagógicas e planejamento', portugueseTopics: 'Resolução de prova completa de Língua Portuguesa', reviewActivity: null },
  { date: '09/04', dayOfWeek: 'Quinta-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Testes de software (caixa preta/branca, unitário, integração, sistema, regressão)', teachingTopics: 'Lei 12.772/12 (Carreira do Magistério EBTT)', portugueseTopics: 'Revisão de crase e pontuação', reviewActivity: null },
  { date: '10/04', dayOfWeek: 'Sexta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Legislação)', specificTopics: 'Paradigmas de linguagens, tipos, compiladores vs interpretadores', teachingTopics: 'Revisão sobre EPT; Revisão final de Legislação do Serviço Público', portugueseTopics: null, reviewActivity: null },
  { date: '11/04', dayOfWeek: 'Sábado', hours: '4h', specificTopics: 'Engenharia de Software e Testes', teachingTopics: 'Lei de Criação dos IFs', portugueseTopics: null, reviewActivity: 'Revisão da Semana 4' },
  { date: '12/04', dayOfWeek: 'Domingo', hours: '4h', specificTopics: 'Engenharia de Software', teachingTopics: 'Legislação do Magistério', portugueseTopics: null, reviewActivity: 'Simulado Prático (60 questões)' },
  { date: '13/04', dayOfWeek: 'Segunda-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Fundamentos web (HTML e CSS) e escopo dinâmico/estático', teachingTopics: 'Resolução de questões sobre Currículo e Interdisciplinaridade', portugueseTopics: 'Resolução de questões sobre coesão e análise do discurso', reviewActivity: null },
  { date: '14/04', dayOfWeek: 'Terça-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Banco de Dados: Álgebra e cálculo relacional', teachingTopics: 'Resolução de questões sobre a Lei 8.112/90 e Lei 9.784/99', portugueseTopics: 'Resolução de questões sobre tipologia textual e gêneros', reviewActivity: null },
  { date: '15/04', dayOfWeek: 'Quarta-feira', hours: '2h (Específicos), 1h (Docência), 1h (Português)', specificTopics: 'Linguagens de consulta (SQL: DDL, DML, DCL) e otimização/índices', teachingTopics: 'Resolução de questões gerais da AOCP para a Área de Educação', portugueseTopics: 'Revisão de sintaxe', reviewActivity: null },
  { date: '16/04', dayOfWeek: 'Quinta-feira', hours: '2h (Específicos), 1h (Legislação), 1h (Português)', specificTopics: 'Mineração de dados, Data Warehouse e conceitos de BI', teachingTopics: 'Resolução de questões sobre Ética e Carreira EBTT', portugueseTopics: 'Resolução de Prova Completa da AOCP', reviewActivity: null },
  { date: '17/04', dayOfWeek: 'Sexta-feira', hours: '2h (Específicos), 2h (Docência/Didática)', specificTopics: 'Revisão de Bancos de Dados Distribuídos e Segurança', teachingTopics: 'Rascunho de planos de aula (Prova Didática)', portugueseTopics: null, reviewActivity: null },
  { date: '18/04', dayOfWeek: 'Sábado', hours: '4h', specificTopics: 'SQL, BI e Modelagem de Dados', teachingTopics: null, portugueseTopics: null, reviewActivity: 'Revisão da Semana 5 (Foco total)' },
  { date: '19/04', dayOfWeek: 'Domingo', hours: '4h', specificTopics: 'Conteúdo Geral', teachingTopics: 'Conteúdo Geral', portugueseTopics: 'Conteúdo Geral', reviewActivity: 'Simulado Oficial (condições reais de prova)' },
  { date: '20/04', dayOfWeek: 'Segunda-feira', hours: '2h (Específicos), 2h (Legislação)', specificTopics: 'Algoritmos e Eng. de Software (Resolução de questões)', teachingTopics: 'Leitura Seca: Leis 11.892/08 e 12.772/12', portugueseTopics: null, reviewActivity: null },
  { date: '21/04', dayOfWeek: 'Terça-feira', hours: '2h (Específicos), 2h (Legislação)', specificTopics: 'Redes, SO e LGPD (Resolução de questões)', teachingTopics: 'Leitura Seca: Lei 8.112/90 e CF/88', portugueseTopics: null, reviewActivity: null },
  { date: '22/04', dayOfWeek: 'Quarta-feira', hours: '2h (Específicos), 2h (Português/Docência)', specificTopics: 'Banco de Dados e Paradigmas de Linguagem', teachingTopics: 'Questões de Didática', portugueseTopics: 'Questões de interpretação', reviewActivity: null },
  { date: '23/04', dayOfWeek: 'Quinta-feira', hours: '4h', specificTopics: 'Revisão de resumos próprios e temas para 2ª fase', teachingTopics: 'Planejamento didático mental', portugueseTopics: null, reviewActivity: 'Revisão Geral e Didática' },
  { date: '24/04', dayOfWeek: 'Sexta-feira', hours: '4h', specificTopics: 'Atalhos, fórmulas de complexidade e comandos SQL', teachingTopics: null, portugueseTopics: null, reviewActivity: 'Leitura Ativa Leve (flashcards e anotações)' },
  { date: '25/04', dayOfWeek: 'Sábado', hours: '0h', specificTopics: null, teachingTopics: null, portugueseTopics: null, reviewActivity: 'Descanso Pré-Prova e organização de materiais' },
  { date: '26/04', dayOfWeek: 'Domingo', hours: 'Dia da Prova', specificTopics: 'DIA DA PROVA OBJETIVA', teachingTopics: null, portugueseTopics: null, reviewActivity: 'DIA DA PROVA OBJETIVA' },
]

function parseDate(dateStr: string): Date {
  const [day, month] = dateStr.split('/').map(Number)
  return new Date(2026, month - 1, day)
}

function getWeekNumber(dateStr: string): number {
  const startDate = parseDate('16/03')
  const currentDate = parseDate(dateStr)
  const diffDays = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 7) + 1
}

export function getTodaySchedule(): DaySchedule | null {
  const today = new Date()
  const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`
  return SCHEDULE.find(s => s.date === todayStr) || null
}

export function getQuestsForDate(dateStr?: string): Quest[] {
  const targetDate = dateStr || (() => {
    const today = new Date()
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`
  })()

  const day = SCHEDULE.find(s => s.date === targetDate)
  if (!day) return []

  const quests: Quest[] = []
  const dayId = targetDate.replace('/', '-')

  if (day.specificTopics && day.specificTopics !== 'Nenhum' && day.specificTopics !== 'DIA DA PROVA OBJETIVA') {
    quests.push({
      id: `${dayId}-esp`,
      title: 'Conhecimentos Específicos',
      topic: day.specificTopics,
      type: 'Principal',
      status: 'available',
      duration: 120,
      xpReward: 200,
    })
  }

  if (day.teachingTopics && day.teachingTopics !== 'Not in source' && day.teachingTopics !== 'Nenhum') {
    const isLegislacao = day.teachingTopics.toLowerCase().includes('lei') ||
                         day.teachingTopics.toLowerCase().includes('constituição') ||
                         day.teachingTopics.toLowerCase().includes('decreto') ||
                         day.teachingTopics.toLowerCase().includes('legislação') ||
                         day.teachingTopics.toLowerCase().includes('leitura seca')
    quests.push({
      id: `${dayId}-doc`,
      title: isLegislacao ? 'Legislação' : 'Docência e Didática',
      topic: day.teachingTopics,
      type: isLegislacao ? 'Secundaria_Legis' : 'Secundaria_Didatica',
      status: quests.length === 0 ? 'available' : 'locked',
      duration: 60,
      xpReward: 150,
    })
  }

  if (day.portugueseTopics && day.portugueseTopics !== 'Not in source' && day.portugueseTopics !== 'Nenhum') {
    quests.push({
      id: `${dayId}-pt`,
      title: 'Língua Portuguesa',
      topic: day.portugueseTopics,
      type: 'Secundaria_PT',
      status: quests.length === 0 ? 'available' : 'locked',
      duration: 60,
      xpReward: 100,
    })
  }

  if (day.reviewActivity && day.reviewActivity !== 'Not in source') {
    quests.push({
      id: `${dayId}-rev`,
      title: 'Revisão & Simulado',
      topic: day.reviewActivity,
      type: 'Principal',
      status: quests.length === 0 ? 'available' : 'locked',
      duration: 240,
      xpReward: 300,
    })
  }

  return quests
}

export function getSchedule(): DaySchedule[] {
  return SCHEDULE
}

export function getCurrentWeek(): number {
  const today = new Date()
  const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`
  return getWeekNumber(todayStr)
}

export function getDaysUntilExam(): number {
  const examDate = parseDate('26/04')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
}
