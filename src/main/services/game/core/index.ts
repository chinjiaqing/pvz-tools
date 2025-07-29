import { getGameProcessHandler, Game_GetPlayerCount, Game_GetPlayersInfo } from './game'
import { Drawer } from './draw-new'
import memoryJsModule from 'memoryprocess'
import type * as memoryJsType from 'memoryprocess'
import { calcPlayerRectSize } from './calc-rect'
import { MyPlayerInfo } from './types'

const memoryJs = (memoryJsModule as unknown as typeof memoryJsType).default
const drawer = new Drawer()

let running = false
let handler: any = null
let frameCount = 0
let lastFpsTime = Date.now()
let fps = 0

export async function startup() {
    if (running) return

    console.log('启动CS2透视绘制程序...')

    // 初始化绘制器
    if (!(await drawer.initialize())) {
        console.error('初始化绘制器失败')
        return
    }

    // 初始化内存读取
    try {
        handler = getGameProcessHandler()
        console.log('成功连接到游戏进程')
    } catch (error) {
        console.error(error)
        return
    }

    running = true
    console.log('开始主循环...')
    mainLoop().catch((err) => {
        console.error('主循环出错:', err)
        shutdown()
    })
}

export function shutdown() {
    if (!running) return

    running = false
    drawer.cleanup()

    if (handler) {
        memoryJs.closeHandle(handler.handle)
        handler = null
    }

    console.log('程序已关闭')
}

async function mainLoop() {
    while (running) {
        const frameStart = Date.now()
        frameCount++

        try {
            if (!drawer.processMessages()) {
                console.log('收到退出消息')
                shutdown()
                return
            }
            // 开始绘制（捕获背景）
            drawer.beginDraw()

            // 从内存中读取玩家数据
            const playerCount = Game_GetPlayerCount(handler)
            const playerInfos = Game_GetPlayersInfo(handler, playerCount)

            if (playerInfos.length === 0) {
                await delay(100)
                continue
            }

            const basePlayer = playerInfos[0] as MyPlayerInfo // 玩家自己

            // 过滤无效玩家
            const validPlayers = playerInfos

            // 绘制所有目标
            let visibleTargets = 0
            for (const target of validPlayers) {
                if (target.id === 0) continue // 跳过玩家自己
                if (target.health <= 0) continue // 跳过死亡玩家
                const rect = calcPlayerRectSize(
                    basePlayer,
                    target,
                    drawer.screenWidth,
                    drawer.screenHeight
                )
                if (!rect) continue
                console.log(`rect`, rect, drawer.screenWidth, drawer.screenHeight)
                // 绘制方框（带距离感知）
                let width = Math.max(1, 20899 / rect.size)
                let height = Math.max(1, 49999 / rect.size)
                console.log(`玩家:`,rect,width,height)
                drawer.drawPlayerRect(rect.x, rect.y, width, height, target.health)
                // 绘制血量（在方框上方）
                // drawer.drawHealthText(target.health, rect.x, rect.y)
                visibleTargets++
            }

            // 绘制FPS和调试信息
            const now = Date.now()
            if (now - lastFpsTime >= 1000) {
                fps = frameCount
                frameCount = 0
                lastFpsTime = now
            }

            // 总是绘制FPS，即使没有可见目标
            drawer.drawFpsText(fps, visibleTargets, validPlayers.length - 1)
        } catch (error) {
            console.error('绘制过程中出错:', error)
            // 尝试重新获取游戏进程
            try {
                handler = getGameProcessHandler()
                console.log('重新连接到游戏进程')
            } catch (e) {
                console.error('无法重新连接到游戏进程')
                shutdown()
                return
            }
        } finally {
            // 结束绘制（复制到屏幕）
            drawer.endDraw()
        }

        // 精确帧率控制
        const frameTime = Date.now() - frameStart
        const sleepTime = Math.max(0, 16 - frameTime) // 60FPS
        await delay(sleepTime)
        // await delay(3 * 1000)
    }
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// // 处理退出信号
// process.on("SIGINT", shutdown);

// // 手动启动
// startup().catch(console.error);
