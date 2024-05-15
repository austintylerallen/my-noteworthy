const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Develop/public'))); // pain to get the correct path i always mess it up somehow

// API Routes
app.get('/api/notes', (req, res) => {
  console.log('GET /api/notes');
  fs.readFile(path.join(__dirname, 'Develop/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read notes data', err);
      return res.status(500).json({ error: 'Failed to read notes data' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = { id: Date.now().toString(), ...req.body };
  console.log('POST /api/notes', newNote);

  fs.readFile(path.join(__dirname, 'Develop/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read notes data', err);
      return res.status(500).json({ error: 'Failed to read notes data' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'Develop/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error('Failed to save new note', err);
        return res.status(500).json({ error: 'Failed to save new note' });
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  console.log('DELETE /api/notes/:id', noteId);

  fs.readFile(path.join(__dirname, 'Develop/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read notes data', err);
      return res.status(500).json({ error: 'Failed to read notes data' });
    }

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile(path.join(__dirname, 'Develop/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error('Failed to delete note', err);
        return res.status(500).json({ error: 'Failed to delete note' });
      }
      res.status(204).end();
    });
  });
});

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
