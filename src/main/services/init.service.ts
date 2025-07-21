import { Game_shutdown } from "./game/game.service"

export function initAppEvents(app: Electron.App) {
    app.on('before-quit', async () => {
        // app快要退出时
        Game_shutdown()
        if (process.platform !== 'darwin') {
            app.exit(0)
        }
    })
}

export async function appInit() {
    // do something before app launch
}
