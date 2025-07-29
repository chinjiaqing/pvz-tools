export interface PlayerRect {
    x: number
    y: number
    size: number
    visible?: boolean
}

export interface PlayerInfo {
    id: number
    health: number
    x: number
    y: number
    z: number
    rect?: PlayerRect
    fov_y?: number
    fov_x?: number
    team?:number
}

export interface MyPlayerInfo extends PlayerInfo {
    fov_y: number
    fov_x: number
}
