import { ipcMain } from 'electron'
import { IpcMainEventListeners } from '../../types'
import { Game_GetPlayerCount, Game_shutdown, Game_test } from '../game/game.service'

function addRendererEventListener<T extends keyof IpcMainEventListeners>(
    event: T,
    listener: IpcMainEventListeners[T]
) {
    ipcMain.on(event, (_, params) => listener(params))
}

addRendererEventListener('test',()=>{
    Game_test()
})

addRendererEventListener('test2',()=>{
    Game_shutdown()
})