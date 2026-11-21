import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initSchema } from './db.js';
import { runSeed } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicializa schema e seed se vazio
initSchema();
runSeed(db);

// Helper para normalizar problema (converte isStar para boolean)
const formatProblem = (p) => {
  if (!p) return null;
  return {
    ...p,
    isStar: Boolean(p.isStar),
  };
};

// ----------------------------------------------------------------------
// GET /api/init - Retorna estado consolidado
// ----------------------------------------------------------------------
app.get('/api/init', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users LIMIT 1').get();
    const areas = db.prepare('SELECT * FROM areas ORDER BY ordem ASC').all();
    const topics = db.prepare('SELECT * FROM topics').all();
    const rawProblems = db.prepare('SELECT * FROM problems ORDER BY dataResolucao DESC, dataCriacao DESC').all();
    const problems = rawProblems.map(formatProblem);
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY dataRevisao DESC').all();
    const activityData = db.prepare('SELECT date, count FROM activity ORDER BY date ASC').all();

    res.json({
      user,
      areas,
      topics,
      problems,
      reviews,
      activityData,
    });
  } catch (error) {
    console.error('Erro ao buscar dados iniciais:', error);
    res.status(500).json({ error: 'Erro ao carregar dados do banco de dados.' });
  }
});

// ----------------------------------------------------------------------
// PUT /api/user - Atualiza perfil do usuário
// ----------------------------------------------------------------------
app.put('/api/user', (req, res) => {
  try {
    const { nome, email, cargo, avatarUrl, metaGlobal } = req.body;
    const current = db.prepare('SELECT * FROM users LIMIT 1').get();
    if (!current) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const updated = {
      nome: nome !== undefined ? nome : current.nome,
      email: email !== undefined ? email : current.email,
      cargo: cargo !== undefined ? cargo : current.cargo,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : current.avatarUrl,
      metaGlobal: metaGlobal !== undefined ? Number(metaGlobal) : current.metaGlobal,
    };

    db.prepare(`
      UPDATE users
      SET nome = ?, email = ?, cargo = ?, avatarUrl = ?, metaGlobal = ?
      WHERE id = ?
    `).run(updated.nome, updated.email, updated.cargo, updated.avatarUrl, updated.metaGlobal, current.id);

    res.json({ id: current.id, ...updated });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Falha ao atualizar dados do usuário.' });
  }
});

// ----------------------------------------------------------------------
// ÁREAS (CRUD)
// ----------------------------------------------------------------------
app.post('/api/areas', (req, res) => {
  try {
    const { id, userId, nome, descricao, ordem, cor, icone } = req.body;
    const areaId = id || `area_${Date.now()}`;
    const newArea = {
      id: areaId,
      userId: userId || 'usr_1',
      nome,
      descricao: descricao || '',
      ordem: ordem || 1,
      cor: cor || '#4F46E5',
      icone: icone || 'Layers',
    };

    db.prepare(`
      INSERT INTO areas (id, userId, nome, descricao, ordem, cor, icone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(newArea.id, newArea.userId, newArea.nome, newArea.descricao, newArea.ordem, newArea.cor, newArea.icone);

    res.status(201).json(newArea);
  } catch (error) {
    console.error('Erro ao criar área:', error);
    res.status(500).json({ error: 'Falha ao criar área.' });
  }
});

app.put('/api/areas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const current = db.prepare('SELECT * FROM areas WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ error: 'Área não encontrada.' });

    const updated = {
      ...current,
      ...req.body,
    };

    db.prepare(`
      UPDATE areas
      SET nome = ?, descricao = ?, ordem = ?, cor = ?, icone = ?
      WHERE id = ?
    `).run(updated.nome, updated.descricao, updated.ordem, updated.cor, updated.icone, id);

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar área:', error);
    res.status(500).json({ error: 'Falha ao atualizar área.' });
  }
});

app.delete('/api/areas/:id', (req, res) => {
  try {
    const { id } = req.params;
    // Remove tópicos da área
    db.prepare('DELETE FROM topics WHERE areaId = ?').run(id);
    db.prepare('DELETE FROM areas WHERE id = ?').run(id);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Erro ao deletar área:', error);
    res.status(500).json({ error: 'Falha ao excluir área.' });
  }
});

// ----------------------------------------------------------------------
// TÓPICOS (CRUD)
// ----------------------------------------------------------------------
app.post('/api/topics', (req, res) => {
  try {
    const { id, areaId, userId, nome, descricao, metaProblemas, nivelDominio, dataCriacao } = req.body;
    const topicId = id || `top_${Date.now()}`;
    const newTopic = {
      id: topicId,
      areaId,
      userId: userId || 'usr_1',
      nome,
      descricao: descricao || '',
      metaProblemas: metaProblemas !== undefined ? Number(metaProblemas) : 10,
      nivelDominio: nivelDominio || 'Iniciante',
      dataCriacao: dataCriacao || new Date().toISOString().split('T')[0],
    };

    db.prepare(`
      INSERT INTO topics (id, areaId, userId, nome, descricao, metaProblemas, nivelDominio, dataCriacao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newTopic.id,
      newTopic.areaId,
      newTopic.userId,
      newTopic.nome,
      newTopic.descricao,
      newTopic.metaProblemas,
      newTopic.nivelDominio,
      newTopic.dataCriacao
    );

    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Erro ao criar tópico:', error);
    res.status(500).json({ error: 'Falha ao criar tópico.' });
  }
});

app.put('/api/topics/:id', (req, res) => {
  try {
    const { id } = req.params;
    const current = db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ error: 'Tópico não encontrado.' });

    const updated = {
      ...current,
      ...req.body,
    };

    db.prepare(`
      UPDATE topics
      SET nome = ?, descricao = ?, metaProblemas = ?, nivelDominio = ?, areaId = ?
      WHERE id = ?
    `).run(updated.nome, updated.descricao, updated.metaProblemas, updated.nivelDominio, updated.areaId, id);

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar tópico:', error);
    res.status(500).json({ error: 'Falha ao atualizar tópico.' });
  }
});

