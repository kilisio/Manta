// Node Libs
const path = require('path');
const url = require('url');

// Electron Libs
const { BrowserWindow, screen } = require('electron').remote;


// Custom Libs
const sounds = require('../../libs/sounds.js');

// const centerOnPrimaryDisplay = require('../../helpers/center-on-primary-display');


function centerOnPrimaryDisplay(winWidth, winHeight){
  // Get primary display (screen / monitor) bounds
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  // Calculate X and Y coordinates to make rectangular center on primary display
  const winX = x + (width - winWidth) / 2;
  const winY = y + (height - winHeight) / 2;

  return {
    x: winX,
    y: winY,
  };
};

function showModalWindow(dialogOptions, returnChannel = '', ...rest) {
  const width = 450;
  const height = 220;

  // Get X and Y coordinations on primary display
  const winPOS = centerOnPrimaryDisplay(width, height);

  let modalWin = new BrowserWindow({
    x: winPOS.x,
    y: winPOS.y,
    width,
    height,
    backgroundColor: '#282828',
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });
  modalWin.loadURL(
    url.format({
      pathname: path.resolve(__dirname, '../modal/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
  modalWin.on('close', () => (modalWin = null));
  modalWin.webContents.on('did-finish-load', () => {
    modalWin.webContents.send(
      'update-modal',
      dialogOptions,
      returnChannel,
      ...rest
    );
  });
  modalWin.on('ready-to-show', () => {
    modalWin.show();
    modalWin.focus();
    sounds.play('DIALOG');
  });
}

module.exports = showModalWindow;
