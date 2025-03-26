// Versão 100% compatível com seu HTML
(function() {
    'use strict';
    
    // 1. Função de preenchimento com IDs CORRETOS
    window.preencherCampos = function(usuario) {
        const campos = {
            'campo_editar_nome': usuario?.nome,
            'campo_editar_email': usuario?.email,
            'campo_editar_fone': usuario?.celular, // Note que usamos celular aqui
            'senha_usuario': usuario?.senha
        };
        
        Object.entries(campos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = valor || '';
                console.log(`Campo ${id} preenchido:`, valor);
            } else {
                console.warn(`Elemento não encontrado: #${id}`);
            }
        });
    };

    // 2. Função de carregamento
    window.carregarUsuarios = async function() {
        try {
            console.log('Iniciando carregamento...');
            const response = await fetch('http://localhost:3000/usuarios');
            
            if (!response.ok) throw new Error('Erro na API: ' + response.status);
            
            const data = await response.json();
            console.log('Dados recebidos:', data);
            
            if (data?.length > 0) {
                preencherCampos(data[0]);
            } else {
                console.warn('Nenhum usuário encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar:', error);
        }
    };

    // 3. Auto-inicialização
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM carregado - Funções disponíveis:');
        console.log('- carregarUsuarios()');
        console.log('- preencherCampos(usuario)');
        
        // Opcional: auto-carrega o primeiro usuário
        carregarUsuarios();
    });
})();