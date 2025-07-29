import { Drawer } from "./draw-new";

// ========== 主程序逻辑 ==========
let running = false;
let frameCount = 0;
let lastFpsTime = 0;
let fps = 0;
const drawer = new Drawer();

export async function startup() {
	if (running) return;

	// 初始化绘制器
	if (!(await drawer.initialize())) {
		console.error("初始化绘制器失败");
		return;
	}

	running = true;
	console.log("开始主循环...");
	mainLoop().catch((err) => {
		console.error("主循环出错:", err);
		shutdown();
	});
}

export function shutdown() {
	if (!running) return;

	running = false;
	drawer.cleanup();

	console.log("程序已关闭");
}

// 模拟玩家数据
interface Player {
	rect: { x: number; y: number; width: number; height: number };
	health: number;
	distance: number;
}

/**
 * 获取模拟玩家数据
 */
function getPlayers(screenWidth: number, screenHeight: number): Player[] {
	const players: Player[] = [];
	const playerCount = Math.floor(Math.random() * 3) + 3; // 3-5个玩家

	for (let i = 0; i < playerCount; i++) {
		players.push({
			rect: {
				x: 100 + Math.random() * (screenWidth - 200),
				y: 100 + Math.random() * (screenHeight - 200),
				width: 70 + Math.random() * 60,
				height: 140 + Math.random() * 80,
			},
			health: Math.floor(Math.random() * 100),
			distance: Math.floor(Math.random() * 800) + 200,
		});
	}

	return players;
}

async function mainLoop() {
	// 性能监控变量
	let lastFrameTime = Date.now();
	let frameTimes: number[] = [];
	
	while (running) {
		const frameStart = Date.now();
		frameCount++;

		try {
			// 处理窗口消息
			if (!drawer.processMessages()) {
				console.log("收到退出消息");
				shutdown();
				return;
			}

			// 开始绘制
			drawer.beginDraw();

			// 获取玩家数据
			const players = getPlayers(drawer.screenWidth, drawer.screenHeight);

			// 绘制所有目标
			let visibleTargets = 0;
			for (const player of players) {
				drawer.drawPlayerRect(
					player.rect.x,
					player.rect.y,
					player.rect.width,
					player.rect.height,
					player.health,
					player.distance
				);
				visibleTargets++;
			}

			// 计算FPS
			const now = Date.now();
			if (now - lastFpsTime >= 1000) {
				fps = frameCount;
				frameCount = 0;
				lastFpsTime = now;
				
				// 计算平均帧时间
				const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
				console.log(`当前FPS: ${fps}, 平均帧时间: ${avgFrameTime.toFixed(2)}ms`);
				frameTimes = [];
			} else {
				frameTimes.push(now - lastFrameTime);
			}
			
			lastFrameTime = now;

			// 绘制FPS信息
			drawer.drawFpsText(fps, visibleTargets, players.length);
		} catch (error) {
			console.error("绘制过程中出错:", error);
		} finally {
			// 结束绘制
			drawer.endDraw();
		}

		// 精确帧率控制（目标60FPS）
		const frameTime = Date.now() - frameStart;
		const targetFrameTime = 16; // 60FPS对应的帧时间
		const sleepTime = Math.max(0, targetFrameTime - frameTime);
		await delay(sleepTime);
	}
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// 处理退出信号
process.on("SIGINT", shutdown);

// 启动程序
startup().catch(console.error);