import { BrowserWindow, shell } from 'electron'
import icon from '../../../../resources/icon.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { windowManager } from './window-manager.service'

export function createMainWindow(): BrowserWindow {
    const wind = windowManager.getWindow('main')
    if (wind) return wind
    const mainWindow = new BrowserWindow({
        width: 640,
        height: 400,
        show: false,
        autoHideMenuBar: true,
        icon: icon,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            allowRunningInsecureContent: true,
            webSecurity: true
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'), {
            hash: 'home'
        })
    }
    mainWindow.on('close', (e) => {
        e.preventDefault()
        mainWindow.hide()
    })
    windowManager.addWindow('main', mainWindow)
    return mainWindow
}
