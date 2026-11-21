import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '../data/codetrack.sqlite');

// Garante que o diretório do banco exista
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);

// Configurações do SQLite
db.exec('PRAGMA foreign_keys = ON;');

// Inicialização das tabelas
export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      cargo TEXT NOT NULL,
      avatarUrl TEXT,
      metaGlobal INTEGER NOT NULL DEFAULT 200
    );

    CREATE TABLE IF NOT EXISTS areas (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT,
      ordem INTEGER NOT NULL DEFAULT 1,
      cor TEXT NOT NULL,
      icone TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      areaId TEXT NOT NULL,
      userId TEXT NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT,
      metaProblemas INTEGER DEFAULT 10,
      nivelDominio TEXT DEFAULT 'Iniciante',
      dataCriacao TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS problems (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      topicId TEXT NOT NULL,
      nome TEXT NOT NULL,
      url TEXT NOT NULL,
      plataforma TEXT NOT NULL,
      dificuldade TEXT,
      dataResolucao TEXT NOT NULL,
      status TEXT NOT NULL,
      observacoes TEXT,
      isStar INTEGER NOT NULL DEFAULT 0,
      conceitoPrincipal TEXT,
      motivoEstrela TEXT,
      dataUltimaRevisao TEXT,
      qtdRevisoes INTEGER DEFAULT 0,
      proximaRevisao TEXT,
      dataCriacao TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      problemId TEXT NOT NULL,
      userId TEXT NOT NULL,
      dataRevisao TEXT NOT NULL,
      resultado TEXT NOT NULL,
      observacoes TEXT,
      proximaRevisao TEXT
    );

    CREATE TABLE IF NOT EXISTS activity (
      date TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    );
  `);
}
