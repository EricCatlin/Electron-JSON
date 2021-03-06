const electron = require('electron');
const {Menu} = require('electron')
const remote = electron.remote;;

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow



function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



const template = [
  {
    label: 'File',
    submenu: [
       {
        label: 'Open Schema',
        accelerator: 'CmdOrCtrl+O',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send("LoadSchema");
        }
      },
       {
        label: 'Import Json',
        accelerator: 'CmdOrCtrl+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send("LoadJson");
        }
      },
       {
        label: 'Save Schema',
        accelerator: 'CmdOrCtrl+S',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send("SaveSchema");
        }
      },
       {
        label: 'Export to Json',
        accelerator: 'CmdOrCtrl+J',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send("SaveJson");
        }
      }
      
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
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
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      },
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  }

]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);