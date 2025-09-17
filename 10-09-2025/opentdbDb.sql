DROP TABLE IF EXISTS QuestionAnswer;
DROP TABLE IF EXISTS Answer;
DROP TABLE IF EXISTS Question;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Type;
DROP TABLE IF EXISTS Difficulty;

-- Tabelle für Kategorien
CREATE TABLE Category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Tabelle für Fragetypen
CREATE TABLE Type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabelle für Schwierigkeitsgrade
CREATE TABLE Difficulty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level VARCHAR(50) NOT NULL UNIQUE
);

-- Tabelle für Fragen
CREATE TABLE Question (
    id VARCHAR(36) PRIMARY KEY,
    typeId INTEGER NOT NULL,
    difficultyId INTEGER NOT NULL,
    categoryId INTEGER NOT NULL,
    question TEXT NOT NULL,
    FOREIGN KEY (typeId) REFERENCES Type(id),
    FOREIGN KEY (difficultyId) REFERENCES Difficulty(id),
    FOREIGN KEY (categoryId) REFERENCES Category(id)
);

-- Tabelle für Antworten (jede Antwort nur 1x gespeichert)
CREATE TABLE Answer (
    id VARCHAR(36) PRIMARY KEY,
    answer TEXT NOT NULL
);

-- Verknüpfungstabelle zwischen Frage und Antwort
CREATE TABLE QuestionAnswer (
    questionId VARCHAR(36) NOT NULL,
    answerId VARCHAR(36) NOT NULL,
    isCorrect BOOLEAN NOT NULL,
    PRIMARY KEY (questionId, answerId),
    FOREIGN KEY (questionId) REFERENCES Question(id) ON DELETE CASCADE,
    FOREIGN KEY (answerId) REFERENCES Answer(id) ON DELETE CASCADE
);