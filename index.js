const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Register endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run(username, email, password, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Kayıt sırasında hata oluştu', error: err.message });
        }
        res.status(201).json({ message: 'Kayıt başarılı', userId: this.lastID });
    });
    stmt.finalize();
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
