import { User, Area, Topic, Problem, Review, ActivityDay } from '../types';

export const initialUser: User = {
  id: 'usr_1',
  nome: 'John Doe',
  email: 'johndoe@exemplo.com',
  cargo: 'Estudante de programação',
  avatarUrl: '',
  metaGlobal: 200,
};

export const initialAreas: Area[] = [
  {
    id: 'area_ed',
    userId: 'usr_1',
    nome: 'Estruturas de Dados',
    descricao: 'Estruturas fundamentais e avançadas para manipulação e consulta rápida de dados.',
    ordem: 1,
    cor: '#4F46E5', // Indigo
    icone: 'Layers',
  },
  {
    id: 'area_grafos',
    userId: 'usr_1',
    nome: 'Grafos',
    descricao: 'Algoritmos em malhas, árvores, caminhos mínimos e conectividade.',
    ordem: 2,
    cor: '#059669', // Emerald Green
    icone: 'GitFork',
  },
  {
    id: 'area_dp',
    userId: 'usr_1',
    nome: 'Programação Dinâmica',
    descricao: 'Otimização com subproblemas sobrepostos e subestrutura ótima.',
    ordem: 3,
    cor: '#0284C7', // Sky Blue
    icone: 'CodeXml',
  },
  {
    id: 'area_math',
    userId: 'usr_1',
    nome: 'Matemática',
    descricao: 'Teoria dos números, combinatória, aritmética modular e matrizes.',
    ordem: 4,
    cor: '#D97706', // Amber/Yellow
    icone: 'Sigma',
  },
  {
    id: 'area_strings',
    userId: 'usr_1',
    nome: 'Strings',
    descricao: 'Processamento de texto, casamento de padrões, KMP e Trie.',
    ordem: 5,
    cor: '#E11D48', // Rose/Red
    icone: 'Binary',
  },
  {
    id: 'area_geo',
    userId: 'usr_1',
    nome: 'Geometria Computacional',
    descricao: 'Vetores, produto vetorial, envoltória convexa e interseções.',
    ordem: 6,
    cor: '#8B5CF6', // Purple
    icone: 'Shapes',
  },
];

