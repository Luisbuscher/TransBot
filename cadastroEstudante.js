const puppeteer = require('puppeteer-core');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Garante que o executavel achara o .env
const readline = require('readline');
const { app } = require('electron');

class CadastroEstudante {
    constructor() {
        this.user = process.env.USER;
        this.password = process.env.PASSWORD;
        this.link_estudante = process.env.LINK_ESTUDANTE;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    perguntar(pergunta) {
        return new Promise(resolve => this.rl.question(pergunta, resolve));
    }

    async coletarDados() {

        this.dadosTeste = {
            nome: "tst", cpf: "90909090909", nomeMae: "tst", naturalidade: "tst",
            nascimento: "01010101", endereco: "tst", numero: "tst", bairro: "tst", cidade: "tst", cep: "99999999", serie: "1", grau: "1", curso: "tst"
        }

        this.dados;

        this.rl.close();
    }

    async iniciarNavegador() {
        const chromePath = path.join(
            app.isPackaged ? process.resourcesPath : __dirname,
            'chromium',
            'chrome-win64',
            'chrome.exe'
        );
        this.browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: false, // True = nao mostra janela chrome; False mostra
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        this.page.on('dialog', async dialog => await dialog.accept()); // Fecha alertas
    }

    async login() {
        await this.page.goto(this.link_estudante);

        if (await this.page.$('#ctl00_cphconteudo_login_UserName') !== null) {
            await this.page.type('#ctl00_cphconteudo_login_UserName', this.user);
            await this.page.type('#ctl00_cphconteudo_login_Password', this.password);
            await Promise.all([
                this.page.keyboard.press('Enter'),
                this.page.waitForNavigation({ waitUntil: 'networkidle2' })
            ]);
        }
    }

    async preencherFormulario() {
        const { nome, cpf, nomeMae, naturalidade, nascimento, endereco, numero, bairro, cidade, cep, serie, grau, curso } = this.dados;

        // Espera os campos carregarem antes de interagir
        await this.page.waitForSelector('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNome');

        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNome', nome);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtCpf', cpf);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtRg', cpf);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtEmissor', 'SSP');
        await this.page.click('#ctl00_cphconteudo_fvCadastro_UcCadastros1_rbtSexo_0');
        await this.page.click('#ctl00_cphconteudo_fvCadastro_UcCadastros1_chkLimiteMensal');
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtLimiteMensal', '50'); // Limite mensal
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtDataNascEs', nascimento);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNomeMaeEs', nomeMae);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNaturalidade', naturalidade);
        await this.page.select('#ctl00_cphconteudo_fvCadastro_UcCadastros1_cmbEstado', 'RS');

        // SUB-TIPO
        const optionXPath = '//*[@id="ctl00_cphconteudo_fvCadastro_UcCadastros1_cmbSubTipoPF"]/option[5]';
        // Modifica diretamente o atributo "selected" da opção desejada
        await this.page.evaluate((optionXPath) => {
            const option = document.evaluate(optionXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (option) {
                option.selected = true; // Marca a opção como selecionada
            }
        }, optionXPath);

        // PERFIL-COMPRAS
        const optionXPath2 = '//*[@id="ctl00_cphconteudo_fvCadastro_UcCadastros1_cmbPerfilCompraPF"]/option[3]';
        // Modifica diretamente o atributo "selected" da segunda opção desejada
        await this.page.evaluate((optionXPath) => {
            const option = document.evaluate(optionXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (option) {
                option.selected = true; // Marca a opção como selecionada
            }
        }, optionXPath2);

        // PÁGINA ENDERECO:
        await this.page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvPrincipal_lvEnderecos');
        // Aguarda o carregamento
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });

        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtDescricao', 'RESIDENCIAL'); // __PADRÃO__
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtEndereco', endereco); // Endereco
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtNumero', numero); // Numero
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtBairro', bairro); // Bairro
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtCidade', cidade); // Cidade
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtCep', cep); // Cep
        await this.page.select('#ctl00_cphconteudo_UcEnderecos_cmbEstado', 'RS'); // Estado

        await this.page.click('#ctl00_cphconteudo_UcEnderecos_UcControleNavegacao_btnInserir'); // Inclui

        // PAGINA CONTATOS:
        await this.page.waitForSelector('#ctl00_cphconteudo_ctl00_cphconteudo_lvEnderecos_lvContatos', { visible: true });
        await this.page.focus('#ctl00_cphconteudo_ctl00_cphconteudo_lvEnderecos_lvContatos');
        await this.page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvEnderecos_lvContatos');
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });

        await this.page.type('#ctl00_cphconteudo_UCContatos1_txtDescricao', 'NI'); // __PADRÃO__
        await this.page.type('#ctl00_cphconteudo_UCContatos1_txtCelular', 'NI'); // CELULAR

        await this.page.click('#ctl00_cphconteudo_UCContatos1_UcControleNavegacao_btnInserir'); // Inclui

        // PAGINA ESCOLA:
        // Aguarda a navegação causada pelo clique (recarregamento)
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await this.page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvContatos_lvEscolas');
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        await this.page.type('#ctl00_cphconteudo_UcEscolas1_UcBuscaCadastro_txtBusca', 'ESCOLA'); // __PADRÃO__
        this.page.keyboard.press('Enter');
        // Aguarda o carregamento
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
        await this.page.type('#ctl00_cphconteudo_UcEscolas1_txtSerie', serie); // Série
        await this.page.select('#ctl00_cphconteudo_UcEscolas1_ddlGrau', grau); // Grau
        await this.page.type('#ctl00_cphconteudo_UcEscolas1_txtCurso', curso); // Curso
        await this.page.click('#ctl00_cphconteudo_UcEscolas1_chkPeriodo_0'); // Matutino
        await this.page.click('#ctl00_cphconteudo_UcEscolas1_chkPeriodo_1'); // Vesperino
        await this.page.type('#ctl00_cphconteudo_UcEscolas1_txtMatricula', 'NI'); // __PADRÃO__

        // Função para formatar a data no formato ddmmyyyy
        const formatDate = date => `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${date.getFullYear()}`;
        // Preenche a Data de Início com a data atual
        const today = new Date();
        await this.page.type('#ctl00_cphconteudo_UcEscolas1_txtDataInicio', formatDate(today));
        // Preenche a Data de Término com a data de 6 meses a frente
        today.setMonth(today.getMonth() + 6);
        await this.page.type('#ctl00_cphconteudo_UcEscolas1_txtDataTermino', formatDate(today));

        await this.page.click('#ctl00_cphconteudo_UcEscolas1_UcControleNavegacao1_btnInserir'); // Inclui

        // PAGINA HORARIOS:
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await this.page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvEscolas_lvHorarios');
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        await this.page.select('#ctl00_cphconteudo_UcTabelaHorarios1_cmbPadraoHorario', '5');

        // Aguarda o carregamento da pagina
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
        await this.page.evaluate(() => {
            for (let i = 2; i <= 8; i++) {
                document.querySelector(`#ctl00_cphconteudo_UcTabelaHorarios1_gvHorario_ctl0${i}_lbeQtdAcesso`).value = '';
            }
        });
        for (let i = 2; i <= 8; i++) {
            await this.page.type(`#ctl00_cphconteudo_UcTabelaHorarios1_gvHorario_ctl0${i}_lbeQtdAcesso`, '4');
        }

        // PAGINA LINHAS:
        await this.page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvHorarios_lvLinhas');
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' }); // Aguarda até que a navegação termine
        await this.page.click('#ctl00_cphconteudo_UcVinculaGruposLinhas1_btnAdicionar');
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' }); // Aguarda até que a navegação termine

        await this.page.waitForSelector('#ctl00_cphconteudo_UcVinculaGruposLinhas1_lstDisponiveis', { visible: true });
        await this.page.select('#ctl00_cphconteudo_UcVinculaGruposLinhas1_lstDisponiveis', '1'); // Substitua '1' pelo valor correto da opção
        await this.page.click('#ctl00_cphconteudo_UcVinculaGruposLinhas1_btnAdicionaGrupo');

    }

    async fechar() {
        await this.browser.close();
    }

    async cadastrar() {
        await this.coletarDados();
        await this.iniciarNavegador();
        await this.login();
        await this.preencherFormulario();
        //await this.fechar();
    }
}

module.exports = CadastroEstudante;