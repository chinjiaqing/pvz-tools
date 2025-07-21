import { ipcMain } from 'electron'
import { InvokeEvents } from '../../types'
import { getRectSetting, updateRectSetting } from '../store.service'

function handleInvoke<T extends keyof InvokeEvents>(event: T, listener: InvokeEvents[T]) {
    ipcMain.handle(event, (_, params) => (listener as Function)(params))
}

// handleInvoke('test', async () => {
//     Game_GetPlayerCount()
// })

handleInvoke('getRectSetting', async () => {
    return getRectSetting()
})

handleInvoke('setRectSetting', async (v) => {
    updateRectSetting(v)
})