export const initialTopics: Topic[] = [
  // Estruturas de Dados
  { id: 'top_arrays', areaId: 'area_ed', userId: 'usr_1', nome: 'Arrays & Vetores', metaProblemas: 12, dataCriacao: '2026-06-01' },
  { id: 'top_stack_queue', areaId: 'area_ed', userId: 'usr_1', nome: 'Stack & Queue', metaProblemas: 10, dataCriacao: '2026-06-05' },
  { id: 'top_deque', areaId: 'area_ed', userId: 'usr_1', nome: 'Deque & Monotonic Queue', metaProblemas: 8, dataCriacao: '2026-06-15' },
  { id: 'top_segtree', areaId: 'area_ed', userId: 'usr_1', nome: 'Segment Tree', metaProblemas: 12, dataCriacao: '2026-07-01' },
  { id: 'top_fenwick', areaId: 'area_ed', userId: 'usr_1', nome: 'Fenwick Tree (BIT)', metaProblemas: 8, dataCriacao: '2026-07-15' },

  // Grafos
  { id: 'top_bfs', areaId: 'area_grafos', userId: 'usr_1', nome: 'BFS', metaProblemas: 10, dataCriacao: '2026-06-10' },
  { id: 'top_dfs', areaId: 'area_grafos', userId: 'usr_1', nome: 'DFS', metaProblemas: 10, dataCriacao: '2026-06-12' },
  { id: 'top_dijkstra', areaId: 'area_grafos', userId: 'usr_1', nome: 'Dijkstra', metaProblemas: 8, dataCriacao: '2026-07-02' },
  { id: 'top_mst', areaId: 'area_grafos', userId: 'usr_1', nome: 'Minimum Spanning Tree', metaProblemas: 6, dataCriacao: '2026-07-20' },
  { id: 'top_toposort', areaId: 'area_grafos', userId: 'usr_1', nome: 'Topological Sort', metaProblemas: 6, dataCriacao: '2026-08-01' },

  // Programação Dinâmica
  { id: 'top_knapsack', areaId: 'area_dp', userId: 'usr_1', nome: 'Knapsack', metaProblemas: 10, dataCriacao: '2026-06-20' },
  { id: 'top_lis', areaId: 'area_dp', userId: 'usr_1', nome: 'LIS (Longest Increasing Subsequence)', metaProblemas: 8, dataCriacao: '2026-07-10' },
  { id: 'top_tree_dp', areaId: 'area_dp', userId: 'usr_1', nome: 'DP em Árvores', metaProblemas: 8, dataCriacao: '2026-08-15' },
  { id: 'top_interval_dp', areaId: 'area_dp', userId: 'usr_1', nome: 'DP em Intervalos', metaProblemas: 8, dataCriacao: '2026-09-01' },

  // Matemática
  { id: 'top_num_theory', areaId: 'area_math', userId: 'usr_1', nome: 'Teoria dos Números', metaProblemas: 10, dataCriacao: '2026-06-15' },
  { id: 'top_modular', areaId: 'area_math', userId: 'usr_1', nome: 'Aritmética Modular & Inverso', metaProblemas: 8, dataCriacao: '2026-07-05' },
  { id: 'top_combinatorics', areaId: 'area_math', userId: 'usr_1', nome: 'Combinatória', metaProblemas: 8, dataCriacao: '2026-08-10' },

  // Strings
  { id: 'top_kmp', areaId: 'area_strings', userId: 'usr_1', nome: 'KMP & Pi Function', metaProblemas: 8, dataCriacao: '2026-07-25' },
  { id: 'top_trie', areaId: 'area_strings', userId: 'usr_1', nome: 'Trie', metaProblemas: 8, dataCriacao: '2026-08-20' },
  { id: 'top_hashing', areaId: 'area_strings', userId: 'usr_1', nome: 'String Hashing', metaProblemas: 9, dataCriacao: '2026-09-05' },

  // Geometria
  { id: 'top_convex_hull', areaId: 'area_geo', userId: 'usr_1', nome: 'Convex Hull', metaProblemas: 6, dataCriacao: '2026-08-25' },
  { id: 'top_points_lines', areaId: 'area_geo', userId: 'usr_1', nome: 'Pontos e Retas', metaProblemas: 8, dataCriacao: '2026-09-15' },
];

