import koffi from "koffi";

// ========== 类型定义 ==========
koffi.alias("HWND", "void*");
koffi.alias("HDC", "void*");
koffi.alias("HBITMAP", "void*");
koffi.alias("HGDIOBJ", "void*");
koffi.alias("HBRUSH", "void*");
koffi.alias("HPEN", "void*");
koffi.alias("COLORREF", "uint32");
koffi.alias("DWORD", "uint32");
koffi.alias("HINSTANCE", "void*");
koffi.alias("LONG", "int32");
koffi.alias("BOOL", "int32");
koffi.alias("BYTE", "uint8");
koffi.alias("UINT", "uint32");
koffi.alias("LRESULT", "intptr");

// 定义 POINT 结构
const POINT = koffi.struct("POINT", {
	x: "long",
	y: "long",
});

// 定义 RECT 结构
const RECT = koffi.struct("RECT", {
	left: "long",
	top: "long",
	right: "long",
	bottom: "long",
});

// 定义 MSG 结构
const MSG = koffi.struct("MSG", {
	hwnd: "void *",
	message: "uint32",
	wParam: "uintptr",
	lParam: "uintptr",
	time: "uint32",
	pt: POINT,
});

// ========== 加载DLL和函数声明 ==========
const user32 = koffi.load("user32.dll");
const gdi32 = koffi.load("gdi32.dll");
const kernel32 = koffi.load("kernel32.dll");

// 窗口创建相关函数
const GetModuleHandleA = kernel32.func("HINSTANCE __stdcall GetModuleHandleA(const char* lpModuleName)");
const CreateWindowExA = user32.func(
	"HWND __stdcall CreateWindowExA(DWORD dwExStyle, const char* lpClassName, const char* lpWindowName, DWORD dwStyle, int x, int y, int nWidth, int nHeight, HWND hWndParent, void* hMenu, HINSTANCE hInstance, void* lpParam)"
);
const DestroyWindow = user32.func("BOOL __stdcall DestroyWindow(HWND hWnd)");
const SetWindowLongA = user32.func("LONG __stdcall SetWindowLongA(HWND hWnd, int nIndex, LONG dwNewLong)");
const GetWindowLongA = user32.func("LONG __stdcall GetWindowLongA(HWND hWnd, int nIndex)");
const SetLayeredWindowAttributes = user32.func(
	"BOOL __stdcall SetLayeredWindowAttributes(HWND hwnd, COLORREF crKey, BYTE bAlpha, DWORD dwFlags)"
);
const SetWindowPos = user32.func(
	"BOOL __stdcall SetWindowPos(HWND hWnd, HWND hWndInsertAfter, int X, int Y, int cx, int cy, UINT uFlags)"
);
const GetSystemMetrics = user32.func("int __stdcall GetSystemMetrics(int nIndex)");
const GetDC = user32.func("HDC __stdcall GetDC(HWND hWnd)");
const ReleaseDC = user32.func("int __stdcall ReleaseDC(HWND hWnd, HDC hDC)");
const PeekMessageA = user32.func(
	"BOOL __stdcall PeekMessageA(void* lpMsg, HWND hWnd, UINT wMsgFilterMin, UINT wMsgFilterMax, UINT wRemoveMsg)"
);
const TranslateMessage = user32.func("BOOL __stdcall TranslateMessage(const void* lpMsg)");
const DispatchMessageA = user32.func("LRESULT __stdcall DispatchMessageA(const void* lpMsg)");