app.delete('/api/topics/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM topics WHERE id = ?').run(id);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Erro ao deletar tópico:', error);
    res.status(500).json({ error: 'Falha ao excluir tópico.' });
  }
});

// ----------------------------------------------------------------------
// PROBLEMAS (CRUD + Estrela)
// ----------------------------------------------------------------------
app.post('/api/problems', (req, res) => {
  try {
    const body = req.body;
    const problemId = body.id || `prob_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const newProblem = {
      id: problemId,
      userId: body.userId || 'usr_1',
      topicId: body.topicId,
      nome: body.nome,
      url: body.url || 'https://cses.fi/problemset',
      plataforma: body.plataforma || 'CSES',
      dificuldade: body.dificuldade || 'Médio',
      dataResolucao: body.dataResolucao || today,
      status: body.status || 'Resolvido',
      observacoes: body.observacoes || '',
      isStar: body.isStar ? 1 : 0,
      conceitoPrincipal: body.conceitoPrincipal || '',
      motivoEstrela: body.motivoEstrela || '',
      dataUltimaRevisao: body.dataUltimaRevisao || null,
      qtdRevisoes: body.qtdRevisoes || 0,
      proximaRevisao: body.proximaRevisao || null,
      dataCriacao: body.dataCriacao || today,
    };

    db.prepare(`
      INSERT INTO problems (
        id, userId, topicId, nome, url, plataforma, dificuldade,
        dataResolucao, status, observacoes, isStar, conceitoPrincipal,
        motivoEstrela, dataUltimaRevisao, qtdRevisoes, proximaRevisao, dataCriacao
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newProblem.id,
      newProblem.userId,
      newProblem.topicId,
      newProblem.nome,
      newProblem.url,
      newProblem.plataforma,
      newProblem.dificuldade,
      newProblem.dataResolucao,
      newProblem.status,
      newProblem.observacoes,
      newProblem.isStar,
      newProblem.conceitoPrincipal,
      newProblem.motivoEstrela,
      newProblem.dataUltimaRevisao,
      newProblem.qtdRevisoes,
      newProblem.proximaRevisao,
      newProblem.dataCriacao
    );

    // Se estiver resolvido, contabiliza na atividade do dia
    if (newProblem.status === 'Resolvido') {
      const actDate = newProblem.dataResolucao;
      db.prepare(`
        INSERT INTO activity (date, count) VALUES (?, 1)
        ON CONFLICT(date) DO UPDATE SET count = count + 1
      `).run(actDate);
    }

    res.status(201).json(formatProblem(newProblem));
  } catch (error) {
    console.error('Erro ao adicionar problema:', error);
    res.status(500).json({ error: 'Falha ao salvar problema.' });
  }
});