export const initialProblems: Problem[] = [
  // Exibidos nos cards recentes da imagem
  {
    id: 'prob_1',
    userId: 'usr_1',
    topicId: 'top_segtree',
    nome: 'Range Sum Queries II',
    url: 'https://cses.fi/problemset/task/1648',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-11-21',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Segment Tree com atualização pontual e consulta de soma em intervalo.',
    motivoEstrela: 'Problema canônico que fixa a estrutura da árvore de segmentos e consultas logarítmicas.',
    dataUltimaRevisao: '2026-09-21',
    qtdRevisoes: 1,
    proximaRevisao: '2026-11-20', // Passou da data (Revisão pendente)
    dataCriacao: '2026-09-20',
  },
  {
    id: 'prob_2',
    userId: 'usr_1',
    topicId: 'top_bfs',
    nome: 'Labyrinth',
    url: 'https://cses.fi/problemset/task/1193',
    plataforma: 'CSES',
    dificuldade: 'Fácil',
    dataResolucao: '2026-11-21',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'BFS em grid bidimensional para menor caminho com reconstrução de rota.',
    motivoEstrela: 'Ensina como guardar o caminho percorrido com matriz de pais.',
    dataUltimaRevisao: '2026-10-21',
    qtdRevisoes: 2,
    proximaRevisao: '2026-11-21', // Hoje! (Revisar hoje)
    dataCriacao: '2026-08-15',
  },
  {
    id: 'prob_3',
    userId: 'usr_1',
    topicId: 'top_num_theory',
    nome: 'B. Make It Divisible',
    url: 'https://codeforces.com/problemset/problem/1593/B',
    plataforma: 'Codeforces',
    dificuldade: '800',
    dataResolucao: '2026-11-20',
    status: 'Resolvido',
    isStar: false,
    observacoes: 'Checar sufixos válidos múltiplos de 25: 00, 25, 50, 75.',
    dataCriacao: '2026-11-20',
  },
  {
    id: 'prob_4',
    userId: 'usr_1',
    topicId: 'top_knapsack',
    nome: 'Book Shop',
    url: 'https://cses.fi/problemset/task/1156',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-11-20',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Mochila 0/1 clássica com otimização de memória em 1D.',
    motivoEstrela: 'O problema essencial de Programação Dinâmica para memorizar a iteração decrescente.',
    dataUltimaRevisao: undefined,
    qtdRevisoes: 0,
    proximaRevisao: undefined, // Nunca revisado
    dataCriacao: '2026-11-20',
  },
  {
    id: 'prob_5',
    userId: 'usr_1',
    topicId: 'top_dfs',
    nome: 'C. Longest Simple Cycle',
    url: 'https://codeforces.com/problemset/problem/1476/C',
    plataforma: 'Codeforces',
    dificuldade: '1500',
    dataResolucao: '2026-11-19',
    status: 'Resolvido',
    isStar: false,
    observacoes: 'DFS e transição gulosa/DP sobre cadeias.',
    dataCriacao: '2026-11-19',
  },

  // Outros Problemas Estrela importantes (totalizando 18 problemas estrela)
  {
    id: 'prob_6',
    userId: 'usr_1',
    topicId: 'top_dijkstra',
    nome: 'Shortest Routes I',
    url: 'https://cses.fi/problemset/task/1671',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-10-14',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Dijkstra com min-heap / priority_queue e tipos de dados de 64 bits.',
    motivoEstrela: 'Template limpo e definitivo para Dijkstra sem loops infinitos.',
    dataUltimaRevisao: '2026-11-05',
    qtdRevisoes: 1,
    proximaRevisao: '2026-12-20',
    dataCriacao: '2026-10-14',
  },
  {
    id: 'prob_7',
    userId: 'usr_1',
    topicId: 'top_lis',
    nome: 'Increasing Subsequence',
    url: 'https://cses.fi/problemset/task/1145',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-09-12',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'LIS em O(N log N) utilizando busca binária (std::lower_bound).',
    motivoEstrela: 'Demonstra como transformar DP O(N^2) em logarítmica com paciência.',
    dataUltimaRevisao: '2026-10-10',
    qtdRevisoes: 2,
    proximaRevisao: '2026-12-05',
    dataCriacao: '2026-09-12',
  },
  {
    id: 'prob_8',
    userId: 'usr_1',
    topicId: 'top_mst',
    nome: 'Road Reparation',
    url: 'https://cses.fi/problemset/task/1675',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-09-28',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Algoritmo de Kruskal com DSU (Disjoint Set Union) e compressão de caminho.',
    motivoEstrela: 'Padrão ouro para conectar componentes com peso mínimo.',
    dataUltimaRevisao: '2026-11-01',
    qtdRevisoes: 1,
    proximaRevisao: '2026-12-15',
    dataCriacao: '2026-09-28',
  },
  {
    id: 'prob_9',
    userId: 'usr_1',
    topicId: 'top_fenwick',
    nome: 'Forest Queries',
    url: 'https://cses.fi/problemset/task/1652',
    plataforma: 'CSES',
    dificuldade: 'Fácil',
    dataResolucao: '2026-08-11',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Prefix Sum 2D e consultas rápidas em matrizes.',
    motivoEstrela: 'Base essencial antes de ir para Fenwick 2D.',
    dataUltimaRevisao: '2026-10-18',
    qtdRevisoes: 1,
    proximaRevisao: '2026-12-10',
    dataCriacao: '2026-08-11',
  },
  {
    id: 'prob_10',
    userId: 'usr_1',
    topicId: 'top_trie',
    nome: 'Word Combinations',
    url: 'https://cses.fi/problemset/task/1402',
    plataforma: 'CSES',
    dificuldade: 'Difícil',
    dataResolucao: '2026-09-02',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Trie combinada com Programação Dinâmica em sufixos.',
    motivoEstrela: 'Excelente exemplo de fusão de estruturas de strings com DP.',
    dataUltimaRevisao: '2026-10-01',
    qtdRevisoes: 1,
    proximaRevisao: '2026-11-28',
    dataCriacao: '2026-09-02',
  },
  {
    id: 'prob_11',
    userId: 'usr_1',
    topicId: 'top_kmp',
    nome: 'Finding Borders',
    url: 'https://cses.fi/problemset/task/1732',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-08-04',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Array de prefixo do KMP para encontrar todos os bordos de uma string.',
    motivoEstrela: 'Fixa o funcionamento do ponteiro pi do algoritmo KMP.',
    dataUltimaRevisao: '2026-09-30',
    qtdRevisoes: 1,
    proximaRevisao: '2026-11-29',
    dataCriacao: '2026-08-04',
  },
  {
    id: 'prob_12',
    userId: 'usr_1',
    topicId: 'top_tree_dp',
    nome: 'Tree Distances I',
    url: 'https://cses.fi/problemset/task/1132',
    plataforma: 'CSES',
    dificuldade: 'Difícil',
    dataResolucao: '2026-10-05',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Rerooting DP (DP em árvore com troca de raiz).',
    motivoEstrela: 'Técnica avançada essencial para problemas de maratona com diâmetro e distâncias.',
    dataUltimaRevisao: '2026-11-12',
    qtdRevisoes: 2,
    proximaRevisao: '2026-12-24',
    dataCriacao: '2026-10-05',
  },
  {
    id: 'prob_13',
    userId: 'usr_1',
    topicId: 'top_combinatorics',
    nome: 'Binomial Coefficients',
    url: 'https://cses.fi/problemset/task/1079',
    plataforma: 'CSES',
    dificuldade: 'Fácil',
    dataResolucao: '2026-07-29',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Pré-cálculo de fatoriais e inversos com Pequeno Teorema de Fermat.',
    motivoEstrela: 'Template para qualquer problema de maratona que envolva nCr mod 10^9+7.',
    dataUltimaRevisao: '2026-10-03',
    qtdRevisoes: 2,
    proximaRevisao: '2026-12-01',
    dataCriacao: '2026-07-29',
  },
  {
    id: 'prob_14',
    userId: 'usr_1',
    topicId: 'top_toposort',
    nome: 'Course Schedule',
    url: 'https://cses.fi/problemset/task/1679',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-08-19',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Algoritmo de Kahn com contagem de graus de entrada (in-degree).',
    motivoEstrela: 'Distingue DAGs e detecta ciclos direcionados de forma concisa.',
    dataUltimaRevisao: '2026-10-25',
    qtdRevisoes: 1,
    proximaRevisao: '2026-12-18',
    dataCriacao: '2026-08-19',
  },
  {
    id: 'prob_15',
    userId: 'usr_1',
    topicId: 'top_convex_hull',
    nome: 'Convex Hull',
    url: 'https://cses.fi/problemset/task/2195',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-09-17',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Monotone Chain algorithm com produto vetorial (cross product).',
    motivoEstrela: 'A introdução perfeita a predicados geométricos sem ponto flutuante.',
    dataUltimaRevisao: '2026-11-10',
    qtdRevisoes: 1,
    proximaRevisao: '2026-12-30',
    dataCriacao: '2026-09-17',
  },
  {
    id: 'prob_16',
    userId: 'usr_1',
    topicId: 'top_deque',
    nome: 'Sliding Window Maximum',
    url: 'https://leetcode.com/problems/sliding-window-maximum/',
    plataforma: 'LeetCode',
    dificuldade: 'Difícil',
    dataResolucao: '2026-07-12',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Fila monotônica para manter o elemento ótimo em O(1) amortizado.',
    motivoEstrela: 'Ideia clássica frequentemente utilizada para otimizar transições de DP.',
    dataUltimaRevisao: '2026-10-15',
    qtdRevisoes: 3,
    proximaRevisao: '2026-12-12',
    dataCriacao: '2026-07-12',
  },
  {
    id: 'prob_17',
    userId: 'usr_1',
    topicId: 'top_interval_dp',
    nome: 'Removal Game',
    url: 'https://cses.fi/problemset/task/1097',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-09-22',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'DP Minimax sobre intervalos [l, r] com soma acumulada.',
    motivoEstrela: 'Ensina a modelagem de jogos de dois jogadores estritamente competitivos.',
    dataUltimaRevisao: '2026-11-03',
    qtdRevisoes: 1,
    proximaRevisao: '2026-12-25',
    dataCriacao: '2026-09-22',
  },
  {
    id: 'prob_18',
    userId: 'usr_1',
    topicId: 'top_hashing',
    nome: 'String Matching',
    url: 'https://cses.fi/problemset/task/1753',
    plataforma: 'CSES',
    dificuldade: 'Médio',
    dataResolucao: '2026-09-10',
    status: 'Resolvido',
    isStar: true,
    conceitoPrincipal: 'Polynomial Rolling Hash com duplo módulo para evitar colisões.',
    motivoEstrela: 'Ferramenta prática e rápida quando não se quer implementar KMP completo.',
    dataUltimaRevisao: '2026-10-30',
    qtdRevisoes: 1,
    proximaRevisao: '2026-12-22',
    dataCriacao: '2026-09-10',
  },
];

