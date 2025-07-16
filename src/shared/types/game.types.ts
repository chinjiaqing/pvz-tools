export const GameFunctionModuleNames = {
    SET_SUNSHINE: 'set_sunshine', // 设置阳光
    SET_COOLDOWN: 'set_cooldown' // 设置冷却
} as const

export type GameFunctionName =
    (typeof GameFunctionModuleNames)[keyof typeof GameFunctionModuleNames]
