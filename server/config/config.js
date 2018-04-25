// ============================
// Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
// Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
// Vencimiento del token
// ============================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ============================
// SEED de autentificación
// ============================
process.env.SEED = process.env.SEED || 'a6b32e7a8677';

// ============================
// Database
// ============================
let urlDatabase;
if (process.env.NODE_ENV === 'dev') {
    urlDatabase = 'mongodb://localhost:27017/cafe'
} else {
    urlDatabase = process.env.MONGO_URI;
}

process.env.URLDB = urlDatabase;