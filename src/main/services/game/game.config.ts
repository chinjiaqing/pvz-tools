import { DataType } from 'memoryprocess'
import { GameFunctionName } from '../../types'

export interface GameFunctionModuleConfigRaw {
    belong_module: ''
    baseOffset: number
    offsets: number[]
    type: DataType
}

export const GameConfig: Record<GameFunctionName, GameFunctionModuleConfigRaw> = {
    set_cooldown: {
        belong_module: '',
        baseOffset: 0x87296,
        offsets: [],
        type: 'byte'
    },
    set_sunshine: {
        belong_module: '',
        baseOffset: 0x2a9f38,
        offsets: [0x768, 0x5560],
        type: 'dword'
    }
} as const

export const GameExeName = 'PlantsVsZombies.exe'


