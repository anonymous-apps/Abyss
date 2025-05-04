const fs = require('fs-extra');
const path = require('path');

const copySqlite = async () => {
    fs.mkdirSync(path.join(__dirname, '..', 'build'), { recursive: true });
    const sqlitePath = path.join(__dirname, '..', '..', '..', 'node_modules', 'sqlite3', 'build', 'Release', 'node_sqlite3.node');
    const sqliteDest = path.join(__dirname, '..', 'build', 'node_sqlite3.node');
    console.log('Copying SQLite from', sqlitePath, 'to', sqliteDest);
    await fs.copy(sqlitePath, sqliteDest);
};

copySqlite();
