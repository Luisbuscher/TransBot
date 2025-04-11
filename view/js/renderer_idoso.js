// renderer_idoso.js

document.addEventListener('DOMContentLoaded', () => {
    const formIdoso = document.getElementById('cadastroIdosoForm');

    if (formIdoso) {
        formIdoso.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dadosTexto = document.getElementById('dadosIdoso').value;

            try {
                await window.electronAPI.enviarCadastroIdoso(dadosTexto);
                UIkit.notification({
                    message: 'Cadastro de idoso realizado com sucesso!',
                    status: 'success'
                });
                formIdoso.reset();
            } catch (err) {
                UIkit.notification({
                    message: 'Erro ao cadastrar idoso: ' + err.message,
                    status: 'danger'
                });
            }
        });
    }
});
