# CodeTrack — Plataforma de Gestão de Estudos de Programação Competitiva

Aplicação web moderna, minimalista e intuitiva para estudantes e competidores de maratona de programação acompanharem sua evolução, organizarem problemas resolvidos e consolidarem sua biblioteca pessoal de **Problemas Estrela** com revisão periódica espaçada (até 2 meses).

---

## 🛠️ Arquitetura e Tecnologias Utilizadas

- **Frontend:**
  - **React 19** com **TypeScript**
  - **Vite** (com proxy inteligente `/api` integrado)
  - **Tailwind CSS**
  - **Lucide React**
  - **Recharts**
  - **React Router**

- **Backend:**
  - **Node.js** com **Express**
  - **SQLite** (`node:sqlite` nativo — persistência relacional sem complexidade de instalação)
  - Arquivo do banco: `./server/data/codetrack.sqlite`

- **Containers / DevOps:**
  - **Docker & Docker Compose** (orquestração de frontend, backend e volume persistente)

---

## 🚀 Como Executar o Projeto

Você pode rodar a aplicação em qualquer um dos dois modos:

### Modo 1: Com Docker Compose (Recomendado com Docker Desktop)

```bash
docker compose up --build
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001](http://localhost:3001)
- O banco SQLite é mantido no volume persistente `./server/data/codetrack.sqlite`.

Para parar:
```bash
docker compose down
```

---

### Modo 2: Sem Docker (Execução Local via Node.js)

Você pode subir tudo com um único comando na raiz:

```bash
npm run dev:all
```

Ou subir separadamente em dois terminais:

1. **Terminal 1 (Backend):**
   ```bash
   cd server
   npm run dev
   ```
2. **Terminal 2 (Frontend):**
   ```bash
   npm run dev
   ```

---

## 📱 Estrutura das Telas e Funcionalidades

1. **Dashboard (Visão Geral)**:
   - Saudação personalizada (*"Olá, John Doe 👋"*) e data atual.
   - **Stat Cards**: Problemas resolvidos, Problemas Estrela, Assuntos estudados e Taxa de conclusão.
   - **Progresso por área**: Barras de progresso com as cores e ícones de cada área.
   - **Atividade de estudos**: Gráfico interativo com alternância entre *Semana* e *Mês*.
   - **Atividade recente**: Tabela com problemas recentes, tags de tópicos, status e toggle de estrela.
   - **Problemas para revisar**: Card com alertas rápidos (*"Revisão pendente"*, *"Revisar hoje"*, *"Nunca revisado"*).
   - **Seu mapa de estudos (Heatmap)**: Grade estilo GitHub com dias ativos e intensidade.

2. **Meus Assuntos**:
   - Agrupamento expansível por área de conhecimento.
   - Criação de novas áreas e tópicos personalizados sincronizados com SQLite.

3. **Detalhes do Tópico**:
   - Página dedicada a cada assunto (ex: *Segment Tree*, *BFS*, *Knapsack*).
   - Abas com problemas do tópico, problemas estrela e estatísticas.

4. **Problemas Resolvidos**:
   - Tabela pesquisável em tempo real com filtros combinados.

5. **Problemas Estrela (Biblioteca Canônica)**:
   - Galeria com problemas essenciais e motivos educacionais.

6. **Sistema de Revisões (Regra de até 2 meses)**:
   - Divisão em revisões atrasadas/hoje, próximas e concluídas.

7. **Estatísticas & Evolução**:
   - Métricas gerais, gráficos de distribuição e ranking de estudo.

8. **Configurações**:
   - Perfil do estudante, exportação de backup e restauração de dados.

---

## ⚡ Busca Global com Atalho

- Clique no campo de busca do cabeçalho ou pressione **`⌘ + K`** (ou **`Ctrl + K`**) para abrir o buscador universal.
