export default async function buscarDados(query) {
    try {
        const response = await fetch(`https://sga-online-api.onrender.com/api/${query}`, {
            method: 'GET',
            credentials: 'include'
        });

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

        if (Array.isArray(result)) return result;
        return result.itens || result.dados || result.clientes || result.usuarios || [];

    } catch (err) {
        console.error('Erro de conexão ou processamento:', err);
        return [];
    }
}