// 绘图相关函数
const CreateCompatibleDC = gdi32.func("HDC __stdcall CreateCompatibleDC(HDC hdc)");
const CreateCompatibleBitmap = gdi32.func("HBITMAP __stdcall CreateCompatibleBitmap(HDC hdc, int cx, int cy)");
const SelectObject = gdi32.func("HGDIOBJ __stdcall SelectObject(HDC hdc, HGDIOBJ h)");
const DeleteObject = gdi32.func("int __stdcall DeleteObject(HGDIOBJ hObject)");
const DeleteDC = gdi32.func("bool __stdcall DeleteDC(HDC hdc)");
const BitBlt = gdi32.func(
	"bool __stdcall BitBlt(HDC hdcDest, int x, int y, int w, int h, HDC hdcSrc, int xSrc, int ySrc, uint32 rop)"
);
const CreateSolidBrush = gdi32.func("HBRUSH __stdcall CreateSolidBrush(COLORREF crColor)");
const FillRect = user32.func("int __stdcall FillRect(HDC hDC, RECT* lprc, HBRUSH hbr)");
const CreatePen = gdi32.func("HPEN __stdcall CreatePen(int fnPenStyle, int nWidth, COLORREF crColor)");
const Rectangle = gdi32.func("bool __stdcall Rectangle(HDC hdc, int left, int top, int right, int bottom)");
const CreateFontA = gdi32.func(
	"HGDIOBJ __stdcall CreateFontA(int nHeight, int nWidth, int nEscapement, int nOrientation, int fnWeight, DWORD fdwItalic, DWORD fdwUnderline, DWORD fdwStrikeOut, DWORD fdwCharSet, DWORD fdwOutputPrecision, DWORD fdwClipPrecision, DWORD fdwQuality, DWORD fdwPitchAndFamily, const char* lpszFace)"
);
const SetTextColor = gdi32.func("COLORREF __stdcall SetTextColor(HDC hdc, COLORREF color)");
const SetBkMode = gdi32.func("int __stdcall SetBkMode(HDC hdc, int mode)");
const TextOutA = gdi32.func("bool __stdcall TextOutA(HDC hdc, int x, int y, const char* lpString, int c)");
const GetStockObject = gdi32.func("HGDIOBJ __stdcall GetStockObject(int i)");
const MoveToEx = gdi32.func("bool __stdcall MoveToEx(HDC hdc, int x, int y, void* lpPoint)");
const LineTo = gdi32.func("bool __stdcall LineTo(HDC hdc, int x, int y)");
const Ellipse = gdi32.func("bool __stdcall Ellipse(HDC hdc, int left, int top, int right, int bottom)");
const SetGraphicsMode = gdi32.func("int __stdcall SetGraphicsMode(HDC hdc, int iMode)");
const SetBkColor = gdi32.func("COLORREF __stdcall SetBkColor(HDC hdc, COLORREF color)");

// ========== 常量定义 ==========
// 窗口样式
const WS_EX_LAYERED = 0x00080000;
const WS_EX_TRANSPARENT = 0x00000020;
const WS_EX_TOPMOST = 0x00000008;
const WS_POPUP = 0x80000000;
const WS_VISIBLE = 0x10000000;

// 窗口位置
const HWND_TOPMOST = -1;

// 透明度设置
const LWA_COLORKEY = 0x00000001;
const GWL_EXSTYLE = -20;

// 绘图常量
const SRCCOPY = 0x00cc0020;
const TRANSPARENT = 1;
const FW_NORMAL = 400;
const FW_BOLD = 700;
const DEFAULT_CHARSET = 1;
const GB2312_CHARSET = 134; // 简体中文编码
const OUT_DEFAULT_PRECIS = 0;
const CLIP_DEFAULT_PRECIS = 0;
const DEFAULT_QUALITY = 0;
const CLEARTYPE_QUALITY = 5; // ClearType渲染
const DEFAULT_PITCH = 0;
const PS_SOLID = 0;
const NULL_BRUSH = 5;
const ANTIALIASED_QUALITY = 4; // 抗锯齿模式
const GM_ADVANCED = 2; // 高级图形模式

// 系统指标
const SM_CXSCREEN = 0;
const SM_CYSCREEN = 1;

// 消息处理相关
const PM_REMOVE = 0x0001;
const WM_QUIT = 0x0012;

// ========== Drawer 类 ==========
export class Drawer {
	// 窗口相关
	public hwnd: any = null;
	public transparentColor = 0x010101; // 使用非常接近黑色的颜色作为透明色

	// 屏幕尺寸
	public screenWidth = 0;
	public screenHeight = 0;

	// GDI资源
	private hdcScreen: any = null;
	private hdcMem: any = null;
	private hBitmap: any = null;
	private oldBitmap: any = null;