// Gerar outros problemas para totalizar os 128 problemas resolvidos
const generateAdditionalProblems = (): Problem[] => {
  const extra: Problem[] = [];
  const platforms: Problem['plataforma'][] = ['CSES', 'Codeforces', 'AtCoder', 'Beecrowd', 'CodeChef'];
  
  // Lista com distribuição exata das áreas mostradas no card:
  // ED: 38 total (temos alguns, vamos completar)
  // Grafos: 29 total
  // DP: 24 total
  // Matemática: 18 total
  // Strings: 12 total
  // Geometria: 7 total
  // Total = 38 + 29 + 24 + 18 + 12 + 7 = 128!
  
  const targetCounts = {
    top_arrays: 8,
    top_stack_queue: 8,
    top_deque: 6,
    top_segtree: 9,
    top_fenwick: 7, // Total ED = 38
    top_bfs: 7,
    top_dfs: 7,
    top_dijkstra: 6,
    top_mst: 5,
    top_toposort: 4, // Total Grafos = 29
    top_knapsack: 7,
    top_lis: 6,
    top_tree_dp: 6,
    top_interval_dp: 5, // Total DP = 24
    top_num_theory: 7,
    top_modular: 6,
    top_combinatorics: 5, // Total Math = 18
    top_kmp: 4,
    top_trie: 4,
    top_hashing: 4, // Total Strings = 12
    top_convex_hull: 4,
    top_points_lines: 3, // Total Geo = 7
  };

  let idCounter = 19;
  
  Object.entries(targetCounts).forEach(([topicId, count]) => {
    // Quantos já temos desse topicId nos 18 iniciais?
    const existing = initialProblems.filter(p => p.topicId === topicId).length;
    const needed = Math.max(0, count - existing);

    for (let i = 0; i < needed; i++) {
      const plat = platforms[(idCounter + i) % platforms.length];
      const diffVal = (800 + ((idCounter * 73) % 1300)).toString();
      
      // Datas entre Junho de 2026 e Novembro de 2026
      const month = String(6 + (idCounter % 5)).padStart(2, '0');
      const day = String(1 + (idCounter % 28)).padStart(2, '0');
      
      extra.push({
        id: `prob_${idCounter}`,
        userId: 'usr_1',
        topicId: topicId,
        nome: `${plat === 'Codeforces' ? 'Problem ' + String.fromCharCode(65 + (idCounter % 6)) + '.' : ''} Exercício Prático #${idCounter}`,
        url: plat === 'CSES' ? 'https://cses.fi/problemset' : 'https://codeforces.com/problemset',
        plataforma: plat,
        dificuldade: plat === 'Codeforces' ? diffVal : (idCounter % 3 === 0 ? 'Fácil' : idCounter % 3 === 1 ? 'Médio' : 'Difícil'),
        dataResolucao: `2026-${month}-${day}`,
        status: 'Resolvido',
        isStar: false,
        observacoes: 'Resolvido com sucesso durante sessão de treino.',
        dataCriacao: `2026-${month}-${day}`,
      });
      idCounter++;
    }
  });

  return extra;
};

