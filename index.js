const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./datebase'); // doğru dosya adı
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors()); // tüm frontend portlarına izin verir
app.use(bodyParser.json());

// Register endpoint
app.post('/apiregister', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
        stmt.run(username, email, hashedPassword, function(err) {
            if (err) {
                return res.status(500).json({ message: 'Kayıt sırasında hata oluştu', error: err.message });
            }
            res.status(201).json({ message: 'Kayıt başarılı', userId: this.lastID });
        });
        stmt.finalize();
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
