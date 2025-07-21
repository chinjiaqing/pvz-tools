<template>
    <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
            阳光值：
            <InputNumber v-model="sunshineValue" inputId="integeronly" /> <Button class="w-20"
                @click="handleSetValue">设置</Button>
            <Button class="min-w-20" label="刷新" @click="handleGetValue" />

        </div>
        <div class="flex items-center gap-2">
            无冷却：
            <ToggleSwitch v-model="openNoneCoolDown" @change="handleChange" />
        </div>
    </div>
    <div class="flex flex-col gap-10">
          <div class="card flex justify-center">
        <Slider @change="handleRectChange" v-model="rectSetting.scaleX" :min="20000" :max="50000" :step="1" class="w-56" />
    </div>
     <div class="card flex justify-center">
        <Slider  @change="handleRectChange" v-model="rectSetting.scaleY" class="w-56" :min="20000" :max="80000" :step="1" />
    </div>
     <div class="card flex justify-center">
        <Slider @change="handleRectChange" v-model="rectSetting.offsetX" class="w-56" :min="0" :max="1" :step="0.01" />
    </div>
     <div class="card flex justify-center">
        <Slider @change="handleRectChange" v-model="rectSetting.offsetY" class="w-56"  :step="0.01" />
    </div>
    </div>
 <Button class="min-w-20" label="开启" @click="handleTestBtn" />
 <Button class="min-w-20" label="关闭" @click="handleTestBtn2" />
</template>

<script lang="ts" setup>
import { ipcInvoke, send2main } from '@renderer/ipc/events';
import { StoreRectSetting } from '@shared/types';
import { onMounted, reactive, ref } from 'vue';

const rectSetting = reactive<StoreRectSetting>({
    offsetX:0,

    offsetY:0,
    scaleX:20999,
    scaleY:40999
})
const sunshineValue = ref<number>(9999)

const openNoneCoolDown = ref<boolean>(false)

async function handleSetValue() {
    await ipcInvoke('setSunshineValue', sunshineValue.value)
}

async function handleGetValue() {
    try {
        const value = await ipcInvoke('getSunshineValue')
        sunshineValue.value = value
    } catch (err) {
        console.log('%c [ err ]-36', 'font-size:13px; background:pink; color:#bf2c9f;', err)

    }
}

async function handleChange() {
    try {
        await ipcInvoke('toggleCoolDown', openNoneCoolDown.value)
    } catch (err) {
        openNoneCoolDown.value = !openNoneCoolDown.value
    }
}

function handleTestBtn(){
    send2main('test')
}

function handleTestBtn2(){
    send2main('test2')
}

function handleRectChange(){
    ipcInvoke('setRectSetting',{...rectSetting})
    console.log('%c [ rectSetting ]-81', 'font-size:13px; background:pink; color:#bf2c9f;', rectSetting)
}

onMounted(async ()=>{
    const v = await ipcInvoke('getRectSetting')
    // Object.keys(v).forEach(k=>{
    //     rectSetting[k] = v[k]
    // })
})
</script>