import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                '@shared': resolve('src/shared'),
            }
        },
        envPrefix:"APP",
        plugins: [
            vue(),
            UnoCSS(),
            Components({
                resolvers: [PrimeVueResolver()]
            }),
            // svg-icon setting
            createSvgIconsPlugin({
                iconDirs: [resolve('src/renderer/src/assets/svgs')],
                symbolId: `icon-[dir]-[name]`
            })
        ]
    }
})
