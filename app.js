const electron = require('electron');
const path = require('path');
const url = require('url');
const Store = require('./src/js/store.js');

// SET ENV
process.env.NODE_ENV = 'development';

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

// First instantiate the class for our Storage Tool
const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults: {
        // 800x600 is the default size of our window
        windowBounds: { width: 800, height: 600 }
    }
});

//Load the remote server/browser source server
const { fork } = require('child_process')
const ps = fork(`${__dirname}/public/server.js`)


// Listen for app to be ready
app.on('ready', function() {
    // Get our saved width and Height 
    let { width, height } = store.get('windowBounds');
    // Create new window
    mainWindow = new BrowserWindow({
        width,
        height,
        webPreferences: {
            preload: path.join(__dirname, 'src/js/preload.js')
        }
    });
    // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
    // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
    mainWindow.on('resize', () => {
        // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
        // the height, width, and x and y coordinates.
        let { width, height } = mainWindow.getBounds();
        // Now that we have them, save them using the `set` method.
        store.set('windowBounds', { width, height });
    });

    // Load html in window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function() {
        ps.kill('SIGTERM');
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Create menu template
const mainMenuTemplate = [
    // Each object is a dropdown
    {
        label: 'File',
        submenu: [{
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                ps.kill('SIGTERM');
                app.quit();
            }
        }]
    }
];

// If OSX, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
                role: 'reload'
            },
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}