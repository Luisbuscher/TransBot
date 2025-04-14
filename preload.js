// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    enviarFormulario: (dados) => ipcRenderer.invoke('form:enviar', dados),
    enviarCadastroIdoso: (dadosTexto) => ipcRenderer.invoke('enviar-cadastro-idoso', dadosTexto),
    enviarCadastroPne: (dadosTexto) => ipcRenderer.invoke('enviar-cadastro-pne', dadosTexto)
});
