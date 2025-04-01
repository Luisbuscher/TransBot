const CadastroEstudante = require('./cadastroEstudante');

(async () => {
    const cadastro = new CadastroEstudante();
    await cadastro.cadastrar();
})();