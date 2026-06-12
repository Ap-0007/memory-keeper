# Memory Keeper 🧠

A personal AI-powered journaling companion that uses natural language processing to analyze and provide insights on your thoughts and emotions. 

It stores your journal entries privately on your local machine and uses your local **Ollama** AI engine to analyze your mental health and recurring themes.

## Setup

1. Make sure you have Node.js installed.
2. Clone this repository.
3. Run `npm install` to install dependencies.
4. Make sure you have Ollama installed and running locally with the `llama3.2` model.

## Usage

Add a new journal entry:
```bash
node index.js add "I had a surprisingly productive day today, but I still feel a bit anxious about tomorrow's presentation."
```

List your past entries:
```bash
node index.js list
```

Ask the AI for a psychological summary and insights on your recent entries:
```bash
node index.js analyze
```