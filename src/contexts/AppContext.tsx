import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Area, Topic, Problem, Review, ActivityDay } from '../types';
import {
  initialUser,
  initialAreas,
  initialTopics,
  allMockProblems,
  initialReviews,
  generateActivityData,
} from '../data/mockData';
import { sanitizeUrl } from '../utils/helpers';
import { api } from '../services/api';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: User;
  areas: Area[];
  topics: Topic[];
  problems: Problem[];
  reviews: Review[];
  activityData: ActivityDay[];
  
  // Ações de Problemas
  addProblem: (data: Partial<Problem> & { nome: string; topicId: string }) => Problem;
  updateProblem: (id: string, updates: Partial<Problem>) => void;
  deleteProblem: (id: string) => void;
  toggleStar: (id: string) => void;
  
  // Ações de Áreas e Tópicos
  addArea: (data: Omit<Area, 'id'>) => Area;
  updateArea: (id: string, updates: Partial<Area>) => void;
  deleteArea: (id: string) => void;
  addTopic: (data: Omit<Topic, 'id' | 'dataCriacao'>) => Topic;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  
  // Ações de Revisão
  recordReview: (reviewData: Omit<Review, 'id'>) => void;
  
  // Utilidades
  resetToMockData: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Modais de acesso rápido
  isAddProblemOpen: boolean;
  selectedTopicForNewProblem?: string;
  openAddProblem: (defaultTopicId?: string) => void;
  closeAddProblem: () => void;
  
  reviewModalProblem: Problem | null;
  openReviewModal: (problem: Problem) => void;
  closeReviewModal: () => void;
  
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  
  // Notificações Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Tema Dark / Light
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'codetrack_state_v1';

