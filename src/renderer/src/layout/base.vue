<template>
    <div class="w-full h-full">
        <div class="content p-8 border-box base-content">
            <router-view v-slot="{ Component, route }">
                <transition name="slide-left" mode="out-in" appear>
                    <div class="w-full h-full relative z-0" :key="route.name">
                        <component :is="Component" />
                    </div>
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
const appVersion = ref<number | string>('')
onMounted(async () => {
    appVersion.value = window.appInfo.version
    localStorage.setItem('appVersion', appVersion.value + '')
})

</script>

<style lang="scss" scoped>
.content {
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    overflow-y: overlay;
    width: 100%;
    height: 100%;
    /* 如果内容超出可视范围，可以滚动 */
}
</style>