	// 资源池
	private textCache = new Map<string, any>();
	private brushPool = new Map<number, any>(); // 画刷池
	private penPool = new Map<string, any>();   // 画笔池

	constructor() {}

	/**
	 * 初始化绘制系统
	 * @returns 是否初始化成功
	 */
	async initialize() {
		try {
			console.log("开始初始化绘制系统...");

			// 获取屏幕尺寸
			this.screenWidth = GetSystemMetrics(SM_CXSCREEN);
			this.screenHeight = GetSystemMetrics(SM_CYSCREEN);

			console.log(`屏幕尺寸: ${this.screenWidth}x${this.screenHeight}`);

			if (this.screenWidth <= 0 || this.screenHeight <= 0) {
				console.error("无效的屏幕尺寸");
				return false;
			}

			// 创建透明窗口
			if (!this.createTransparentWindow()) {
				console.error("创建透明窗口失败");
				return false;
			}

			// 获取整个窗口的DC
			this.hdcScreen = GetDC(this.hwnd);
			if (!this.hdcScreen) {
				console.error("获取窗口DC失败");
				return false;
			}
			console.log("获取窗口DC成功");
			
			// 启用高级图形模式
			SetGraphicsMode(this.hdcScreen, GM_ADVANCED);

			// 创建内存DC
			this.hdcMem = CreateCompatibleDC(this.hdcScreen);
			if (!this.hdcMem) {
				console.error("创建内存DC失败");
				return false;
			}
			console.log("创建内存DC成功");
			
			// 启用内存DC的高级图形模式
			SetGraphicsMode(this.hdcMem, GM_ADVANCED);

			// 创建兼容位图（窗口尺寸）
			const windowRect = this.getWindowRect();
			const windowWidth = windowRect.right - windowRect.left;
			const windowHeight = windowRect.bottom - windowRect.top;
			console.log(`窗口实际尺寸: ${windowWidth}x${windowHeight}`);

			this.hBitmap = CreateCompatibleBitmap(this.hdcScreen, windowWidth, windowHeight);
			if (!this.hBitmap) {
				console.error("创建兼容位图失败");
				return false;
			}
			console.log("创建兼容位图成功");

			// 选择位图到内存DC
			this.oldBitmap = SelectObject(this.hdcMem, this.hBitmap);
			if (!this.oldBitmap) {
				console.error("选择位图到内存DC失败");
				return false;
			}
			console.log("选择位图到内存DC成功");

			// 设置默认背景颜色
			SetBkColor(this.hdcMem, this.transparentColor);

			return true;
		} catch (error) {
			console.error("初始化过程中发生错误:", error);
			return false;
		}
	}

	private getWindowRect() {
		try {
			// 获取窗口尺寸的函数声明
			const GetWindowRect = user32.func("BOOL __stdcall GetWindowRect(HWND hWnd, RECT* lpRect)");

			// 分配内存
			const rectPtr = koffi.alloc(RECT, 1);

			// 获取窗口尺寸
			const result = GetWindowRect(this.hwnd, rectPtr);

			if (result) {
				const rect = koffi.decode(rectPtr, RECT);
				koffi.free(rectPtr);
				return rect;
			}

			koffi.free(rectPtr);
		} catch (error) {
			console.error("获取窗口尺寸失败:", error);
		}

		// 如果失败，返回默认尺寸
		return {
			left: 0,
			top: 0,
			right: this.screenWidth,
			bottom: this.screenHeight,
		};
	}
	
