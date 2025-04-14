const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const CadastroEstudante = require('./controller/cadastroEstudante');
const CadastroIdoso = require('./controller/cadastroIdoso');
const CadastroPne = require('./controller/cadastroPne');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    mainWindow.loadFile('index.html');

    ipcMain.on('cadastrar-estudante', async (event, dados) => {
        const cadastro = new CadastroEstudante();
        cadastro.dados = dados;  // Define os dados coletados
        await cadastro.cadastrar();
    });
    ipcMain.handle('form:enviar', async (event, dados) => {
        try {
            // console.log('Dados recebidos do formulário:', dados);
            const cadastro = new CadastroEstudante();
            cadastro.dados = dados;
            await cadastro.cadastrar(); // Aqui deve estar o Puppeteer
        } catch (error) {
            console.error('Erro no Puppeteer:', error);
            throw error;
        }
    });

    ipcMain.handle('enviar-cadastro-idoso', async (event, dadosTexto) => {
        const cadastro = new CadastroIdoso(dadosTexto);
        await cadastro.cadastrar();
    });

    ipcMain.handle('enviar-cadastro-pne', async (event, dadosTexto) => {
        const cadastro = new CadastroPne(dadosTexto);
        await cadastro.cadastrar();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
