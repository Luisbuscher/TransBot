// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    enviarFormulario: (dados) => ipcRenderer.invoke('form:enviar', dados),
    enviarCadastroIdoso: (dadosTexto, sexo) => ipcRenderer.invoke('enviar-cadastro-idoso', { dadosTexto, sexo }),
    enviarCadastroPne: (dadosTexto, sexo) => ipcRenderer.invoke('enviar-cadastro-pne', {dadosTexto, sexo})
});
