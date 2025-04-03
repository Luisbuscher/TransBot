const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    enviarDados: (dados) => ipcRenderer.send('cadastrar-estudante', dados)
});