	/**
	 * 创建透明窗口
	 */
	private createTransparentWindow(): boolean {
		try {
			// 获取当前模块句柄
			const hInstance = GetModuleHandleA(null);

			// 创建窗口
			this.hwnd = CreateWindowExA(
				WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOPMOST,
				"Static", // 使用静态控件类
				"Transparent Overlay",
				WS_POPUP | WS_VISIBLE,
				0,
				0,
				this.screenWidth,
				this.screenHeight,
				null,
				null,
				hInstance,
				null
			);

			if (!this.hwnd) {
				console.error("窗口创建失败");
				return false;
			}

			// 设置分层窗口属性
			SetWindowLongA(this.hwnd, GWL_EXSTYLE, WS_EX_LAYERED);

			// 设置透明色键 - 使用非常接近黑色的颜色
			SetLayeredWindowAttributes(
				this.hwnd,
				this.transparentColor, // 0x010101而不是0x000000
				0, // 完全透明
				LWA_COLORKEY
			);

			// 置顶窗口
			SetWindowPos(
				this.hwnd,
				HWND_TOPMOST,
				0,
				0,
				this.screenWidth,
				this.screenHeight,
				0x0040 // SWP_SHOWWINDOW
			);

			console.log("透明窗口创建成功");
			return true;
		} catch (error) {
			console.error("创建透明窗口时出错:", error);
			return false;
		}
	}

	/**
	 * 处理窗口消息
	 */
	processMessages(): boolean {
		try {
			// 分配内存
			const msgPtr = koffi.alloc(MSG, 1);

			// 检查是否有消息需要处理
			while (PeekMessageA(msgPtr, null, 0, 0, PM_REMOVE)) {
				// 读取消息内容
				const msg = koffi.decode(msgPtr, MSG);

				// 处理退出消息
				if (msg.message === WM_QUIT) {
					console.log("收到WM_QUIT消息，退出程序");
					return false;
				}

				TranslateMessage(msgPtr);
				DispatchMessageA(msgPtr);
			}

			koffi.free(msgPtr);
			return true;
		} catch (error) {
			console.error("处理消息时出错:", error);
			return false;
		}
	}

	/**
	 * 清理资源
	 */
	cleanup() {
		console.log("清理绘制资源...");
		try {
			// 恢复原始位图
			if (this.hdcMem && this.oldBitmap) {
				SelectObject(this.hdcMem, this.oldBitmap);
			}

			// 删除位图对象
			if (this.hBitmap) {
				DeleteObject(this.hBitmap);
			}

			// 删除内存DC
			if (this.hdcMem) {
				DeleteDC(this.hdcMem);
			}

			// 释放窗口DC
			if (this.hwnd && this.hdcScreen) {
				ReleaseDC(this.hwnd, this.hdcScreen);
			}

			// 销毁窗口
			if (this.hwnd) {
				DestroyWindow(this.hwnd);
			}

			// 清理文字缓存
			for (const textObj of this.textCache.values()) {
				if (textObj.font) {
					DeleteObject(textObj.font);
				}
			}
			this.textCache.clear();
			
			// 清理画笔缓存
			for (const pen of this.penPool.values()) {
				DeleteObject(pen);
			}
			this.penPool.clear();
			
			// 清理画刷缓存
			for (const brush of this.brushPool.values()) {
				DeleteObject(brush);
			}
			this.brushPool.clear();

			console.log("资源清理完成");
		} catch (error) {
			console.error("清理资源时出错:", error);
		}
	}

	/**
	 * 开始绘制（准备背景）
	 */
	beginDraw() {
		// 使用透明色填充整个背景
		this.fillRect(
			{
				left: 0,
				top: 0,
				right: this.screenWidth,
				bottom: this.screenHeight,
			},
			this.transparentColor
		);
	}

	/**
	 * 结束绘制（将内容复制到窗口）
	 */
	endDraw() {
		// 将内存DC复制到窗口（整个屏幕）
		const bitBltResult = BitBlt(this.hdcScreen, 0, 0, this.screenWidth, this.screenHeight, this.hdcMem, 0, 0, SRCCOPY);
		if (!bitBltResult) {
			console.error("BitBlt复制到窗口失败");
		}
	}

	/**
	 * 获取画笔（使用对象池）
	 */
	private getPen(color: number, width: number): any {
		const key = `${color}_${width}`;
		
		// 如果池中已有，直接返回
		if (this.penPool.has(key)) {
			return this.penPool.get(key);
		}
		
		// 创建新画笔
		const pen = CreatePen(PS_SOLID, width, color);
		if (!pen) {
			console.error("创建画笔失败");
			return null;
		}
		
		// 添加到对象池
		this.penPool.set(key, pen);
		return pen;
	}

