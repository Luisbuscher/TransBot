const puppeteer = require('puppeteer');
require('dotenv').config();
const readline = require('readline');

const user = process.env.USER;
const password = process.env.PASSWORD;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Função para perguntar dados ao usuário
const perguntar = (pergunta) => new Promise(resolve => rl.question(pergunta, resolve));


(async () => {
    const nome = await perguntar('NOME: ');
    const cpf = await perguntar('CPF: ');
    const nomeMae = await perguntar('NOME DA MÃE: ');
    const naturalidade = await perguntar('NATURALIDADE: ');
    const estado = await perguntar('ESTADO (SIGLA): ');

    const endereco = await perguntar('ENDERECO: ');
    const numero = await perguntar('NUMERO: ');
    const bairro = await perguntar('BAIRRO: ');
    const cidade = await perguntar('CIDADE: ');
    const cep = await perguntar('CEP: ');
    const estado2 = await perguntar('ESTADO (SIGLA): ');

    rl.close(); // Fecha o readline após coletar os dados

    const browser = await puppeteer.launch({ headless: false }); // Modo visível para testes
    const page = await browser.newPage();

    // Lidar com alerta de confirmação antes de qualquer interação
    page.on('dialog', async dialog => {
        await dialog.accept(); // Fecha o alerta
    });

    await page.goto('https://max00642.itstransdata.com/TDMax/CadastroEstudantes.aspx');

    // Verifica se a tela de login aparece
    const loginSelector = '#ctl00_cphconteudo_login_UserName';
    const senhaSelector = '#ctl00_cphconteudo_login_Password';

    if (await page.$(loginSelector) !== null) {
        await page.type(loginSelector, user);
        await page.type(senhaSelector, password);

        // Pressiona Enter e aguarda a navegação ao mesmo tempo
        await Promise.all([
            page.keyboard.press('Enter'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }) // Aguarda a página carregar
        ]);
    }

    // Espera 1 segundos antes de continuar
    await new Promise(r => setTimeout(r, 500));

    // Espera os campos carregarem antes de tentar interagir
    await page.waitForSelector('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNome', { timeout: 1000 });

    // Preencher os dados pessoais do estudante
    await page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNome', nome); // NOME
    await page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtCpf', cpf); // CPF
    await page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtRg', cpf) // RG
    await page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtEmissor', 'SSP');

    // Selecionar opção de sexo (Exemplo: Masculino)
    await page.click('#ctl00_cphconteudo_fvCadastro_UcCadastros1_rbtSexo_0');
    await page.click('#ctl00_cphconteudo_fvCadastro_UcCadastros1_chkLimiteMensal');
    await page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtLimiteMensal', '50'); // Limite mensal
    await page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtDataNascEs', '01/01/2000');
    await page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNomeMaeEs', nomeMae); // Nome da mae
    await page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNaturalidade', naturalidade); // Naturalidade

    // Selecionar estado (Exemplo: São Paulo, que seria a opção correta no dropdown)
    await page.select('#ctl00_cphconteudo_fvCadastro_UcCadastros1_cmbEstado', estado); // Estado (sigla)

    // **PASSO 1: Modificar o atributo "selected" da opção diretamente**
    const optionXPath = '//*[@id="ctl00_cphconteudo_fvCadastro_UcCadastros1_cmbSubTipoPF"]/option[5]';

    // Modifica diretamente o atributo "selected" da opção desejada
    await page.evaluate((optionXPath) => {
        const option = document.evaluate(optionXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (option) {
            option.selected = true; // Marca a opção como selecionada
        }
    }, optionXPath);

    // **PASSO 2: Modificar o atributo "selected" da segunda opção (cmbPerfilCompraPF)**
    const optionXPath2 = '//*[@id="ctl00_cphconteudo_fvCadastro_UcCadastros1_cmbPerfilCompraPF"]/option[3]';

    // Modifica diretamente o atributo "selected" da segunda opção desejada
    await page.evaluate((optionXPath) => {
        const option = document.evaluate(optionXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (option) {
            option.selected = true; // Marca a opção como selecionada
        }
    }, optionXPath2);

    // PÁGINA ENDERECO:
    await page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvPrincipal_lvEnderecos');

    // Aguarda o carregamento da nova página/elemento após o clique
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await page.type('#ctl00_cphconteudo_UcEnderecos_txtDescricao', 'RESIDENCIAL'); // __PADRÃO__
    await page.type('#ctl00_cphconteudo_UcEnderecos_txtEndereco', 'Jardim Planalto'); // Endereco
    await page.type('#ctl00_cphconteudo_UcEnderecos_txtNumero', '1'); // Numero
    await page.type('#ctl00_cphconteudo_UcEnderecos_txtBairro', 'Primavera'); // Bairro
    await page.type('#ctl00_cphconteudo_UcEnderecos_txtCidade', 'Esteio'); // Cidade
    await page.type('#ctl00_cphconteudo_UcEnderecos_txtCep', '992707350'); // Cep
    await page.select('#ctl00_cphconteudo_UcEnderecos_cmbEstado', 'RS'); // Estado

    // PAGINA CONTATOS:
    await page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvEnderecos_lvContatos');

    // Aguarda o carregamento da nova página/elemento após o clique
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await page.type('#ctl00_cphconteudo_UCContatos1_txtDescricao', 'NI'); // __PADRÃO__
    await page.type('#ctl00_cphconteudo_UCContatos1_txtCelular', 'NI'); // CELULAR

    // PAGINA ESCOLA:
    await page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvContatos_lvEscolas');

    // Aguarda o carregamento da nova página/elemento após o clique
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await page.type('#ctl00_cphconteudo_UcEscolas1_UcBuscaCadastro_txtBusca', 'ESCOLA'); // __PADRÃO__
    page.keyboard.press('Enter');

    // Aguarda o carregamento
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await page.type('#ctl00_cphconteudo_UcEscolas1_txtSerie', '1'); // Série
    await page.type('#ctl00_cphconteudo_UcEscolas1_txtCurso', 'Ensino medio'); // Curso
    await page.click('#ctl00_cphconteudo_UcEscolas1_chkPeriodo_0'); // Matutino
    await page.click('#ctl00_cphconteudo_UcEscolas1_chkPeriodo_1'); // Vesperino
    await page.type('#ctl00_cphconteudo_UcEscolas1_txtMatricula', 'NI'); // __PADRÃO__

    // Função para formatar a data no formato ddmmyyyy
    const formatDate = date => `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${date.getFullYear()}`;

    // Preenche a Data de Início com a data atual
    const today = new Date();
    await page.type('#ctl00_cphconteudo_UcEscolas1_txtDataInicio', formatDate(today));

    // Preenche a Data de Término com a data de 6 meses a frente
    today.setMonth(today.getMonth() + 6);
    await page.type('#ctl00_cphconteudo_UcEscolas1_txtDataTermino', formatDate(today));

    // PAGINA HORARIOS:
    await page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvEscolas_lvHorarios');

    // Aguarda o carregamento da nova página/elemento após o clique
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await page.select('#ctl00_cphconteudo_UcTabelaHorarios1_cmbPadraoHorario', '5');

    // Aguarda o carregamento da nova página/elemento após o clique
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await page.type('#ctl00_cphconteudo_UcTabelaHorarios1_gvHorario_ctl02_lbeQtdAcesso', '255');
    await page.type('#ctl00_cphconteudo_UcTabelaHorarios1_gvHorario_ctl03_lbeQtdAcesso', '255');

    await page.evaluate(() => {
        for (let i = 2; i <= 8; i++) {
            document.querySelector(`#ctl00_cphconteudo_UcTabelaHorarios1_gvHorario_ctl0${i}_lbeQtdAcesso`).value = '';
        }
    });
    for (let i = 2; i <= 8; i++) {
        await page.type(`#ctl00_cphconteudo_UcTabelaHorarios1_gvHorario_ctl0${i}_lbeQtdAcesso`, '255');
    }

    // PAGINA LINHAS:
    await page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvHorarios_lvLinhas');

    await page.waitForNavigation({ waitUntil: 'networkidle0' }); // Aguarda até que a navegação termine

    await page.click('#ctl00_cphconteudo_UcVinculaGruposLinhas1_btnAdicionar');

    await page.waitForNavigation({ waitUntil: 'networkidle0' }); // Aguarda até que a navegação termine

    await page.select('#ctl00_cphconteudo_UcVinculaGruposLinhas1_lstDisponiveis', '1');
    await page.click('#ctl00_cphconteudo_UcVinculaGruposLinhas1_btnAdicionaGrupo');

    // Manter navegador aberto para testar
    // await browser.close();
})();