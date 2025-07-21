import Store from 'electron-store'
import { StoreRectSetting } from '../types'

type MyStore = {
    rect_setting: StoreRectSetting
}

export let STORE_RECT_SETTING: StoreRectSetting = {
    scaleX: 20999,
    scaleY: 49999,
    offsetX: 0.01,
    offsetY: 0.44
}

export const store = new Store<MyStore>({
    name: 'game',
    defaults: {
        rect_setting: { ...STORE_RECT_SETTING }
    }
})

export function updateRectSetting(v: StoreRectSetting) {
    STORE_RECT_SETTING = { ...v }
    store.set('rect_setting', { ...v })
}

export function restoreRectSetting() {
    const v = store.get('rect_setting')
    STORE_RECT_SETTING = { ...v }
}

export function getRectSetting(){
    return STORE_RECT_SETTING
}