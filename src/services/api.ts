import { User, Area, Topic, Problem, Review, ActivityDay } from '../types';

export interface InitData {
  user: User;
  areas: Area[];
  topics: Topic[];
  problems: Problem[];
  reviews: Review[];
  activityData: ActivityDay[];
}

const BASE_URL = '/api';

export const api = {
  async getInit(): Promise<InitData> {
    const res = await fetch(`${BASE_URL}/init`);
    if (!res.ok) throw new Error('Falha ao obter dados iniciais');
    return res.json();
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    const res = await fetch(`${BASE_URL}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Falha ao atualizar usuário');
    return res.json();
  },

  async addArea(area: Omit<Area, 'id'> & { id?: string }): Promise<Area> {
    const res = await fetch(`${BASE_URL}/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(area),
    });
    if (!res.ok) throw new Error('Falha ao criar área');
    return res.json();
  },

  async updateArea(id: string, updates: Partial<Area>): Promise<Area> {
    const res = await fetch(`${BASE_URL}/areas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Falha ao atualizar área');
    return res.json();
  },

  async deleteArea(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/areas/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao remover área');
  },

  async addTopic(topic: Omit<Topic, 'id' | 'dataCriacao'> & { id?: string; dataCriacao?: string }): Promise<Topic> {
    const res = await fetch(`${BASE_URL}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topic),
    });
    if (!res.ok) throw new Error('Falha ao criar tópico');
    return res.json();
  },

  async updateTopic(id: string, updates: Partial<Topic>): Promise<Topic> {
    const res = await fetch(`${BASE_URL}/topics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Falha ao atualizar tópico');
    return res.json();
  },

  async deleteTopic(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/topics/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao remover tópico');
  },

  async addProblem(problem: Partial<Problem> & { nome: string; topicId: string }): Promise<Problem> {
    const res = await fetch(`${BASE_URL}/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem),
    });
    if (!res.ok) throw new Error('Falha ao criar problema');
    return res.json();
  },

  async updateProblem(id: string, updates: Partial<Problem>): Promise<Problem> {
    const res = await fetch(`${BASE_URL}/problems/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Falha ao atualizar problema');
    return res.json();
  },

  async deleteProblem(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/problems/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao excluir problema');
  },

  async toggleStar(id: string): Promise<Problem> {
    const res = await fetch(`${BASE_URL}/problems/${id}/star`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Falha ao alternar estrela');
    return res.json();
  },

  async recordReview(review: Omit<Review, 'id'> & { id?: string }): Promise<{ review: Review; problem: Problem }> {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error('Falha ao registrar revisão');
    return res.json();
  },

  async resetDatabase(): Promise<InitData> {
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Falha ao resetar banco');
    return res.json();
  },
};
