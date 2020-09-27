// Node Libs
const fs = require('fs');

// Electron Libs
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const BrowserWindow = require('electron').BrowserWindow;

// 3rd Party Libs
const appConfig = require('electron-settings');


ipc.on('select-export-directory', event => {
    const window = BrowserWindow.fromWebContents(event.sender);
    dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    }).then(result => {
        let export_dir = result.filePaths[0];
        appConfig.set('exportDir', export_dir);
        event.sender.send('confirmed-export-directory', export_dir);
    }).catch(err => {
        event.sender.send('no-access-directory', err.message);
        console.log(err)
    })
});
