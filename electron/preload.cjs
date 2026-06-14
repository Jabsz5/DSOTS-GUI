const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  uploadToYouTube: (payload) => ipcRenderer.invoke("youtube-upload", payload),
  setYouTubeThumbnail: (payload) => ipcRenderer.invoke("youtube-thumbnail", payload),
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
});
