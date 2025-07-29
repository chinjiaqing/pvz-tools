import memoryJsModule from 'memoryprocess';
import type * as memoryJsType from 'memoryprocess';
import type { Process, Module } from 'memoryprocess';
import { PlayerInfo } from './types';

const memoryJs = (memoryJsModule as unknown as typeof memoryJsType).default;
const GameExeName = 'cs2.exe';


export function getGameProcessHandler(): Process {
    try {
        const processHandler = memoryJs.openProcess(GameExeName);
        if (!processHandler) {
            throw new Error(`请先打开游戏`);
        }
        return processHandler;
    } catch (err) {
        throw new Error(`请先打开游戏`);
    }
}

function getModuleBaseAddr(handler: Process, moduleName: string = GameExeName): number | null {
    const nameStr = moduleName.toLocaleLowerCase();
    const modules = memoryJs.getModules(handler.th32ProcessID) as Module[];
    const mod = modules.find((m) => m.szModule.toLowerCase() === nameStr);
    return mod?.modBaseAddr || null;
}

/**
 * 获取玩家人数
 */
export function Game_GetPlayerCount(handler: Process): number {
    const modBaseAddr = getModuleBaseAddr(handler, 'server.dll');
    if (!modBaseAddr) return 0;
    const data = memoryJs.readMemory(handler.handle, modBaseAddr + 0x166F99C, 'dword');
    return data || 0;
}

export function Game_GetPlayersInfo(handler: Process, count: number): PlayerInfo[] {
    const players: PlayerInfo[] = [];
    const modBaseAddr = getModuleBaseAddr(handler, 'client.dll');
    if (!modBaseAddr) return [];
    console.log(`获取玩家数量： ${count}`);
    
    let basePtr = modBaseAddr + 0x1B01DC8;
    for (let i = 0; i < count; i++) {
        // let playerBasePtr = baseAddr + BigInt(0x8 + i * 0x10);
        let playerBasePtr = basePtr + 0x8 + i * 0x10
        let playerBaseAddr = memoryJs.readMemory(
            handler.handle,
            playerBasePtr as unknown as number,
            'int64'
        );

        if (!playerBaseAddr) {
            // 添加无效玩家占位符
            // players.push({ id: i, health: 0, x: 0, y: 0, z: 0, isValid: false });
            continue;
        }

        const health = memoryJs.readMemory(
            handler.handle,
            (playerBaseAddr! + BigInt(0xb5c)) as unknown as number,
            'dword'
        )!;
        
        const x = memoryJs.readMemory(
            handler.handle,
            (playerBaseAddr! + BigInt(0xF58)) as unknown as number,
            'float'
        )!;
        
        const y = memoryJs.readMemory(
            handler.handle,
            (playerBaseAddr! + BigInt(0xF5C)) as unknown as number,
            'float'
        )!;
        
        const z = memoryJs.readMemory(
            handler.handle,
            (playerBaseAddr! + BigInt(0xF60)) as unknown as number,
            'float'
        )!;
         const team = memoryJs.readMemory(
            handler.handle,
            (playerBaseAddr! + BigInt(0x0e68)) as unknown as number,
            'dword'
        )!

        const player: PlayerInfo = {
            id: i,
            health: health,
            x,
            y,
            z,
        };

        // 只有玩家自己才有视角信息
        if (i === 0) {
            // const angPtr = modBaseAddr + 0x1A7D420;
            const angPtr = modBaseAddr + 0x1D0EB18
            const angY = memoryJs.readMemory(handler.handle, angPtr, 'float');
            const angX = memoryJs.readMemory(handler.handle, angPtr + 0x4, 'float');
            player.fov_y = angY;
            player.fov_x = angX;
        } 
        
        players.push(player);
    }
    
    console.log("玩家信息:", JSON.stringify(players, null, 2));
    return players;
}