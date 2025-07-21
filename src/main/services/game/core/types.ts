export interface PlayerRect {
    x: number
    y: number
    width: number
    height: number
    valid?: boolean
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
}

export interface MyPlayerInfo extends PlayerInfo {
    fov_y: number
    fov_x: number
}
