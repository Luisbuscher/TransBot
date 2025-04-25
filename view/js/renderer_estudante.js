document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Abre o modal de loading
    UIkit.modal('#loadingModal').show();

    // Aqui você coleta os dados do formulário
    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        sexo: document.getElementById('sexo').value,
        nomeMae: document.getElementById('nomeMae').value,
        naturalidade: document.getElementById('naturalidade').value,
        nascimento: document.getElementById('nascimento').value.replace(/\//g, ''),
        endereco: document.getElementById('endereco').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        cep: document.getElementById('cep').value,
        serie: document.getElementById('serie').value,
        grau: document.getElementById('grau').value,
        curso: document.getElementById('curso').value
    };

    try {
        // Envia os dados para o processo principal (via Electron IPC, por exemplo)
        await window.electronAPI.enviarFormulario(dados);

        UIkit.modal('#loadingModal').hide(); // Esconde o loading
        UIkit.notification({ message: 'Cadastro realizado com sucesso!', status: 'success' });

        document.getElementById('cadastroForm').reset(); // Limpa o formulário

        // Redireciona para o menu
        window.location.href = '../index.html'; // ou outro caminho dependendo da estrutura
    } catch (err) {
        UIkit.modal('#loadingModal').hide(); // Esconde o loading
        UIkit.notification({ message: 'Erro ao cadastrar: ' + err.message, status: 'danger' });
    }
});