import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'
import sass from 'sass-embedded'
import postcss from 'postcss'
const cssVarsRes = sass.compile('./src/renderer/src/style/color.module.scss')
const cssVarsString = cssVarsRes.css.toString()

const colorTheme = {}
postcss.parse(cssVarsString).walkDecls((decl) => {
    if (decl && decl.parent) {
        const row: any = decl.parent as any
        if (row.selector === ':export') {
            // 转换成短横线，避免和unocss变量规则冲突
            const variableName = decl.prop.replace('--', '').replaceAll('-', '_')
            // const variableValue = decl.value;

            //为了方便全局调控，这里转换为css变量，同时失去了unocss的颜色规则
            // 如color - primary / 60 将失效，你可以使用 color - primary_60 来使用css变量。
            // 为了颜色使用的规范化，不建议使用太过于宽泛的unocss颜色规则，请使用css变量来预设颜色，包括透明度等，方便全局调控
            const variableValue = `var(--${variableName.replaceAll('_', '-')})`
            colorTheme[variableName] = variableValue
        }
    }
})
console.log('themes', colorTheme)
export default defineConfig({
    presets: [
        presetWind4(),
        presetAttributify(),
        presetIcons({
            prefix: ['i-'],
            extraProperties: {
                display: 'inline-block',
                'vertical-align': 'middle'
            },
            collections: {
                solar: () =>
                    import('@iconify-json/solar/icons.json', {
                        assert: { type: 'json' }
                    }).then((i) => i.default as any)
            }
        })
    ],
    theme: {
        colors: {
            ...colorTheme
        }
    }
})
