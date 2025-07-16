import { app, BrowserWindow, Tray, nativeImage, Menu } from 'electron'
import { join } from 'path'
import { is, optimizer } from '@electron-toolkit/utils'
import './services/listener'
import { appInit, initAppEvents } from './services/init.service'
import { createMainWindow } from './services/windows/main-window.service'

Menu.setApplicationMenu(null)
app.whenReady().then(async () => {
    initAppEvents(app)
    await appInit()
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    const mainWindow = createMainWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })

    // 创建托盘图标（推荐PNG格式适配多平台）
    let tray = new Tray(
        nativeImage.createFromPath(
            join(app.getAppPath(), is.dev ? '/resources' : '../resources', 'icon.png')
        )
    )

    tray.on('click', () => {
        mainWindow.show()
    })
    const contextMenu = Menu.buildFromTemplate([
        { label: '主界面', click: () => mainWindow.show() },
        {
            label: '退出',
            click: () => {
                tray.destroy()
                app.quit()
            }
        }
    ])
    tray.setContextMenu(contextMenu)
    // 悬停提示
    tray.setToolTip('植物大战僵尸修改器')
})

app.on('window-all-closed', () => {
    app.quit()
})
