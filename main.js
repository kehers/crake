const {app, BrowserWindow, shell, Tray, Menu} = require('electron')
      , path = require('path')
      , url = require('url')
      , Datastore = require('nedb')
      , platform = require('os').platform();
      ;

let db = {};
    db.config = new Datastore({ filename: path.join(app.getPath('appData'), 'crake-config.db'), autoload: true });
    db.tweets = new Datastore({ filename: path.join(app.getPath('appData'), 'crake-tweets.db'), autoload: true });
let mainWindow;
let quitting = false;

global.sharedObject = {
  dataPath: app.getPath('appData')
}

function createWindow () {
  /*if (platform == "darwin") {
      appIcon.setPressedImage(imageFolder + '/osx/trayHighlight.png');
  }*/
  let imageFolder = __dirname + '/views/images';
  let trayImage, appIcon;
  if (platform == 'darwin')
      trayImage = imageFolder + '/osx/trayTemplate.png';
  else if (platform == 'win32')
      trayImage = imageFolder + '/win/tray.ico';
  appIcon = new Tray(trayImage);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 480,
    height: 640,
    //webPreferences: {devTools: false}
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, `views/index.html`),
    protocol: 'file:',
    slashes: true
  }));

  let contextMenu = Menu.buildFromTemplate([{
        label: 'Open', click () {
          mainWindow.show();
          app.dock.show();
        }
      }, {
          label: 'Quit App', click () {
            quitting = true;
            app.quit();
          }
      }]);
  appIcon.setContextMenu(contextMenu);

  mainWindow.webContents.on('will-navigate', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on('minimize', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  /*mainWindow.on('close',  (e) => {
    if(!quitting){
      e.preventDefault();
      mainWindow.hide();
      app.dock.hide();
    }
    return false;
  });*/

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})