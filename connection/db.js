// impoty podygtrd poll
const { Pool } = require('pg')

// setup connection pool
const dbPool = new Pool({
    database: 'personal_web_b30',
    port: 5432,
    user: 'postgres',
    password: ' '
})


module.exports = dbPool;







