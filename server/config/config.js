// ============================
// Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
// Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
// Database
// ============================
let urlDatabase;
if (process.env.NODE_ENV === 'dev') {
    urlDatabase = 'mongodb://localhost:27017/cafe'
} else {
    urlDatabase = 'mongodb://cafe_user:abcd.1234@ds013202.mlab.com:13202/cafe'
}

process.env.URLDB = urlDatabase;