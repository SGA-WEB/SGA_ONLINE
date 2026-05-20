export default async function buscarDados(query) {
    try {
        const response = await fetch(`http://localhost:3000/api/${query}`);
        
        // Se a rota não existir ou der erro no servidor
        if (!response.ok) {
            console.warn(`Atenção: Rota /api/${query} retornou erro ${response.status}`);
            return []; 
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error(`O servidor não retornou JSON para /api/${query}. Verifique o endpoint.`);
            return [];
        }

        const result = await response.json();

        // Padronização do retorno: Garante que sempre seja um Array
        if (Array.isArray(result)) return result;
        return result.itens || result.dados || result.clientes || result.usuarios || [];

    } catch (err) {
        console.error('Erro de conexão ou processamento:', err);
        return [];
    }
}
