// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    enviarFormulario: (dados) => ipcRenderer.invoke('form:enviar', dados)
});
