'use strict'

import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
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
    frame: process.platform !== 'darwin' ? true : false,
    transparent: false,
    thickFrame: true,
    hasShadow: true,
    height: 680,
    width: 960,
    minHeight: 680,
    minWidth: 960,
    title: 'Code Snippet Pro',
    titleBarStyle: 'default',
    x: 40,
    y: 40,
  })

  mainWindow.loadURL(winURL)

  /////////////////////////////////////////////////////////////

  // win 平台隐藏基础菜单
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null)
    mainWindow.setMenuBarVisibility(false)
  } else {
    // Mac 上需要启用部分原始菜单，否则会出现无法使用快捷键的问题
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
        label: app.getName(),
        submenu: [{
            role: 'about'
          },
          {
            type: 'separator'
          },
          {
            role: 'services'
          },
          {
            type: 'separator'
          },
          {
            role: 'hide'
          },
          {
            role: 'hideothers'
          },
          {
            role: 'unhide'
          },
          {
            type: 'separator'
          },
          {
            role: 'quit'
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [{
            role: 'undo'
          },
          {
            role: 'redo'
          },
          {
            type: 'separator'
          },
          {
            role: 'cut'
          },
          {
            role: 'copy'
          },
          {
            role: 'paste'
          },
          {
            role: 'delete'
          },
          {
            role: 'selectAll'
          },
        ]
      },
      {
        label: 'View',
        submenu: [{
            role: 'reload'
          },
          {
            role: 'forcereload'
          },
          {
            type: 'separator'
          },
          {
            role: 'resetzoom'
          },
          {
            role: 'zoomin'
          },
          {
            role: 'zoomout'
          },
        ]
      },
      {
        label: 'Window',
        submenu: [{
            role: 'minimize'
          },
          {
            role: 'zoom'
          }, {
            type: 'separator'
          },
          {
            role: 'front'
          },
        ]
      }
    ]))
  }

  /////////////////////////////////////////////////////////////

  // 拦截内部链接
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // 拦截特殊的 URL
    if (!url.includes('http://localhost') && !url.includes('file://')) {
      shell.openExternal(url)
      event.preventDefault()
    }
  });

  /////////////////////////////////////////////////////////////

  // 获取缓存目录
  ipcMain.on('get-user-data-path', (event, args) => {
    mainWindow.webContents.send('get-user-data-path', app.getPath('userData'));
  })

  // 获取下载目录
  ipcMain.on('get-user-download-path', (event, args) => {
    mainWindow.webContents.send('get-user-download-path', app.getPath('downloads'));
  })

  /////////////////////////////////////////////////////////////

  // 最小化
  ipcMain.on('window-minimize', (event, args) => {
    mainWindow.minimize()
  })

  // 切换窗口最大化和还原
  ipcMain.on('window-toggle', (event, args) => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
      mainWindow.webContents.send('window-toggle', false)
    } else {
      mainWindow.maximize()
      mainWindow.webContents.send('window-toggle', true)
    }
  })

  // 退出应用
  ipcMain.on('window-close', (event, args) => {
    mainWindow.close()
  })

  /////////////////////////////////////////////////////////////

  // 监听窗口尺寸变化
  mainWindow.on('resize', () => {
    mainWindow.webContents.send('window-toggle', mainWindow.isMaximized());
  });

  mainWindow.on('closed', () => {
    mainWindow = null
  });

}

app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 当运行第二个实例时,将会聚焦到myWindow这个窗口
  if (myWindow) {
    if (myWindow.isMinimized()) myWindow.restore()
    myWindow.focus()
  }
})

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