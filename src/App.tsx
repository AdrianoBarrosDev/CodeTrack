import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { MySubjects } from './pages/MySubjects';
import { TopicDetail } from './pages/TopicDetail';
import { SolvedProblems } from './pages/SolvedProblems';
import { StarProblems } from './pages/StarProblems';
import { Reviews } from './pages/Reviews';
import { Statistics } from './pages/Statistics';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="assuntos" element={<MySubjects />} />
            <Route path="assuntos/:topicId" element={<TopicDetail />} />
            <Route path="problemas" element={<SolvedProblems />} />
            <Route path="estrelas" element={<StarProblems />} />
            <Route path="revisoes" element={<Reviews />} />
            <Route path="estatisticas" element={<Statistics />} />
            <Route path="configuracoes" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
