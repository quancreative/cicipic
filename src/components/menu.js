import {app, Menu, MenuItem} from "electron";

const menu = [
    ...(isMac ? [
        {
            label:app.name,
            submenu : [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }

    ] : [

    ])
]

const menu = new Menu()
menu.append(new MenuItem({
    label: 'Previous File',
    submenu: [{
        role: 'help',
        accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
        click: () => { console.log('Electron rocks!') }
    }]
}))

Menu.setApplicationMenu(menu)