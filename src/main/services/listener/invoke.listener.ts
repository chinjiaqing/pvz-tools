import { ipcMain } from 'electron'
import { InvokeEvents } from '../../types'
import { Game_GetSunshine, Game_SetCoolDown, Game_SetSunshine } from '../game/game.service'

function handleInvoke<T extends keyof InvokeEvents>(event: T, listener: InvokeEvents[T]) {
    ipcMain.handle(event, (_, params) => (listener as Function)(params))
}

handleInvoke('test', async () => {
    return 'hello test'
})

handleInvoke('getSunshineValue', async () => {
    return Game_GetSunshine()
})

handleInvoke('setSunshineValue', async (value) => {
    Game_SetSunshine(value)
})

handleInvoke('toggleCoolDown', async (open) => {
    Game_SetCoolDown(open)
})
