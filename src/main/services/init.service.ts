export function initAppEvents(app: Electron.App) {
    app.on('before-quit', async () => {
        // app快要退出时
        if (process.platform !== 'darwin') {
            app.exit(0)
        }
    })
}

export async function appInit() {
    // do something before app launch
}
