// renderer_pne.js

document.addEventListener('DOMContentLoaded', () => {
    const formPne = document.getElementById('cadastroPneForm');

    if (formPne) {
        formPne.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dadosTexto = document.getElementById('dadosPne').value;

            try {
                await window.electronAPI.enviarCadastroPne(dadosTexto);
                UIkit.notification({
                    message: 'Cadastro de pne realizado com sucesso!',
                    status: 'success'
                });
                formPne.reset();
            } catch (err) {
                UIkit.notification({
                    message: 'Erro ao cadastrar PNE: ' + err.message,
                    status: 'danger'
                });
            }
        });
    }
});
