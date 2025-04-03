document.getElementById('cadastroForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        nomeMae: document.getElementById('nomeMae').value,
        naturalidade: document.getElementById('naturalidade').value,
        nascimento: document.getElementById('nascimento').value,
        endereco: document.getElementById('endereco').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        cep: document.getElementById('cep').value,
        serie: document.getElementById('serie').value,
        grau: document.getElementById('grau').value,
        curso: document.getElementById('curso').value
    };

    window.electronAPI.enviarDados(dados);
});
