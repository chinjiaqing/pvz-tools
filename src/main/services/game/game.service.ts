import memoryJsModule from 'memoryprocess'
import type * as memoryJsType from 'memoryprocess'
import type { Process, Module } from 'memoryprocess'
import { GameConfig, GameExeName } from './game.config'
import { dialog } from 'electron'
import { GameFunctionModuleNames, GameFunctionName } from '../../types'

const memoryJs = (memoryJsModule as unknown as typeof memoryJsType).default

export function getGameProcessHandler() {
    try {
        const processHandler = memoryJs.openProcess(GameExeName)
        if (!processHandler) {
            throw new Error(`请先打开游戏`)
        }
        return processHandler
    } catch (err) {
        dialog.showMessageBox({
            title: '错误',
            message: '请先打开游戏',
            buttons: ['确认']
        })
        throw new Error(`请先打开游戏`)
    }
}

function getModuleBaseAddr(handler: Process, moduleName: string = GameExeName) {
    const modules = memoryJs.getModules(handler.th32ProcessID) as Module[]
    const mod = modules.find((m) => m.szModule.toLowerCase() === moduleName)
    return mod?.modBaseAddr
}

/**
 * 计算基地址偏移
 * @param handler Process
 * @param baseAddr 模块基地址
 * @param offsets 偏移
 * @returns {number}
 */
function resolveAddr(handler: Process, baseAddr: number, offsets: number[]): number {
    let addr = memoryJs.readMemory(handler.handle, baseAddr, 'dword') as number

    if (offsets.length > 0) {
        for (let i = 0; i < offsets.length - 1; i++) {
            addr = memoryJs.readMemory(handler.handle, addr + offsets[i], 'dword') as number
        }
        return addr + offsets[offsets.length - 1]
    }
    return addr
}

function getGameFunctionModuleAddr(
    handler: Process,
    name: GameFunctionName,
    moduleName: string = GameExeName
) {
    const config = GameConfig[name]
    let addr = 0x0
    const moduleBaseAddr = getModuleBaseAddr(handler, moduleName)!
    addr = resolveAddr(handler, moduleBaseAddr + config.baseOffset, config.offsets)
    return addr
}

/**
 * 设置阳光值
 * @param value {number}
 */
export function Game_SetSunshine(value: number) {
    const processHandler = getGameProcessHandler()
    const addr = getGameFunctionModuleAddr(processHandler, GameFunctionModuleNames.SET_SUNSHINE)
    memoryJs.writeMemory(processHandler.handle, addr, value, 'dword')
    memoryJs.closeHandle(processHandler.handle)
}

/**
 * 获取阳光值
 * @returns {number}
 */
export function Game_GetSunshine(): number {
    const processHandler = getGameProcessHandler()
    const addr = getGameFunctionModuleAddr(processHandler, GameFunctionModuleNames.SET_SUNSHINE)
    const value = memoryJs.readMemory(processHandler.handle, addr, 'dword')
    memoryJs.closeHandle(processHandler.handle)
    return value || 0
}

/**
 * 是否开启无冷却
 * @param open {boolean}
 */
export function Game_SetCoolDown(open: boolean) {
    const processHandler = getGameProcessHandler()
    const addr = getGameFunctionModuleAddr(processHandler, GameFunctionModuleNames.SET_COOLDOWN)
    const newBytes = open ? Buffer.from([0x7f, 0x14]) : Buffer.from([0x7e, 0x14]) // 7F 14
    memoryJs.writeBuffer(processHandler.handle, addr, newBytes)
    memoryJs.closeHandle(processHandler.handle)
}