export const allMockProblems: Problem[] = [
  ...initialProblems,
  ...generateAdditionalProblems()
];

export const initialReviews: Review[] = [
  {
    id: 'rev_1',
    problemId: 'prob_1',
    userId: 'usr_1',
    dataRevisao: '2026-09-21',
    resultado: 'Lembrei parcialmente',
    observacoes: 'Tive dúvida na propagação do lazy update, mas a consulta simples estava fresca.',
    proximaRevisao: '2026-11-20',
  },
  {
    id: 'rev_2',
    problemId: 'prob_2',
    userId: 'usr_1',
    dataRevisao: '2026-10-21',
    resultado: 'Lembrei completamente',
    observacoes: 'Implementei de primeira sem olhar o gabarito. Reconstrução de caminho em O(N*M).',
    proximaRevisao: '2026-11-21',
  },
  {
    id: 'rev_3',
    problemId: 'prob_6',
    userId: 'usr_1',
    dataRevisao: '2026-11-05',
    resultado: 'Lembrei completamente',
    observacoes: 'Dijkstra clássico. Importante lembrar do priority_queue com greater.',
    proximaRevisao: '2026-12-20',
  },
  {
    id: 'rev_4',
    problemId: 'prob_7',
    userId: 'usr_1',
    dataRevisao: '2026-10-10',
    resultado: 'Lembrei completamente',
    observacoes: 'Substituição com lower_bound dominada.',
    proximaRevisao: '2026-12-05',
  },
];

