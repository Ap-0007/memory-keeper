import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

async function getNotes() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function saveNotes(notes) {
  await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2));
}

program
  .name('memory-keeper')
  .description('A personal AI-powered journaling companion.')
  .version('1.0.0');

program
  .command('add <note...>')
  .description('Add a new journal entry')
  .action(async (noteWords) => {
    const text = noteWords.join(' ');
    const notes = await getNotes();
    notes.push({
      date: new Date().toISOString(),
      content: text
    });
    await saveNotes(notes);
    console.log(`✅ Added entry: "${text}"`);
  });

program
  .command('list')
  .description('List your recent journal entries')
  .action(async () => {
    const notes = await getNotes();
    if (notes.length === 0) {
      console.log("Your journal is empty. Add a note with 'node index.js add <text>'");
      return;
    }
    console.log(`\n📖 Your Journal (${notes.length} entries):\n`);
    notes.forEach((note, i) => {
      console.log(`[${new Date(note.date).toLocaleString()}]`);
      console.log(`${note.content}\n`);
    });
  });

program
  .command('analyze')
  .description('Ask the AI to analyze your recent journal entries for emotional insights')
  .action(async () => {
    const notes = await getNotes();
    if (notes.length === 0) {
      console.log("Your journal is empty! Add some entries before analyzing.");
      return;
    }

    console.log("🧠 Analyzing your journal entries with AI...\n");

    const entriesText = notes.map(n => `[${new Date(n.date).toLocaleString()}]: ${n.content}`).join('\n');
    
    const prompt = `You are a deeply empathetic psychological AI assistant.
Analyze the following journal entries from the user. Provide a short, insightful summary of their emotional state, any recurring themes, and a brief word of encouragement or advice.

Journal Entries:
${entriesText}`;

    try {
      const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2', // Using the default Ollama model for the user's system
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.response);
    } catch (err) {
      console.error("❌ Failed to reach the local Ollama AI model. Make sure Ollama is running.", err.message);
    }
  });

program.parse(process.argv);