const safeLoad = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Falha ao ler ${key} do localStorage:`, e);
    return fallback;
  }
};

const safeSave = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Falha ao salvar ${key} no localStorage:`, e);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => safeLoad(`${LOCAL_STORAGE_KEY}_user`, initialUser));
  const [areas, setAreas] = useState<Area[]>(() => safeLoad(`${LOCAL_STORAGE_KEY}_areas`, initialAreas));
  const [topics, setTopics] = useState<Topic[]>(() => safeLoad(`${LOCAL_STORAGE_KEY}_topics`, initialTopics));
  const [problems, setProblems] = useState<Problem[]>(() => safeLoad(`${LOCAL_STORAGE_KEY}_problems`, allMockProblems));
  const [reviews, setReviews] = useState<Review[]>(() => safeLoad(`${LOCAL_STORAGE_KEY}_reviews`, initialReviews));
  const [activityData, setActivityData] = useState<ActivityDay[]>(() => safeLoad(`${LOCAL_STORAGE_KEY}_activity`, generateActivityData()));

  // Modais de estado
  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);
  const [selectedTopicForNewProblem, setSelectedTopicForNewProblem] = useState<string | undefined>();
  const [reviewModalProblem, setReviewModalProblem] = useState<Problem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Tema Dark / Light
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('codetrack_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('codetrack_theme', newTheme);
    } catch (e) {
      console.warn('Erro ao salvar tema:', e);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Carregar dados iniciais da API Backend (SQLite)
  useEffect(() => {
    let isMounted = true;
    api.getInit()
      .then((data) => {
        if (!isMounted) return;
        if (data.user) setUser(data.user);
        if (data.areas) setAreas(data.areas);
        if (data.topics) setTopics(data.topics);
        if (data.problems) setProblems(data.problems);
        if (data.reviews) setReviews(data.reviews);
        if (data.activityData) setActivityData(data.activityData);
      })
      .catch((err) => {
        console.warn('Backend API não conectado, utilizando dados locais de fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Salvar no localStorage sempre que houver mudanças (cache de fallback)
  useEffect(() => {
    safeSave(`${LOCAL_STORAGE_KEY}_user`, user);
  }, [user]);

  useEffect(() => {
    safeSave(`${LOCAL_STORAGE_KEY}_areas`, areas);
  }, [areas]);

  useEffect(() => {
    safeSave(`${LOCAL_STORAGE_KEY}_topics`, topics);
  }, [topics]);

  useEffect(() => {
    safeSave(`${LOCAL_STORAGE_KEY}_problems`, problems);
  }, [problems]);

  useEffect(() => {
    safeSave(`${LOCAL_STORAGE_KEY}_reviews`, reviews);
  }, [reviews]);

  useEffect(() => {
    safeSave(`${LOCAL_STORAGE_KEY}_activity`, activityData);
  }, [activityData]);

  // Funções de Problemas
  const addProblem = (data: Partial<Problem> & { nome: string; topicId: string }): Problem => {
    const safeUrl = sanitizeUrl(data.url);
    const newProblem: Problem = {
      id: `prob_${Date.now()}`,
      userId: user.id,
      topicId: data.topicId,
      nome: data.nome,
      url: safeUrl !== '#' ? safeUrl : 'https://cses.fi/problemset',
      plataforma: data.plataforma || 'CSES',
      dificuldade: data.dificuldade || 'Médio',
      dataResolucao: data.dataResolucao || new Date().toISOString().split('T')[0],
      status: data.status || 'Resolvido',
      observacoes: data.observacoes || '',
      isStar: !!data.isStar,
      conceitoPrincipal: data.conceitoPrincipal || '',
      motivoEstrela: data.motivoEstrela || '',
      qtdRevisoes: 0,
      dataCriacao: new Date().toISOString().split('T')[0],
    };

    setProblems((prev) => [newProblem, ...prev]);

    // Atualiza o mapa de atividade se for resolvido
    if (newProblem.status === 'Resolvido') {
      const todayStr = newProblem.dataResolucao;
      setActivityData((prev) => {
        const found = prev.find((d) => d.date === todayStr);
        if (found) {
          return prev.map((d) => (d.date === todayStr ? { ...d, count: d.count + 1 } : d));
        } else {
          return [...prev, { date: todayStr, count: 1 }];
        }
      });
    }

    // Persiste no backend
    api.addProblem(newProblem).catch((err) => {
      console.warn('Erro ao sincronizar adição de problema com o backend:', err);
    });

    showToast(`Problema "${newProblem.nome}" cadastrado com sucesso!`);
    return newProblem;
  };

  const updateProblem = (id: string, updates: Partial<Problem>) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    api.updateProblem(id, updates).catch((err) => {
      console.warn('Erro ao sincronizar atualização de problema com o backend:', err);
    });
    showToast('Problema atualizado!');
  };

  const deleteProblem = (id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
    api.deleteProblem(id).catch((err) => {
      console.warn('Erro ao sincronizar exclusão de problema com o backend:', err);
    });
    showToast('Problema removido com sucesso.', 'info');
  };

  const toggleStar = (id: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStar = !p.isStar;
          showToast(
            nextStar ? `"${p.nome}" marcado como Problema Estrela ⭐` : `Estrela removida de "${p.nome}"`
          );
          return {
            ...p,
            isStar: nextStar,
            motivoEstrela: nextStar ? (p.motivoEstrela || 'Problema canônico e educativo.') : p.motivoEstrela,
            conceitoPrincipal: nextStar ? (p.conceitoPrincipal || 'Conceito chave do tópico.') : p.conceitoPrincipal,
          };
        }
        return p;
      })
    );
    api.toggleStar(id).catch((err) => {
      console.warn('Erro ao sincronizar estrela com o backend:', err);
    });
  };

  // Funções de Áreas e Tópicos
  const addArea = (data: Omit<Area, 'id'>): Area => {
    const newArea: Area = {
      ...data,
      id: `area_${Date.now()}`,
    };
    setAreas((prev) => [...prev, newArea]);
    api.addArea(newArea).catch((err) => {
      console.warn('Erro ao sincronizar nova área com o backend:', err);
    });
    showToast(`Área "${newArea.nome}" criada com sucesso!`);
    return newArea;
  };

  const updateArea = (id: string, updates: Partial<Area>) => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    api.updateArea(id, updates).catch((err) => {
      console.warn('Erro ao sincronizar atualização de área com o backend:', err);
    });
    showToast('Área atualizada!');
  };

  const deleteArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    setTopics((prev) => prev.filter((t) => t.areaId !== id));
    api.deleteArea(id).catch((err) => {
      console.warn('Erro ao sincronizar exclusão de área com o backend:', err);
    });
    showToast('Área e tópicos removidos.', 'info');
  };

  const addTopic = (data: Omit<Topic, 'id' | 'dataCriacao'>): Topic => {
    const newTopic: Topic = {
      ...data,
      id: `top_${Date.now()}`,
      dataCriacao: new Date().toISOString().split('T')[0],
    };
    setTopics((prev) => [...prev, newTopic]);
    api.addTopic(newTopic).catch((err) => {
      console.warn('Erro ao sincronizar novo tópico com o backend:', err);
    });
    showToast(`Tópico "${newTopic.nome}" criado com sucesso!`);
    return newTopic;
  };

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    api.updateTopic(id, updates).catch((err) => {
      console.warn('Erro ao sincronizar atualização de tópico com o backend:', err);
    });
    showToast('Tópico atualizado!');
  };

  const deleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    api.deleteTopic(id).catch((err) => {
      console.warn('Erro ao sincronizar exclusão de tópico com o backend:', err);
    });
    showToast('Tópico removido.', 'info');
  };

  // Registro de Revisão (respeitando a regra de no máximo 2 meses)
  const recordReview = (reviewData: Omit<Review, 'id'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
    };

    setReviews((prev) => [newReview, ...prev]);

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.problemId) {
          return {
            ...p,
            dataUltimaRevisao: reviewData.dataRevisao,
            qtdRevisoes: (p.qtdRevisoes || 0) + 1,
            proximaRevisao: reviewData.proximaRevisao,
          };
        }
        return p;
      })
    );

    api.recordReview(newReview).catch((err) => {
      console.warn('Erro ao sincronizar revisão com o backend:', err);
    });

    showToast('Revisão registrada com sucesso!');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    api.updateUser(updates).catch((err) => {
      console.warn('Erro ao sincronizar perfil com o backend:', err);
    });
    showToast('Perfil atualizado com sucesso!');
  };

  const resetToMockData = () => {
    api.resetDatabase()
      .then((data) => {
        if (data.user) setUser(data.user);
        if (data.areas) setAreas(data.areas);
        if (data.topics) setTopics(data.topics);
        if (data.problems) setProblems(data.problems);
        if (data.reviews) setReviews(data.reviews);
        if (data.activityData) setActivityData(data.activityData);
        localStorage.clear();
        showToast('Dados restaurados para o padrão de demonstração!', 'info');
      })
      .catch((err) => {
        console.warn('Erro ao resetar no backend, resetando localmente:', err);
        setUser(initialUser);
        setAreas(initialAreas);
        setTopics(initialTopics);
        setProblems(allMockProblems);
        setReviews(initialReviews);
        setActivityData(generateActivityData());
        localStorage.clear();
        showToast('Dados restaurados para o padrão de demonstração!', 'info');
      });
  };

  const openAddProblem = (defaultTopicId?: string) => {
    setSelectedTopicForNewProblem(defaultTopicId);
    setIsAddProblemOpen(true);
  };

  const closeAddProblem = () => {
    setIsAddProblemOpen(false);
    setSelectedTopicForNewProblem(undefined);
  };

  const openReviewModal = (problem: Problem) => {
    setReviewModalProblem(problem);
  };

  const closeReviewModal = () => {
    setReviewModalProblem(null);
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <AppContext.Provider
      value={{
        user,
        areas,
        topics,
        problems,
        reviews,
        activityData,
        addProblem,
        updateProblem,
        deleteProblem,
        toggleStar,
        addArea,
        updateArea,
        deleteArea,
        addTopic,
        updateTopic,
        deleteTopic,
        recordReview,
        resetToMockData,
        updateUser,
        isAddProblemOpen,
        selectedTopicForNewProblem,
        openAddProblem,
        closeAddProblem,
        reviewModalProblem,
        openReviewModal,
        closeReviewModal,
        isSearchOpen,
        openSearch,
        closeSearch,
        toasts,
        showToast,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
