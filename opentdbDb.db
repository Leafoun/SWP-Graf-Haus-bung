DROP TABLE IF EXISTS QuestionAnswer;
DROP TABLE IF EXISTS Answer;
DROP TABLE IF EXISTS Question;

-- Tabelle für Fragen
CREATE TABLE Question (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    category VARCHAR(255) NOT NULL,
    question TEXT NOT NULL
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