app.put('/api/problems/:id', (req, res) => {
  try {
    const { id } = req.params;
    const current = db.prepare('SELECT * FROM problems WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ error: 'Problema não encontrado.' });

    const body = req.body;
    const isStarVal = body.isStar !== undefined ? (body.isStar ? 1 : 0) : current.isStar;

    const updated = {
      ...current,
      ...body,
      isStar: isStarVal,
    };

    db.prepare(`
      UPDATE problems
      SET topicId = ?, nome = ?, url = ?, plataforma = ?, dificuldade = ?,
          dataResolucao = ?, status = ?, observacoes = ?, isStar = ?,
          conceitoPrincipal = ?, motivoEstrela = ?, dataUltimaRevisao = ?,
          qtdRevisoes = ?, proximaRevisao = ?
      WHERE id = ?
    `).run(
      updated.topicId,
      updated.nome,
      updated.url,
      updated.plataforma,
      updated.dificuldade,
      updated.dataResolucao,
      updated.status,
      updated.observacoes,
      updated.isStar,
      updated.conceitoPrincipal,
      updated.motivoEstrela,
      updated.dataUltimaRevisao,
      updated.qtdRevisoes,
      updated.proximaRevisao,
      id
    );

    res.json(formatProblem(updated));
  } catch (error) {
    console.error('Erro ao atualizar problema:', error);
    res.status(500).json({ error: 'Falha ao atualizar problema.' });
  }
});

app.delete('/api/problems/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM reviews WHERE problemId = ?').run(id);
    db.prepare('DELETE FROM problems WHERE id = ?').run(id);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Erro ao deletar problema:', error);
    res.status(500).json({ error: 'Falha ao excluir problema.' });
  }
});

app.patch('/api/problems/:id/star', (req, res) => {
  try {
    const { id } = req.params;
    const current = db.prepare('SELECT * FROM problems WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ error: 'Problema não encontrado.' });

    const newStar = current.isStar === 1 ? 0 : 1;
    const motivoEstrela = newStar === 1 ? (current.motivoEstrela || 'Problema canônico e educativo.') : current.motivoEstrela;
    const conceitoPrincipal = newStar === 1 ? (current.conceitoPrincipal || 'Conceito chave do tópico.') : current.conceitoPrincipal;

    db.prepare(`
      UPDATE problems
      SET isStar = ?, motivoEstrela = ?, conceitoPrincipal = ?
      WHERE id = ?
    `).run(newStar, motivoEstrela, conceitoPrincipal, id);

    const updated = {
      ...current,
      isStar: newStar,
      motivoEstrela,
      conceitoPrincipal,
    };

    res.json(formatProblem(updated));
  } catch (error) {
    console.error('Erro ao alternar estrela:', error);
    res.status(500).json({ error: 'Falha ao alternar estrela.' });
  }
});

// ----------------------------------------------------------------------
// REVISÕES
// ----------------------------------------------------------------------
app.post('/api/reviews', (req, res) => {
  try {
    const { id, problemId, userId, dataRevisao, resultado, observacoes, proximaRevisao } = req.body;
    const reviewId = id || `rev_${Date.now()}`;
    const newReview = {
      id: reviewId,
      problemId,
      userId: userId || 'usr_1',
      dataRevisao,
      resultado,
      observacoes: observacoes || '',
      proximaRevisao: proximaRevisao || null,
    };

    db.prepare(`
      INSERT INTO reviews (id, problemId, userId, dataRevisao, resultado, observacoes, proximaRevisao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      newReview.id,
      newReview.problemId,
      newReview.userId,
      newReview.dataRevisao,
      newReview.resultado,
      newReview.observacoes,
      newReview.proximaRevisao
    );

    // Atualiza o problema vinculado com a data da última revisão, qtd e próxima
    db.prepare(`
      UPDATE problems
      SET dataUltimaRevisao = ?,
          qtdRevisoes = qtdRevisoes + 1,
          proximaRevisao = ?
      WHERE id = ?
    `).run(newReview.dataRevisao, newReview.proximaRevisao, newReview.problemId);

    const updatedProblem = db.prepare('SELECT * FROM problems WHERE id = ?').get(newReview.problemId);

    res.status(201).json({
      review: newReview,
      problem: formatProblem(updatedProblem),
    });
  } catch (error) {
    console.error('Erro ao registrar revisão:', error);
    res.status(500).json({ error: 'Falha ao registrar revisão.' });
  }
});

// ----------------------------------------------------------------------
// RESET DO BANCO PARA DEMONSTRAÇÃO
// ----------------------------------------------------------------------
app.post('/api/reset', (req, res) => {
  try {
    runSeed(db, true);

    const user = db.prepare('SELECT * FROM users LIMIT 1').get();
    const areas = db.prepare('SELECT * FROM areas ORDER BY ordem ASC').all();
    const topics = db.prepare('SELECT * FROM topics').all();
    const rawProblems = db.prepare('SELECT * FROM problems ORDER BY dataResolucao DESC, dataCriacao DESC').all();
    const problems = rawProblems.map(formatProblem);
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY dataRevisao DESC').all();
    const activityData = db.prepare('SELECT date, count FROM activity ORDER BY date ASC').all();

    res.json({
      message: 'Banco de dados restaurado para os dados iniciais.',
      user,
      areas,
      topics,
      problems,
      reviews,
      activityData,
    });
  } catch (error) {
    console.error('Erro ao resetar banco:', error);
    res.status(500).json({ error: 'Falha ao resetar banco de dados.' });
  }
});

// Inicialização do servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CodeTrack Backend rodando na porta ${PORT}`);
});
