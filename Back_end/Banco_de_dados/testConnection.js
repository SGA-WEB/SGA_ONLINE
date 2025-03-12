const { Pool } = require('pg');


const pool = new Pool({
    connectionString: 'postgres://neondb_owner:npg_Y3ZNL6fxehGI@ep-small-bar-a8bydmrx-pooler.eastus2.azure.neon.tech:5432/neondb?sslmode=require',
  });

// Teste de conexão e consulta dos dados da tabela
async function testConnection() {
    try {
        const client = await pool.connect();  // Conecta ao banco
        console.log('Conexão com o banco de dados estabelecida com sucesso!');

        // Consulta os dados da tabela usuarios que se você colocar sga.usuario não aparece mas apenas usuario como está, sim.
        const result = await client.query('SELECT * FROM usuario');

        // Imprime os dados no console
        console.log('Dados da tabela usuario:', result.rows);

        client.release();  // Libera a conexão após o teste
    } catch (err) {
        console.error('Erro ao conectar ou consultar o banco de dados:', err);
    } finally {
        await pool.end();  // Encerra 
    }
}

// Código usado com o node para testar conexão 
testConnection();
