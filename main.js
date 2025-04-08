const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const CadastroEstudante = require('./cadastroEstudante');

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
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
