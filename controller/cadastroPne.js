const puppeteer = require('puppeteer-core');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { app } = require('electron');

class CadastroPne {
    constructor(dadosTexto, sexo) {
        this.dadosTexto = dadosTexto; // String colada da planilha, etc
        this.sexo = sexo;
        this.user = process.env.USER;
        this.password = process.env.PASSWORD;
        this.link_idoso = process.env.LINK_IDOSO; // precisa estar no .env
    }

    parseDadosIdoso() {
        const partes = this.dadosTexto.split('\t'); // ou use .split(';') dependendo do formato

        this.dados = {
            status: partes[0],
            numero: partes[1],
            nome: partes[2],
            rg: partes[3],
            cpf: partes[4],
            nascimento: partes[5].replace(/\//g, ''),
            nomePai: partes[6],
            nomeMae: partes[7],
            cidadeNascimento: partes[8],
            endereco: partes[10],
            bairro: partes[11],
            cep: partes[12],
            cidadeAtual: partes[13],
            acompanhante: partes[14],
            contato: partes[15],
            vencimento: partes[17].trim().replace(/\//g, '')
        };
    }

    async iniciarNavegador() {
        const chromePath = path.join(
            app.isPackaged
                ? path.join(process.resourcesPath, 'chrome-win64')
                : path.join(__dirname, '..', 'chrome-win64'),
            'chrome.exe'
        );
        this.browser = await puppeteer.launch({
            executablePath: chromePath,
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
            defaultViewport: null // Usa o tamanho completo da janela
        });
        this.page = await this.browser.newPage();
        this.page.on('dialog', async dialog => await dialog.accept());
    }

    async login() {
        await this.page.goto(this.link_idoso);
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
        var acompanhante;
        var qtd_acesso;

        // Definindo acompanhante.
        if (this.dados.acompanhante == 'SIM') { acompanhante = '3'; qtd_acesso = '8' } else { acompanhante = '2'; qtd_acesso = '4' }

        // Espera os campos carregarem antes de interagir
        await this.page.waitForSelector('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNome');

        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNome', this.dados.nome);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtCpf', this.dados.cpf);
        if (this.dados.rg == '') {
            await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtRg', this.dados.cpf);
        } else {
            await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtRg', this.dados.rg);
        }
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtEmissor', 'SSP');
        await this.page.click(`#ctl00_cphconteudo_fvCadastro_UcCadastros1_rbtSexo_${this.sexo}`);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtDataNascimentoGt', this.dados.nascimento);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtVencimentoCartao', this.dados.vencimento);
        await this.page.type('#ctl00_cphconteudo_fvCadastro_UcCadastros1_txtNomeMaeGt', this.dados.nomeMae);

        // // SUB-TIPO
        await this.page.select('#ctl00_cphconteudo_fvCadastro_UcCadastros1_cmbSubTipoPF', acompanhante);

        // Aguarda o carregamento
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        // ENDERECO
        // Aguarda o carregamento
        await this.page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvPrincipal_lvEnderecos');
        // Espera aparecer o elemento aguardado
        await this.page.waitForSelector('#ctl00_cphconteudo_UcEnderecos_btnNovo');

        // Clica em novo endereco
        await this.page.click('#ctl00_cphconteudo_UcEnderecos_btnNovo');
        // Espera aparecer o elemento aguardado
        await this.page.waitForSelector('#ctl00_cphconteudo_UcEnderecos_txtDescricao');

        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtDescricao', 'RESIDENCIAL'); // __PADRÃO__
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtEndereco', this.dados.endereco); // Endereco
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtNumero', '0'); // Numero
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtBairro', this.dados.bairro); // Bairro
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtCidade', this.dados.cidadeAtual); // Cidade
        await this.page.type('#ctl00_cphconteudo_UcEnderecos_txtCep', this.dados.cep); // Cep
        await this.page.select('#ctl00_cphconteudo_UcEnderecos_cmbEstado', 'RS'); // Estado

        await this.page.click('#ctl00_cphconteudo_UcEnderecos_UcControleNavegacao_btnInserir'); // Inclui

        // Contato
        await this.page.waitForSelector('#ctl00_cphconteudo_ctl00_cphconteudo_lvEnderecos_lvContatos', { visible: true });
        await this.page.focus('#ctl00_cphconteudo_ctl00_cphconteudo_lvEnderecos_lvContatos');
        await this.page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvEnderecos_lvContatos');

        // Aguarda o carregamento
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        await this.page.click('#ctl00_cphconteudo_UCContatos1_btnNovo');

        // Espera os campos carregarem antes de interagir
        await this.page.waitForSelector('#ctl00_cphconteudo_UCContatos1_txtDescricao');

        await this.page.type('#ctl00_cphconteudo_UCContatos1_txtDescricao', 'PESSOAL'); // __PADRÃO__
        await this.page.type('#ctl00_cphconteudo_UCContatos1_txtCelular', this.dados.contato); // CELULAR

        await this.page.click('#ctl00_cphconteudo_UCContatos1_UcControleNavegacao_btnInserir'); // Inclui

        // Horarios
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await this.page.click('#ctl00_cphconteudo_ctl00_cphconteudo_lvContatos_lvHorarios');
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
            await this.page.type(`#ctl00_cphconteudo_UcTabelaHorarios1_gvHorario_ctl0${i}_lbeQtdAcesso`, qtd_acesso);
        }

    }

    async fechar() {
        await this.browser.close();
    }

    async cadastrar() {
        this.parseDadosIdoso();
        await this.iniciarNavegador();
        await this.login();
        await this.preencherFormulario();
        // await this.fechar(); // Habilite se quiser fechar automático no final
    }
}

module.exports = CadastroPne;