	/**
	 * 获取画刷（使用对象池）
	 */
	private getBrush(color: number): any {
		// 如果池中已有，直接返回
		if (this.brushPool.has(color)) {
			return this.brushPool.get(color);
		}
		
		// 创建新画刷
		const brush = CreateSolidBrush(color);
		if (!brush) {
			console.error("创建画刷失败");
			return null;
		}
		
		// 添加到对象池
		this.brushPool.set(color, brush);
		return brush;
	}

	/**
	 * 绘制矩形边框（内部透明）- 使用对象池优化
	 */
	drawRectOutline(left: number, top: number, right: number, bottom: number, color: number, width: number = 1) {
		// 1) 获取画笔（使用对象池）
		const hPen = this.getPen(color, width);
		if (!hPen) return;

		// 2) 取空画刷
		const hNullBrush = GetStockObject(NULL_BRUSH);
		if (!hNullBrush) {
			console.error(`GetStockObject 失败`);
			return;
		}

		// 3) 把新笔、新刷选入 DC，保存旧句柄
		const oldPen = SelectObject(this.hdcMem, hPen);
		const oldBrush = SelectObject(this.hdcMem, hNullBrush);

		// 4) 绘制边框
		const ok = Rectangle(this.hdcMem, left, top, right, bottom);

		// 5) 恢复旧对象
		SelectObject(this.hdcMem, oldPen);
		SelectObject(this.hdcMem, oldBrush);

		if (!ok) {
			console.error(`Rectangle 失败`);
		}
	}

	/**
	 * 绘制敌方位框 - 优化算法避免重复计算
	 */
	drawPlayerRect(x: number, y: number, width: number, height: number, health: number, distance: number = 0) {
		// 计算方框位置（x, y 是中心点）
		const halfWidth = width / 2;
		const halfHeight = height / 2;
		
		// 缓存矩形坐标
		const left = x - halfWidth;
		const top = y - halfHeight;
		const right = x + halfWidth;
		const bottom = y + halfHeight;

		// 根据血量选择颜色
		const color =
			health > 70
				? 0x0000ff00 // 绿色 (健康)
				: health > 30
				? 0x0000ffff // 黄色 (中等)
				: 0x000000ff; // 红色 (危险)

		// 绘制方框（四条边）
		// const thickness = distance < 1000 ? 2 : 1; // 根据距离调整线宽
		const thickness = 1
		// 使用单次绘制代替四次分开绘制
		this.drawRectOutline(left, top, right, bottom, color, thickness);
		
		// 绘制距离文本
		if(distance) {
			const distanceText = `${Math.round(distance)}m`;
			this.drawText(distanceText, x, top - 15, 0x00ffffff, 14, "center");
		}

		// 绘制血量文本
		this.drawHealthText(health, x, bottom + 5);
	}

	/**
	 * 绘制血量文本 - 优化位置计算
	 */
	drawHealthText(health: number, x: number, y: number) {
		const text = `${health} HP`;
		const color =
			health > 70
				? 0x0000ff00 // 绿色
				: health > 30
				? 0x0000ffff // 黄色
				: 0x000000ff; // 红色

		this.drawText(text, x, y, color, 14, "center");
	}

	/**
	 * 绘制FPS和玩家计数 - 优化文字渲染
	 */
	drawFpsText(fps: number, visibleTargets: number, totalTargets: number) {
		const text = `FPS: ${fps} | Players: ${visibleTargets}/${totalTargets}`;
		this.drawText(text, 20, 20, 0x0000ff00, 16, "left");
	}

	/**
	 * 绘制圆形 - 使用对象池优化
	 */
	drawCircle(x: number, y: number, radius: number, color: number, thickness: number = 1) {
		// 获取画笔（使用对象池）
		const hPen = this.getPen(color, thickness);
		if (!hPen) return;

		// 获取空画刷
		const hNullBrush = GetStockObject(NULL_BRUSH);
		if (!hNullBrush) {
			console.error("获取空画刷失败");
			return;
		}

		// 保存旧对象
		const oldPen = SelectObject(this.hdcMem, hPen);
		const oldBrush = SelectObject(this.hdcMem, hNullBrush);

		// 绘制椭圆（圆形）
		const ok = Ellipse(this.hdcMem, x - radius, y - radius, x + radius, y + radius);

		// 恢复并清理
		SelectObject(this.hdcMem, oldPen);
		SelectObject(this.hdcMem, oldBrush);

		if (!ok) {
			console.error("绘制圆形失败");
		}
	}

	/**
	 * 绘制线条 - 使用对象池优化
	 */
	drawLine(x1: number, y1: number, x2: number, y2: number, color: number, width: number = 1) {
		// 获取画笔（使用对象池）
		const hPen = this.getPen(color, width);
		if (!hPen) return;

		// 保存旧画笔
		const oldPen = SelectObject(this.hdcMem, hPen);

		// 移动到起点
		const moveOk = MoveToEx(this.hdcMem, x1, y1, null);

		// 绘制到终点
		const lineOk = LineTo(this.hdcMem, x2, y2);

		// 恢复旧画笔
		SelectObject(this.hdcMem, oldPen);

		if (!moveOk || !lineOk) {
			console.error("绘制线条失败");
		}
	}

	/**
	 * 高级文本绘制方法（带缓存优化和抗锯齿）
	 */
	drawText(
		text: string,
		x: number,
		y: number,
		color: number = 0x00ffffff,
		fontSize: number = 16,
		align: "left" | "center" | "right" = "center"
	) {
		try {
			// 检查缓存
			const cacheKey = `${text}_${fontSize}_${color}`;
			let cache = this.textCache.get(cacheKey);

			if (!cache) {
				// 创建字体 - 使用ClearType渲染
				const font = CreateFontA(
					-fontSize, // 负值表示使用字符高度
					0,
					0,
					0,
					FW_BOLD,
					0,
					0,
					0,
					GB2312_CHARSET,
					OUT_DEFAULT_PRECIS,
					CLIP_DEFAULT_PRECIS,
					CLEARTYPE_QUALITY, // 使用ClearType渲染
					DEFAULT_PITCH,
					"Microsoft YaHei" // 微软雅黑支持中文
				);

				if (!font) {
					console.error("创建字体失败");
					return;
				}

				// 计算文本尺寸（更准确的估算）
				const width = this.calculateTextWidth(text, fontSize);
				const height = fontSize * 1.2; // 增加行高

				// 保存到缓存
				cache = {
					font,
					width,
					height,
				};

				this.textCache.set(cacheKey, cache);
			}

			// 选择缓存字体
			const oldFont = SelectObject(this.hdcMem, cache.font);
			SetTextColor(this.hdcMem, color);
			SetBkMode(this.hdcMem, TRANSPARENT); // 透明背景

			// 根据对齐方式调整位置（更精确的定位）
			let drawX = x;
			let drawY = y;
			
			if (align === "center") {
				drawX = Math.round(x - cache.width / 2);
			} else if (align === "right") {
				drawX = Math.round(x - cache.width);
			}
			
			// 垂直居中调整
			drawY = Math.round(y - cache.height / 2) + 2; // 微调垂直位置

			// 绘制文本
			TextOutA(this.hdcMem, drawX, drawY, text, text.length);

			// 恢复原始字体
			SelectObject(this.hdcMem, oldFont);
		} catch (error) {
			console.error("绘制文本时出错:", error);
		}
	}

	/**
	 * 更准确的文本宽度计算
	 */
	calculateTextWidth(text: string, fontSize: number): number {
		// 更精确的宽度估算（考虑字体和字符）
		return text.length * fontSize * 0.58; // 调整系数提高精度
	}

	/**
	 * 填充矩形 - 使用对象池优化
	 */
	fillRect(rect: { left: number; top: number; right: number; bottom: number }, colorref: number) {
		// 获取画刷（使用对象池）
		const hBrush = this.getBrush(colorref);
		if (!hBrush) return;

		// 创建RECT对象
		const rectObj = {
			left: rect.left,
			top: rect.top,
			right: rect.right,
			bottom: rect.bottom,
		};

		// 填充矩形
		const ok = FillRect(this.hdcMem, rectObj, hBrush);

		if (!ok) {
			console.error(`FillRect 失败`);
		}
	}
}
