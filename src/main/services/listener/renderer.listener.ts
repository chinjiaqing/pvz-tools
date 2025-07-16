import { ipcMain } from 'electron'
import { IpcMainEventListeners } from '../../types'

function addRendererEventListener<T extends keyof IpcMainEventListeners>(
    event: T,
    listener: IpcMainEventListeners[T]
) {
    ipcMain.on(event, (_, params) => listener(params))
}

addRendererEventListener('test',()=>{
    console.log('from renderer test ')
})