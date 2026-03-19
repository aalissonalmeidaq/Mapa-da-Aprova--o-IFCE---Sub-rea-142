export interface PromptEntry {
  topic: string
  prompt: string
  type: 'Principal' | 'Secundaria_Didatica' | 'Secundaria_Legis' | 'Secundaria_PT'
}

export const PRD_PROMPTS: Record<string, PromptEntry[]> = {
  // ═══════════════════════════════════════════════════════════════
  // SEMANA 1: Algoritmos e Fundamentos (16/03 – 22/03)
  // ═══════════════════════════════════════════════════════════════
  '16/03': [
    {
      topic: 'Metodologia de desenvolvimento de algoritmos e tipos de dados',
      type: 'Principal',
      prompt: 'Aja como um Professor Doutor em Ciência da Computação. Crie um material didático para concursos sobre: **Metodologia de desenvolvimento de algoritmos e tipos de dados básicos e estruturados**. Estruture: 1. Introdução. 2. Aprofundamento Técnico. 3. Código. 4. Pegadinhas. 5. Exercício de fixação: 3 questões de múltipla escolha com gabarito.'
    },
    {
      topic: 'Comandos de linguagem; estruturas sequenciais, condicionais e repetição',
      type: 'Principal',
      prompt: 'Aja como um Professor Doutor em Ciência da Computação. Crie um material didático sobre: **Comandos de linguagem de programação; estruturas sequenciais, condicionais e de repetição**. Inclua teoria, código, pegadinhas de prova e 3 questões de fixação com gabarito.'
    },
    {
      topic: 'A Didática e a formação de professores',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como um Doutor em Educação. Guia didático sobre: **A Didática e a formação de professores: abordagens conceituais, metodológicas e tendências pedagógicas**. Inclua contexto, resumo prático e 3 questões de fixação.'
    },
    {
      topic: 'Compreensão e interpretação de textos',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Língua Portuguesa para concursos. Aula sobre: **Compreensão e interpretação de textos de gêneros variados; reconhecimento de tipos e gêneros textuais**. Inclua regras, exemplos aplicados e 3 questões de fixação.'
    }
  ],
  '17/03': [
    {
      topic: 'Recursividade, vetores, matrizes e análise de corretude',
      type: 'Principal',
      prompt: 'Aja como um Professor Doutor em Computação. Material didático sobre: **Recursividade, vetores, matrizes e análise de corretude**. Inclua teoria, código, foco em concursos e 3 questões de fixação.'
    },
    {
      topic: 'Complexidade de tempo e espaço; paradigmas básicos',
      type: 'Principal',
      prompt: 'Aja como um Professor Doutor em Computação. Material didático sobre: **Complexidade de tempo e espaço; paradigmas básicos (divisão e conquista, guloso)**. Inclua análise Big O e 3 questões de fixação.'
    },
    {
      topic: 'Constituição Federal de 1988: Administração Pública (arts. 37 ao 41)',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia didático sobre: **Constituição Federal de 1988: Administração Pública (arts. 37 ao 41)**. Destaque regras e inclua 3 questões de fixação.'
    },
    {
      topic: 'Domínio da ortografia oficial e acentuação gráfica',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Língua Portuguesa. Aula sobre: **Domínio da ortografia oficial e emprego da acentuação gráfica**. Inclua exceções cobradas e 3 questões de fixação.'
    }
  ],
  '18/03': [
    {
      topic: 'Algoritmos de ordenação: inserção e seleção',
      type: 'Principal',
      prompt: 'Aja como Professor Doutor em Computação. Material sobre: **Algoritmos de ordenação: inserção e seleção**. Inclua complexidade e 3 questões de fixação.'
    },
    {
      topic: 'Algoritmos de ordenação: merge sort e quicksort; busca binária',
      type: 'Principal',
      prompt: 'Aja como Professor Doutor em Computação. Material sobre: **Algoritmos de ordenação: merge sort e quicksort; busca sequencial e binária**. Inclua pior/melhor caso e 3 questões de fixação.'
    },
    {
      topic: 'A ação docente numa perspectiva crítica: planejamento',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **A ação docente numa perspectiva crítica: planejamento e novas metodologias de ensino**. Inclua conceitos-chave e 3 questões de fixação.'
    },
    {
      topic: 'Domínio dos mecanismos de coesão textual',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Domínio dos mecanismos de coesão textual (referenciação, substituição, conectores)**. Inclua exemplos práticos e 3 questões de fixação.'
    }
  ],
  '19/03': [
    {
      topic: 'Listas ordenadas e listas encadeadas',
      type: 'Principal',
      prompt: 'Aja como Professor Doutor em Computação. Material sobre: **Listas ordenadas e listas encadeadas**. Inclua teoria de ponteiros e 3 questões de fixação.'
    },
    {
      topic: 'Pilhas e filas',
      type: 'Principal',
      prompt: 'Aja como Professor Doutor em Computação. Material sobre: **Pilhas e filas**. Inclua LIFO/FIFO e 3 questões de fixação.'
    },
    {
      topic: 'Lei nº 8.112/90: Provimento e vacância',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia sobre: **Lei nº 8.112/90: Provimento e vacância**. Inclua tabelas comparativas e 3 questões de fixação.'
    },
    {
      topic: 'Emprego e correlação de tempos e modos verbais',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Emprego e correlação de tempos e modos verbais**. Inclua regras de paralelismo e 3 questões de fixação.'
    }
  ],
  '20/03': [
    {
      topic: 'Árvores e suas generalizações; árvores binárias',
      type: 'Principal',
      prompt: 'Aja como Professor Doutor em Computação. Material sobre: **Árvores e suas generalizações; árvores binárias e árvores de busca**. Inclua travessias e 3 questões de fixação.'
    },
    {
      topic: 'Métodos de inserção, remoção e busca em árvores',
      type: 'Principal',
      prompt: 'Aja como Professor Doutor em Computação. Material sobre: **Métodos de inserção, remoção e busca em árvores**. Inclua os algoritmos práticos e 3 questões de fixação.'
    },
    {
      topic: 'A avaliação no processo de ensino-aprendizagem',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **A avaliação no processo de ensino-aprendizagem**. Diferencie formativa/somativa e crie 3 questões de fixação.'
    },
    {
      topic: 'Estrutura morfossintática do período; coordenação',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Estrutura morfossintática do período; coordenação e subordinação**. Inclua conjunções e 3 questões de fixação.'
    }
  ],
  // Fim de Semana 1
  '21/03': [
    {
      topic: 'Simulado Semana 1: Algoritmos, Didática, CF/88, Lei 8.112 e Português',
      type: 'Principal',
      prompt: 'Aja como banca examinadora. Gere um Simulado Prático (60 questões) controlando os temas da semana: **Algoritmos, Didática, CF/88, Lei 8.112 e Português**. Forneça o gabarito detalhado.'
    }
  ],
  '22/03': [
    {
      topic: 'Simulado Semana 1: Algoritmos, Didática, CF/88, Lei 8.112 e Português',
      type: 'Principal',
      prompt: 'Aja como banca examinadora. Gere um Simulado Prático (60 questões) controlando os temas da semana: **Algoritmos, Didática, CF/88, Lei 8.112 e Português**. Forneça o gabarito detalhado.'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // SEMANA 2: Estruturas Avançadas, Redes e SO (23/03 – 29/03)
  // ═══════════════════════════════════════════════════════════════
  '23/03': [
    {
      topic: 'Árvores balanceadas: árvores AVL e Rubro-Negra',
      type: 'Principal',
      prompt: 'Aja como Professor Doutor em Computação. Resumo sobre: **Árvores balanceadas: árvores AVL e Rubro-Negra (noções)**. Inclua balanceamento e 3 questões de fixação.'
    },
    {
      topic: 'Tabelas hash; grafos e suas representações',
      type: 'Principal',
      prompt: 'Aja como Professor Doutor em Computação. Resumo sobre: **Tabelas hash; grafos e suas representações; complexidade das operações**. Inclua colisões e 3 questões de fixação.'
    },
    {
      topic: 'A relação professor-aluno: abordagens e concepções',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **A relação professor-aluno: abordagens e concepções**. Inclua teóricos e 3 questões de fixação.'
    },
    {
      topic: 'Emprego dos sinais de pontuação',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Emprego dos sinais de pontuação**. Inclua regras de vírgula e 3 questões de fixação.'
    }
  ],
  '24/03': [
    {
      topic: 'SO: Gerência de processos e escalonamento',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Infraestrutura. Resumo sobre: **SO: Conceito de processo, gerência de processos/processador, estados e algoritmos de escalonamento**. Inclua FIFO, Round Robin e 3 questões de fixação.'
    },
    {
      topic: 'SO: Comunicação, concorrência e sincronização',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Infraestrutura. Resumo sobre: **SO: Comunicação, concorrência, sincronização, exclusão mútua e semáforos**. Inclua condições de corrida e 3 questões de fixação.'
    },
    {
      topic: 'Lei nº 8.112/90: Direitos e vantagens',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia sobre: **Lei nº 8.112/90: Direitos e vantagens**. Inclua licenças e 3 questões de fixação.'
    },
    {
      topic: 'Concordância verbal e nominal',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Concordância verbal e nominal**. Destaque casos clássicos e 3 questões de fixação.'
    }
  ],
  '25/03': [
    {
      topic: 'SO: E/S, deadlocks e threads',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Infraestrutura. Resumo sobre: **SO: Gerenciamento de dispositivos de E/S, deadlocks e threads**. Inclua teoria de deadlocks e 3 questões de fixação.'
    },
    {
      topic: 'SO: Gerenciamento de memória e paginação',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Infraestrutura. Resumo sobre: **SO: Gerenciamento de memória, memória virtual, paginação e segmentação**. Inclua paginação e 3 questões de fixação.'
    },
    {
      topic: 'Novas tecnologias de informação na educação',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **Novas tecnologias de informação e comunicação na educação**. Inclua metodologias ativas e 3 questões de fixação.'
    },
    {
      topic: 'Emprego do sinal indicativo de crase',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Emprego do sinal indicativo de crase**. Inclua casos proibidos/facultativos e 3 questões de fixação.'
    }
  ],
  '26/03': [
    {
      topic: 'Redes de computadores: Modelo OSI e TCP/IP',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Redes. Resumo sobre: **Redes de computadores: fundamentos, modelo OSI e arquitetura TCP/IP**. Compare as camadas e crie 3 questões de fixação.'
    },
    {
      topic: 'Organização e operação de arquivos; indexação',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Infraestrutura. Resumo sobre: **Organização e operação de arquivos; métodos de acesso, indexação**. Inclua métodos de indexação e 3 questões de fixação.'
    },
    {
      topic: 'Lei nº 8.112/90: Regime disciplinar',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia sobre: **Lei nº 8.112/90: Regime disciplinar (penalidades e processos)**. Inclua prescrições e 3 questões de fixação.'
    },
    {
      topic: 'Colocação dos pronomes átonos',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Colocação dos pronomes átonos**. Inclua atrativos de próclise e 3 questões de fixação.'
    }
  ],
  '27/03': [
    {
      topic: 'Sistemas de arquivos: diretórios e arquivos virtuais',
      type: 'Principal',
      prompt: 'Aja como um Engenheiro de Infraestrutura. Resumo sobre: **Sistemas de arquivos: diretórios, arquivos do sistema e virtuais**. Inclua teoria e 3 questões de fixação.'
    },
    {
      topic: 'Sistemas FAT, NTFS, EXT e permissões',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Infraestrutura. Resumo sobre: **Sistemas FAT, NTFS, EXT (noções) e permissões de arquivos**. Compare sistemas e crie 3 questões de fixação.'
    },
    {
      topic: 'História, princípios e legislação da EPT',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **História, princípios, legislação e funcionamento da EPT**. Crie 3 questões de fixação.'
    },
    {
      topic: 'Reescritura de frases e parágrafos',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Reescritura de frases e parágrafos do texto; substituição de palavras**. Foco em sentido e 3 questões de fixação.'
    }
  ],
  // Fim de Semana 2
  '28/03': [
    {
      topic: 'Simulado Semana 2: Estruturas Avançadas, SO, Redes e Lei 8.112/90',
      type: 'Principal',
      prompt: 'Aja como banca examinadora. Gere um Simulado Prático focando em **Estruturas de Dados Avançadas, Sistemas Operacionais, Redes e Legislação 8.112/90**. Forneça gabarito.'
    }
  ],
  '29/03': [
    {
      topic: 'Simulado Semana 2: Estruturas Avançadas, SO, Redes e Lei 8.112/90',
      type: 'Principal',
      prompt: 'Aja como banca examinadora. Gere um Simulado Prático focando em **Estruturas de Dados Avançadas, Sistemas Operacionais, Redes e Legislação 8.112/90**. Forneça gabarito.'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // SEMANA 3: Banco de Dados e Leis Federais (30/03 – 05/04)
  // ═══════════════════════════════════════════════════════════════
  '30/03': [
    {
      topic: 'BD: Modelo de dados, projeto e normalização',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Banco de Dados: modelo de dados, modelagem, projeto e normalização**. Foco nas formas normais (1FN a 3FN) e 3 questões de fixação.'
    },
    {
      topic: 'BD: Modelo ER e Modelo Relacional',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Banco de Dados: modelo entidade-relacionamento e modelo relacional**. Inclua entidades, relacionamentos e 3 questões de fixação.'
    },
    {
      topic: 'Indissociabilidade entre ensino, pesquisa e extensão na EPT',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **Indissociabilidade entre ensino, pesquisa e extensão na EPT**. Teoria e 3 questões de fixação.'
    },
    {
      topic: 'Análise do discurso: pressupostos e implícitos',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula sobre: **Análise do discurso: pressupostos, subentendidos e implícitos**. Dicas e 3 questões de fixação.'
    }
  ],
  '31/03': [
    {
      topic: 'BD: Chaves, integridade e dependências funcionais',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Banco de Dados: chaves primárias/estrangeiras, integridade referencial e dependências funcionais**. Prática e 3 questões de fixação.'
    },
    {
      topic: 'SGBD: Arquitetura, segurança e integridade',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **SGBD: arquitetura, segurança, integridade, concorrência e recuperação após falha**. Arquitetura e 3 questões de fixação.'
    },
    {
      topic: 'Lei nº 9.784/99: Processo Administrativo',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia sobre: **Lei nº 9.784/99: Processo Administrativo**. Direitos, recursos e 3 questões de fixação.'
    },
    {
      topic: 'Bateria: Interpretação de Textos',
      type: 'Secundaria_PT',
      prompt: 'Aja como examinador. Gere bateria de 10 questões inéditas focadas em **Interpretação de Textos em concursos**. Forneça gabarito comentado.'
    }
  ],
  '01/04': [
    {
      topic: 'Transações: Propriedades ACID',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Gerenciamento de transações: propriedades ACID e controle de concorrência**. Detalhe ACID e 3 questões de fixação.'
    },
    {
      topic: 'Isolamento, logs e checkpoints',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Níveis de isolamento, logs, checkpoints**. Detalhe anomalias e 3 questões de fixação.'
    },
    {
      topic: 'Concepções de currículo na EPT',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **Concepções de currículo e currículo integrado na EPT**. Resumo e 3 questões de fixação.'
    },
    {
      topic: 'Bateria: Gramática Geral Aplicada',
      type: 'Secundaria_PT',
      prompt: 'Aja como examinador. Gere bateria de 10 questões inéditas de **Gramática Geral Aplicada a Textos**. Forneça gabarito.'
    }
  ],
  '02/04': [
    {
      topic: 'Segurança em BD (ISO/IEC 27002)',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Segurança da informação em BD; controles conforme ISO/IEC 27002**. Pilares de segurança e 3 questões de fixação.'
    },
    {
      topic: 'Fundamentos da LGPD (Lei 13.709/2018)',
      type: 'Principal',
      prompt: 'Aja como Especialista em Segurança. Material sobre: **Fundamentos da Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)**. Princípios, bases e 3 questões de fixação.'
    },
    {
      topic: 'Decreto nº 1.171/94: Ética no Serviço Público',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia sobre: **Decreto nº 1.171/94: Código de Ética Profissional do Servidor Público**. Regras, vedações e 3 questões de fixação.'
    },
    {
      topic: 'Bateria: Sintaxe e Pontuação',
      type: 'Secundaria_PT',
      prompt: 'Aja como examinador. Gere bateria de 10 questões inéditas de **Sintaxe e Pontuação**. Forneça gabarito.'
    }
  ],
  '03/04': [
    {
      topic: 'UML: Diagramas Estruturais',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Material sobre: **Modelagem de sistemas com UML: diagramas estruturais**. Detalhe classes/objetos e 3 questões de fixação.'
    },
    {
      topic: 'UML: Diagramas Comportamentais',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Material sobre: **Modelagem de sistemas com UML: diagramas comportamentais**. Detalhe casos de uso e 3 questões de fixação.'
    },
    {
      topic: 'Metodologias de ensino e interdisciplinaridade na EPT',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **Metodologias de ensino e a interdisciplinaridade na EPT**. Práticas e 3 questões de fixação.'
    }
    // Hora 4: Sem prompt de geração (Correção manual de falhas dos simulados)
  ],
  // Fim de Semana 3
  '04/04': [
    {
      topic: 'Simulado Semana 3: Modelo Relacional, SGBD, Redes, Leis 9.784/LGPD/Ética',
      type: 'Principal',
      prompt: 'Aja como banca examinadora. Gere Simulado Prático sobre **Modelo Relacional, SGBD, Redes, Leis 9.784/LGPD/Ética**. Forneça gabarito.'
    }
  ],
  '05/04': [
    {
      topic: 'Simulado Semana 3: Modelo Relacional, SGBD, Redes, Leis 9.784/LGPD/Ética',
      type: 'Principal',
      prompt: 'Aja como banca examinadora. Gere Simulado Prático sobre **Modelo Relacional, SGBD, Redes, Leis 9.784/LGPD/Ética**. Forneça gabarito.'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // SEMANA 4: Engenharia de Software e Testes (06/04 – 12/04)
  // ═══════════════════════════════════════════════════════════════
  '06/04': [
    {
      topic: 'Eng. de Software: Manutenção e padrões',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Eng. de Software: manutenção, documentação, padrões de desenvolvimento**. Mapeie tipos de manutenção e 3 questões de fixação.'
    },
    {
      topic: 'Eng. de Software: Reuso e Reengenharia',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Eng. de Software: reuso, engenharia reversa e reengenharia**. Diferenças e 3 questões de fixação.'
    },
    {
      topic: 'PNEPT: Princípios e diretrizes',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia sobre: **Princípios, diretrizes e objetivos da PNEPT**. Destaques legais e 3 questões de fixação.'
    },
    {
      topic: 'Lei nº 11.892/08: Criação do IFCE',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia sobre: **Lei nº 11.892/08: Criação dos Institutos Federais (IFCE)**. Finalidades e 3 questões de fixação.'
    }
  ],
  '07/04': [
    {
      topic: 'Modelos de processo: Cascata e Incremental',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Ambientes de desenvolvimento; modelos de processo (cascata, incremental)**. Fases e 3 questões de fixação.'
    },
    {
      topic: 'Processo Ágil e Scrum',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Modelos de processo ágil e Scrum**. Papéis/artefatos e 3 questões de fixação.'
    },
    {
      topic: 'Lei nº 11.892/08: Estrutura e Administração',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia sobre: **Lei nº 11.892/08: Continuação (Estrutura e Finalidades)**. Administração geral e 3 questões de fixação.'
    },
    {
      topic: 'Bateria: Crase e Regência',
      type: 'Secundaria_PT',
      prompt: 'Aja como examinador. Gere bateria de 10 questões inéditas focadas em **Crase e Regência Nominal/Verbal**. Forneça gabarito.'
    }
  ],
  '08/04': [
    {
      topic: 'Métricas de Software e Pontos de Função',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Métricas de software**. Destaque Pontos de Função e 3 questões de fixação.'
    },
    {
      topic: 'Controle de versão (GIT)',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Controle de versão (GIT)**. Comandos principais e 3 questões de fixação.'
    },
    {
      topic: 'Tendências pedagógicas e planejamento (resumo)',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Resumo sobre: **Revisão: Tendências pedagógicas e planejamento (resumo)**. Liberais x Progressistas e 3 questões de fixação.'
    },
    {
      topic: 'Prova Completa: Língua Portuguesa',
      type: 'Secundaria_PT',
      prompt: 'Aja como banca examinadora. Crie uma **Prova Completa de Língua Portuguesa** (10 questões de texto e gramática). Forneça gabarito.'
    }
  ],
  '09/04': [
    {
      topic: 'Testes de software: Verificação e Validação',
      type: 'Principal',
      prompt: 'Aja como QA Sênior. Aula sobre: **Testes de software: verificação, validação, casos e cobertura de teste**. Diferenças e 3 questões de fixação.'
    },
    {
      topic: 'Tipos de teste e Modelo V',
      type: 'Principal',
      prompt: 'Aja como QA Sênior. Aula sobre: **Tipos de teste: unitário, integração, sistema e aceitação**. Fases (Modelo V) e 3 questões de fixação.'
    },
    {
      topic: 'Lei nº 12.772/12: Carreira do Magistério',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Guia sobre: **Lei nº 12.772/12: Plano de Carreiras do Magistério Federal**. RSC, progressão e 3 questões de fixação.'
    },
    {
      topic: 'Prova Completa: Interpretação de Textos',
      type: 'Secundaria_PT',
      prompt: 'Aja como banca examinadora. Crie **Prova Completa de Português focada em interpretação de textos**. Forneça gabarito.'
    }
  ],
  '10/04': [
    {
      topic: 'Testes de caixa preta e branca',
      type: 'Principal',
      prompt: 'Aja como QA Sênior. Aula sobre: **Testes de caixa preta e caixa branca**. Particionamento, grafo de fluxo e 3 questões de fixação.'
    },
    {
      topic: 'Testes automatizados e de regressão',
      type: 'Principal',
      prompt: 'Aja como QA Sênior. Aula sobre: **Testes automatizados e teste de regressão**. Conceitos e 3 questões de fixação.'
    },
    {
      topic: 'Revisão final: Legislação da Educação Profissional',
      type: 'Secundaria_Legis',
      prompt: 'Aja como Especialista Jurídico. Resumo de: **Revisão de Legislação da Educação Profissional**. Principais marcos e 3 questões de fixação.'
    },
    {
      topic: 'Bateria: Lei 8.112/90',
      type: 'Secundaria_PT',
      prompt: 'Aja como examinador. Gere bateria de 10 questões de fixação sobre a **Lei 8.112/90 (Exercício de fixação)**. Forneça gabarito.'
    }
  ],
  // Fim de Semana 4
  '11/04': [
    {
      topic: 'Simulado Semana 4: Engenharia de Software, Testes e Leis de Magistério',
      type: 'Principal',
      prompt: 'Aja como banca examinadora. Gere Simulado Prático sobre **Engenharia de Software, Testes e Leis de Magistério**. Forneça gabarito comentado.'
    }
  ],
  '12/04': [
    {
      topic: 'Simulado Semana 4: Engenharia de Software, Testes e Leis de Magistério',
      type: 'Principal',
      prompt: 'Aja como banca examinadora. Gere Simulado Prático sobre **Engenharia de Software, Testes e Leis de Magistério**. Forneça gabarito comentado.'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // SEMANA 5: Linguagens, Web, SQL e BI (13/04 – 19/04)
  // ═══════════════════════════════════════════════════════════════
  '13/04': [
    {
      topic: 'Linguagens: Paradigmas e semântica formal',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Linguagens: Paradigmas, semântica formal, sistemas e inferência de tipos**. Procedural, OO, Lógico e 3 questões de fixação.'
    },
    {
      topic: 'Polimorfismo e interpretação de tipos',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Polimorfismo, compiladores x interpretadores, escopo estático e dinâmico**. Diferenças e 3 questões de fixação.'
    },
    {
      topic: 'Revisão sobre Currículo Integrado',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como Doutor em Educação. Guia: **Revisão sobre Currículo Integrado**. Conceitos e 3 questões de fixação.'
    },
    {
      topic: 'Revisão: Reescritura e Análise do Discurso',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula de: **Revisão de reescritura de frases e análise do discurso**. Exercícios sem alterar sentido e 3 questões de fixação.'
    }
  ],
  '14/04': [
    {
      topic: 'Passagem de parâmetros e exceções',
      type: 'Principal',
      prompt: 'Aja como Doutor em Computação. Material sobre: **Passagem de parâmetros, recursão e tratamento de exceções**. Valor x referência e 3 questões de fixação.'
    },
    {
      topic: 'Fundamentos Web: HTML e CSS',
      type: 'Principal',
      prompt: 'Aja como Engenheiro de Software. Aula sobre: **Fundamentos de desenvolvimento web: HTML e CSS (noções)**. Tags, seletores e 3 questões de fixação.'
    },
    {
      topic: 'Bateria: Leis 9.784/99 e 12.772/12',
      type: 'Secundaria_Legis',
      prompt: 'Aja como examinador. Gere bateria de 10 questões sobre as **Leis 9.784/99 e 12.772/12**. Forneça gabarito.'
    },
    {
      topic: 'Bateria: Coesão e conectores',
      type: 'Secundaria_PT',
      prompt: 'Aja como examinador. Gere bateria de 10 questões sobre **Coesão e conectores**. Forneça gabarito.'
    }
  ],
  '15/04': [
    {
      topic: 'Álgebra e cálculo relacional',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Álgebra e cálculo relacional; operadores da álgebra relacional**. Operações e 3 questões de fixação.'
    },
    {
      topic: 'Linguagens de consulta SQL (DDL, DML, DCL)',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Linguagens de consulta SQL (DDL, DML, DCL)**. Comandos e 3 questões de fixação.'
    },
    {
      topic: 'Questões gerais: Área de Educação',
      type: 'Secundaria_Didatica',
      prompt: 'Aja como examinador. Gere bateria de 10 questões de **Resolução de questões gerais de Educação**. Forneça gabarito.'
    },
    {
      topic: 'Revisão: Morfossintaxe',
      type: 'Secundaria_PT',
      prompt: 'Aja como Professor de Português. Aula rápida de: **Revisão de Morfossintaxe**. Termos e 3 questões de fixação.'
    }
  ],
  '16/04': [
    {
      topic: 'Otimização de consultas e índices',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Otimização de consultas; bancos de dados distribuídos e índices**. Fragmentação e 3 questões de fixação.'
    },
    {
      topic: 'Mineração de dados, Data Warehouse e BI',
      type: 'Principal',
      prompt: 'Aja como Arquiteto de Dados. Material sobre: **Mineração de dados, data warehouse e conceitos básicos de BI**. ETL, OLAP e 3 questões de fixação.'
    },
    {
      topic: 'Questões: Ética e Carreira EBTT',
      type: 'Secundaria_Legis',
      prompt: 'Aja como examinador. Gere bateria de 10 questões sobre **Resolução de questões sobre Ética e Carreira EBTT**. Forneça gabarito.'
    },
    {
      topic: 'Última Prova Completa: Português',
      type: 'Secundaria_PT',
      prompt: 'Aja como banca examinadora. Crie a **Última Prova Completa de Português** (10 questões de texto/gramática).'
    }
  ],
  '17/04': [
    {
      topic: 'Revisão Geral: SQL e Algoritmos',
      type: 'Principal',
      prompt: 'Aja como examinador. Crie bateria de **Revisão Geral - Resolução de questões SQL e Algoritmos** (15 questões avançadas). Forneça gabarito.'
    }
    // Horas 3 e 4: Sem prompt de geração (Seleção manual de tópicos para prova didática)
  ],
  // Fim de Semana 5
  '18/04': [
    {
      topic: 'Simulado Oficial: SQL, BI, TI, Legislação e Português',
      type: 'Principal',
      prompt: 'Aja como banca organizadora. Gere o **Simulado Oficial (60 Questões)** englobando Comandos SQL, BI e os demais conteúdos de TI, Legislação e Português.'
    }
  ],
  '19/04': [
    {
      topic: 'Simulado Oficial: SQL, BI, TI, Legislação e Português',
      type: 'Principal',
      prompt: 'Aja como banca organizadora. Gere o **Simulado Oficial (60 Questões)** englobando Comandos SQL, BI e os demais conteúdos de TI, Legislação e Português.'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // SEMANA 6: Reta Final (20/04 – 26/04)
  // Horas 1 e 2: Prompt único de exaustão de questões intensivas
  // Horas 3 e 4: Sem prompt (leitura passiva de resumos e leis)
  // ═══════════════════════════════════════════════════════════════
  '20/04': [
    {
      topic: 'Reta Final: Questões Intensivas',
      type: 'Principal',
      prompt: 'Aja como um simulador intensivo de questões de concurso da área de Tecnologia da Informação. Estamos na reta final. Gere uma bateria de **15 questões de nível avançado (Múltipla Escolha)**, sendo 10 focadas em Conhecimentos Específicos de TI (Redes, BD, Algoritmos, Eng. de Software) e 5 focadas em Língua Portuguesa. Foque em pegadinhas comuns. Forneça gabarito detalhado.'
    }
  ],
  '21/04': [
    {
      topic: 'Reta Final: Questões Intensivas',
      type: 'Principal',
      prompt: 'Aja como um simulador intensivo de questões de concurso da área de Tecnologia da Informação. Estamos na reta final. Gere uma bateria de **15 questões de nível avançado (Múltipla Escolha)**, sendo 10 focadas em Conhecimentos Específicos de TI (Redes, BD, Algoritmos, Eng. de Software) e 5 focadas em Língua Portuguesa. Foque em pegadinhas comuns. Forneça gabarito detalhado.'
    }
  ],
  '22/04': [
    {
      topic: 'Reta Final: Questões Intensivas',
      type: 'Principal',
      prompt: 'Aja como um simulador intensivo de questões de concurso da área de Tecnologia da Informação. Estamos na reta final. Gere uma bateria de **15 questões de nível avançado (Múltipla Escolha)**, sendo 10 focadas em Conhecimentos Específicos de TI (Redes, BD, Algoritmos, Eng. de Software) e 5 focadas em Língua Portuguesa. Foque em pegadinhas comuns. Forneça gabarito detalhado.'
    }
  ],
  '23/04': [
    {
      topic: 'Reta Final: Questões Intensivas',
      type: 'Principal',
      prompt: 'Aja como um simulador intensivo de questões de concurso da área de Tecnologia da Informação. Estamos na reta final. Gere uma bateria de **15 questões de nível avançado (Múltipla Escolha)**, sendo 10 focadas em Conhecimentos Específicos de TI (Redes, BD, Algoritmos, Eng. de Software) e 5 focadas em Língua Portuguesa. Foque em pegadinhas comuns. Forneça gabarito detalhado.'
    }
  ],
  '24/04': [
    {
      topic: 'Reta Final: Questões Intensivas',
      type: 'Principal',
      prompt: 'Aja como um simulador intensivo de questões de concurso da área de Tecnologia da Informação. Estamos na reta final. Gere uma bateria de **15 questões de nível avançado (Múltipla Escolha)**, sendo 10 focadas em Conhecimentos Específicos de TI (Redes, BD, Algoritmos, Eng. de Software) e 5 focadas em Língua Portuguesa. Foque em pegadinhas comuns. Forneça gabarito detalhado.'
    }
  ],
  // 25/04: Descanso Pré-Prova (sem prompts)
  // 26/04: DIA DA PROVA OBJETIVA (sem prompts)
}

export function getPromptForQuest(questId: string): string | null {
  // questId format: "16-03-h1", "16-03-h2", etc.
  const parts = questId.split('-')
  if (parts.length < 3) return null

  const [day, month, hour] = parts
  const dateKey = `${day}/${month}`
  const hourIdx = parseInt(hour.replace('h', '')) - 1

  const entries = PRD_PROMPTS[dateKey]
  if (entries && entries[hourIdx]) {
    return entries[hourIdx].prompt
  }
  return null
}
