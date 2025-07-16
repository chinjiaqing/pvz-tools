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

</template>

<script lang="ts" setup>
import { ipcInvoke } from '@renderer/ipc/events';
import { ref } from 'vue';


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

</script>