// Dados do Heatmap para os últimos 6 meses (Junho a Novembro de 2026)
// com exatos 100 dias ativos e totalizando 128 problemas
export const generateActivityData = (): ActivityDay[] => {
  const activityDays: ActivityDay[] = [];
  const startDate = new Date(2026, 5, 1); // 1 de Junho de 2026
  const endDate = new Date(2026, 10, 21); // 21 de Novembro de 2026
  
  // Gerar dias
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
  let activeDaysLeft = 100;
  let problemsLeft = 128;

  for (let i = 0; i < totalDays; i++) {
    const current = new Date(startDate.getTime() + i * (1000 * 3600 * 24));
    const dateStr = current.toISOString().split('T')[0];
    
    // Distribuir os 100 dias ativos ao longo dos 174 dias
    const remainingSlots = totalDays - i;
    const shouldBeActive = activeDaysLeft > 0 && (Math.random() < (activeDaysLeft / remainingSlots) || activeDaysLeft === remainingSlots);
    
    let count = 0;
    if (shouldBeActive) {
      activeDaysLeft--;
      // 1 ou 2 problemas na maioria dos dias, às vezes 3
      count = Math.min(problemsLeft, Math.floor(Math.random() * 2) + 1);
      if (problemsLeft > activeDaysLeft && Math.random() < 0.2) {
        count = Math.min(problemsLeft, count + 1);
      }
      problemsLeft -= count;
    }

    activityDays.push({
      date: dateStr,
      count: count,
    });
  }

  // Se sobrou algum problema para os últimos dias ativos
  if (problemsLeft > 0) {
    activityDays[activityDays.length - 1].count += problemsLeft;
  }

  return activityDays;
};
