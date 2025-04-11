const puppeteer = require('puppeteer-core');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { app } = require('electron');

class CadastroIdoso {
    constructor(dadosTexto) {
        this.dadosTexto = dadosTexto; // String colada da planilha, etc
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
            nascimento: partes[5],
            nomePai: partes[6],
            nomeMae: partes[7],
            cidadeNascimento: partes[8],
            endereco: partes[9],
            bairro: partes[10],
            cep: partes[11],
            cidadeAtual: partes[12],
            contato: partes[13],
            nacionalidade: partes[14],
            estadoCivil: partes[15],
            vencimento: partes[16]
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
            args: ['--no-sandbox', '--disable-setuid-sandbox']
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
        const {
            nome, rg, cpf, nascimento, nomeMae, nomePai,
            cidadeNascimento, endereco, bairro, cep, cidadeAtual,
            contato, nacionalidade, estadoCivil
        } = this.dados;

        console.log(this.dados)

        // await this.page.waitForSelector('#ctl00_cphconteudo_fvCadastro_txtNome');
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtNome', nome);
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtCpf', cpf);
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtRg', rg);
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtOrgao', 'SSP');
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtDataNascimento', nascimento);
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtNomeMae', nomeMae);
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtNomePai', nomePai);
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtNaturalidade', cidadeNascimento);
        // await this.page.select('#ctl00_cphconteudo_fvCadastro_ddlNacionalidade', nacionalidade);
        // await this.page.select('#ctl00_cphconteudo_fvCadastro_ddlEstadoCivil', estadoCivil);

        // // Endereço
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtEndereco', endereco);
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtBairro', bairro);
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtCidade', cidadeAtual);
        // await this.page.select('#ctl00_cphconteudo_fvCadastro_ddlEstado', 'RS');
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtCep', cep);

        // // Contato
        // await this.page.type('#ctl00_cphconteudo_fvCadastro_txtTelefone', contato);

        // // Marca checkboxes de benefício ou outra regra aqui, se necessário.
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

module.exports = CadastroIdoso;