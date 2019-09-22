'use strict'

import {
  app,
  BrowserWindow,
  shell,
  ipcMain
} from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  // 实例化窗口
  mainWindow = new BrowserWindow({
    center: true,
    frame: false,
    transparent: false,
    thickFrame: true,
    hasShadow: true,
    height: 680,
    width: 960,
    minHeight: 680,
    minWidth: 960,
    title: 'Code Snippet Pro',
    titleBarStyle: 'customButtonsOnHover',
    x: 40,
    y: 40,
  })

  // 隐藏菜单项
  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL(winURL)

  // 拦截内部链接
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // 拦截特殊的 URL
    if (!url.includes('http://localhost') && !url.includes('file://')) {
      shell.openExternal(url);
      event.preventDefault();
    }

  });

  // 最小化
  ipcMain.on('window-minimize', (event, args) => {
    mainWindow.minimize();
  });

  // 切换窗口最大化和还原
  ipcMain.on('window-toggle', (event, args) => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
      mainWindow.webContents.send('window-toggle', false);
    } else {
      mainWindow.maximize();
      mainWindow.webContents.send('window-toggle', true);
    }
  });

  // 退出应用
  ipcMain.on('window-close', (event, args) => {
    mainWindow.close();
  });

  // 监听窗口尺寸变化
  mainWindow.on('resize', () => {
    mainWindow.webContents.send('window-toggle', mainWindow.isMaximized());
  });

  mainWindow.on('closed', () => {
    mainWindow = null
  });

}

// 禁止多开窗口
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */