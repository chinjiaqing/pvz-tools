import { StoreRectSetting } from "./store.types"

// ipc main 监听事件
export interface IpcMainEventListeners {
    test: (params?: any) => void
    test2: (params?: any) => void
}

export interface InvokeEvents {
    test: () => Promise<string>
    getSunshineValue: () => Promise<number>
    setSunshineValue: (value: number) => Promise<void>
    toggleCoolDown: (open: boolean) => Promise<void>
    getRectSetting:()=>Promise<StoreRectSetting>
    setRectSetting:(v:StoreRectSetting)=>Promise<void>
}
