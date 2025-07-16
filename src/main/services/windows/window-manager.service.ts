import { BrowserWindow } from 'electron'
class WindowManager {
    private windowMaps = new Map<string, BrowserWindow>()

    public addWindow(name: string, wind: BrowserWindow) {
        if (!this.windowMaps.has(name)) {
            this.windowMaps.set(name, wind)
            wind.on('close', () => {
                this.windowMaps.delete(name)
            })
        }
        return this.windowMaps.get(name)
    }

    public getWindow(name: string) {
        return this.windowMaps.get(name)
    }

    public hasWindow(name: string) {
        return this.windowMaps.has(name)
    }
}
export const windowManager = new WindowManager()
