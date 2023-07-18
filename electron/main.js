const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

const createWindow = () => {
  let fuckyouall = (window) => {
    window.webContents.setWindowOpenHandler((details) => {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          'width': 1280,
          'height': 700,
        }
      }
    })
  }
  mainWindow = new BrowserWindow({ width: 1280, height: 700, show: false });
  mainWindow.loadURL(
    !app.isPackaged
      ? process.env.ELECTRON_START_URL
      : url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
      })
  )
  fuckyouall(mainWindow)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});