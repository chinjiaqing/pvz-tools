import {
    InvokeEvents,
    IpcMainEventListeners,
    RendererWebMessageType,
    RendererMessagePayloads
} from '@renderer/types'
import { onUnmounted } from 'vue'

/**
 * 类型安全的IPC调用方法
 * @param event IPC事件名称
 * @param args 参数
 * @returns 返回严格类型化的Promise结果
 * @example
 * const res = await ipcInvoke('test',{foo:'bar'})
 */
export function ipcInvoke<T extends keyof InvokeEvents>(
    event: T,
    ...args: Parameters<InvokeEvents[T]>
): Promise<Awaited<ReturnType<InvokeEvents[T]>>> {
    return window.electron.ipcRenderer.invoke(event, ...args) as Promise<
        Awaited<ReturnType<InvokeEvents[T]>>
    >
}

/**
 * 发送消息到主进程
 * @param event IPC事件名
 * @param args 参数
 *
 * @example
 *
 * send2main('test',{foo:'bar})
 *
 */
export function send2main<T extends keyof IpcMainEventListeners>(
    event: T,
    ...args: Parameters<IpcMainEventListeners[T]>
) {
    window.electron.ipcRenderer.send(event, ...args)
}

/**
 * 监听主进程的消息
 * @param event 事件名
 * @param listener callback
 */
export function addMainEventListener<T extends RendererWebMessageType>(
    event: T,
    listener: (params: RendererMessagePayloads[T]) => void
) {
    window.electron.ipcRenderer.on(event, (_, params) => listener(params))
    onUnmounted(() => {
        window.electron.ipcRenderer.removeAllListeners(event)
    })
}
