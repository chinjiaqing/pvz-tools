import koffi from "koffi";
import { PlayerRect } from "./types";

// ========== 类型定义 ==========
koffi.alias("HWND", "void*");
koffi.alias("HDC", "void*");
koffi.alias("HBITMAP", "void*");
koffi.alias("HGDIOBJ", "void*");
koffi.alias("HBRUSH", "void*");
koffi.alias("HPEN", "void*");
koffi.alias("COLORREF", "uint32");
koffi.alias("DWORD", "uint32");

// 定义RECT结构
const RECT = koffi.struct("RECT", {
    left: "long",
    top: "long",
    right: "long",
    bottom: "long"
});

// ========== 加载DLL和函数声明 ==========
const user32 = koffi.load("user32.dll");
const gdi32 = koffi.load("gdi32.dll");

// 基础函数
const GetDC = user32.func("HDC __stdcall GetDC(HWND hWnd)");
const ReleaseDC = user32.func("int __stdcall ReleaseDC(HWND hWnd, HDC hDC)");
const GetSystemMetrics = user32.func("int __stdcall GetSystemMetrics(int nIndex)");
const CreateCompatibleDC = gdi32.func("HDC __stdcall CreateCompatibleDC(HDC hdc)");
const CreateCompatibleBitmap = gdi32.func("HBITMAP __stdcall CreateCompatibleBitmap(HDC hdc, int cx, int cy)");
const SelectObject = gdi32.func("HGDIOBJ __stdcall SelectObject(HDC hdc, HGDIOBJ h)");
const DeleteObject = gdi32.func("int __stdcall DeleteObject(HGDIOBJ hObject)");
const DeleteDC = gdi32.func("bool __stdcall DeleteDC(HDC hdc)");
const BitBlt = gdi32.func("bool __stdcall BitBlt(HDC hdcDest, int x, int y, int w, int h, HDC hdcSrc, int xSrc, int ySrc, uint32 rop)");

// 绘图函数
const CreateSolidBrush = gdi32.func("HBRUSH __stdcall CreateSolidBrush(COLORREF crColor)");
const FillRect = user32.func("int __stdcall FillRect(HDC hDC, RECT* lprc, HBRUSH hbr)");
const CreatePen = gdi32.func("HPEN __stdcall CreatePen(int fnPenStyle, int nWidth, COLORREF crColor)");
const MoveToEx = gdi32.func("bool __stdcall MoveToEx(HDC hdc, int x, int y, void* lpPoint)");
const LineTo = gdi32.func("bool __stdcall LineTo(HDC hdc, int x, int y)");
const CreateFont = gdi32.func("HGDIOBJ __stdcall CreateFontA(int nHeight, int nWidth, int nEscapement, int nOrientation, int fnWeight, DWORD fdwItalic, DWORD fdwUnderline, DWORD fdwStrikeOut, DWORD fdwCharSet, DWORD fdwOutputPrecision, DWORD fdwClipPrecision, DWORD fdwQuality, DWORD fdwPitchAndFamily, const char* lpszFace)");
const SetTextColor = gdi32.func("COLORREF __stdcall SetTextColor(HDC hdc, COLORREF color)");
const SetBkMode = gdi32.func("int __stdcall SetBkMode(HDC hdc, int mode)");
const TextOutA = gdi32.func("bool __stdcall TextOutA(HDC hdc, int x, int y, const char* lpString, int c)");
const GetStockObject = gdi32.func("HGDIOBJ __stdcall GetStockObject(int i)");

// ========== 常量定义 ==========
const SRCCOPY = 0x00CC0020;
const TRANSPARENT = 1;
const FW_NORMAL = 400;
const FW_BOLD = 700;
const DEFAULT_CHARSET = 1;
const OUT_DEFAULT_PRECIS = 0;
const CLIP_DEFAULT_PRECIS = 0;
const DEFAULT_QUALITY = 0;
const DEFAULT_PITCH = 0;
const PS_SOLID = 0;
const NULL_BRUSH = 5;


// ========== Drawer 类 ==========
export class Drawer {
    // 屏幕尺寸
    public screenWidth = 0;
    public screenHeight = 0;
    
    // GDI资源
    private hdcScreen = null;
    private hdcMem = null;
    private hBitmap = null;
    private oldBitmap = null;
    
    // 文字缓存
    private textCache = new Map();
    
    constructor() {}
    
    /**
     * 初始化绘制系统
     * @returns 是否初始化成功
     */
    async initialize() {
        try {
            console.log("开始初始化绘制系统...");
            
            // 获取屏幕尺寸
            this.screenWidth = GetSystemMetrics(0); // SM_CXSCREEN
            this.screenHeight = GetSystemMetrics(1); // SM_CYSCREEN
            
            console.log(`屏幕尺寸: ${this.screenWidth}x${this.screenHeight}`);
            
            if (this.screenWidth <= 0 || this.screenHeight <= 0) {
                console.error("无效的屏幕尺寸");
                return false;
            }
            
            // 获取整个屏幕的DC (NULL = 0)
            this.hdcScreen = GetDC(null);
            if (!this.hdcScreen) {
                console.error("获取屏幕DC失败，请以管理员权限运行");
                return false;
            }
            console.log("获取屏幕DC成功");
            
            // 创建内存DC
            this.hdcMem = CreateCompatibleDC(this.hdcScreen);
            if (!this.hdcMem) {
                console.error("创建内存DC失败");
                return false;
            }
            console.log("创建内存DC成功");
            
            // 创建兼容位图（屏幕大小）
            this.hBitmap = CreateCompatibleBitmap(this.hdcScreen, this.screenWidth, this.screenHeight);
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
            
            return true;
        } catch (error) {
            console.error("初始化过程中发生错误:", error);
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
            
            // 释放屏幕DC
            if (this.hdcScreen) {
                ReleaseDC(null, this.hdcScreen);
            }
            
            // 清理文字缓存
            for (const textObj of this.textCache.values()) {
                if (textObj.font) {
                    DeleteObject(textObj.font);
                }
            }
            this.textCache.clear();
            
            console.log("资源清理完成");
        } catch (error) {
            console.error("清理资源时出错:", error);
        }
    }
    
    /**
     * 开始绘制（捕获屏幕背景）
     */
    beginDraw() {
        // 从屏幕捕获当前背景（整个屏幕）
        const bitBltResult = BitBlt(
            this.hdcMem, 
            0, 
            0, 
            this.screenWidth, 
            this.screenHeight, 
            this.hdcScreen, 
            0, 
            0, 
            SRCCOPY
        );
        if (!bitBltResult) {
            console.error("BitBlt背景捕获失败");
        }
    }
    
    /**
     * 结束绘制（将内容复制回屏幕）
     */
    endDraw() {
        // 将内存DC复制到屏幕（整个屏幕）
        const bitBltResult = BitBlt(
            this.hdcScreen, 
            0, 
            0, 
            this.screenWidth, 
            this.screenHeight, 
            this.hdcMem, 
            0, 
            0, 
            SRCCOPY
        );
        if (!bitBltResult) {
            console.error("BitBlt复制到屏幕失败");
        }
    }
    
    /**
     * 绘制矩形边框（内部透明）
     */
    drawRectOutline(left, top, right, bottom, color, width = 1) {
        // 1) 创建实线画笔
        const hPen = CreatePen(PS_SOLID, width, color);
        if (!hPen) {
            console.error(`CreatePen 失败`);
            return;
        }
        
        // 2) 取空画刷
        const hNullBrush = GetStockObject(NULL_BRUSH);
        if (!hNullBrush) {
            console.error(`GetStockObject 失败`);
            DeleteObject(hPen);
            return;
        }
        
        // 3) 把新笔、新刷选入 DC，保存旧句柄
        const oldPen = SelectObject(this.hdcMem, hPen);
        const oldBrush = SelectObject(this.hdcMem, hNullBrush);
        
        // 4) 绘制边框（内部使用空刷，不做填充）
        const ok = gdi32.func("bool __stdcall Rectangle(HDC hdc, int left, int top, int right, int bottom)")(
            this.hdcMem, left, top, right, bottom
        );
        
        // 5) 恢复旧对象 & 删除新建画笔
        SelectObject(this.hdcMem, oldPen);
        SelectObject(this.hdcMem, oldBrush);
        DeleteObject(hPen);
        
        if (!ok) {
            console.error(`Rectangle 失败`);
        }
    }
    
    /**
     * 绘制敌方位框（使用预计算矩形）
     * @param rect 预计算的矩形信息 {x, y, width, height, valid}
     * @param health 目标血量
     * @param distance 到目标的距离
     */
    drawPlayerRect(rect: PlayerRect, health: number, distance?: number) {
        // 检查矩形是否有效
        // if (!rect.valid) return;
        
        // 计算方框位置（rect.x, rect.y 是中心点）
        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;
        
        // 根据血量选择颜色
        const color = health > 70 ? 0x0000FF00 :  // 绿色 (健康)
                      health > 30 ? 0x0000FFFF :  // 黄色 (中等)
                                    0x000000FF;   // 红色 (危险)
        
        // 绘制方框（四条边）
        // const thickness = distance < 1000 ? 2 : 1; // 根据距离调整线宽
        const thickness = 1
        
        // 上边框
        this.drawRectOutline(
            rect.x - halfWidth, 
            rect.y - halfHeight, 
            rect.x + halfWidth, 
            rect.y - halfHeight + thickness,
            color,
            thickness
        );
        
        // 下边框
        this.drawRectOutline(
            rect.x - halfWidth, 
            rect.y + halfHeight - thickness, 
            rect.x + halfWidth, 
            rect.y + halfHeight,
            color,
            thickness
        );
        
        // 左边框
        this.drawRectOutline(
            rect.x - halfWidth, 
            rect.y - halfHeight, 
            rect.x - halfWidth + thickness, 
            rect.y + halfHeight,
            color,
            thickness
        );
        
        // 右边框
        this.drawRectOutline(
            rect.x + halfWidth - thickness, 
            rect.y - halfHeight, 
            rect.x + halfWidth, 
            rect.y + halfHeight,
            color,
            thickness
        );
        
        // 绘制距离文本
        // const distanceText = `${Math.round(distance)}m`;
        // this.drawText(
        //     distanceText, 
        //     rect.x, 
        //     rect.y - halfHeight - 15, 
        //     0x00FFFFFF, 
        //     14
        // );
        
        // 绘制血量文本
        this.drawHealthText(health, rect.x, rect.y + halfHeight + 5);
    }
    
    /**
     * 绘制血量文本
     * @param health 血量值
     * @param x 屏幕X坐标
     * @param y 屏幕Y坐标
     */
    drawHealthText(health: number, x: number, y: number) {
        const text = `${health} HP`;
        const color = health > 70 ? 0x0000FF00 :  // 绿色
                      health > 30 ? 0x0000FFFF :  // 黄色
                                    0x000000FF;   // 红色
        
        this.drawText(text, x, y, color, 14);
    }
    
    /**
     * 绘制FPS和玩家计数
     * @param fps 当前FPS
     * @param visibleTargets 可见目标数量
     * @param totalTargets 总目标数量
     */
    drawFpsText(fps: number, visibleTargets: number, totalTargets: number) {
        const text = `FPS: ${fps} | 玩家: ${visibleTargets}/${totalTargets}`;
        this.drawText(text, 20, 20, 0x0000FF00, 16, 'left');
    }
    
    /**
     * 通用文本绘制方法（带缓存优化）
     * @param text 要绘制的文本
     * @param x 屏幕X坐标
     * @param y 屏幕Y坐标
     * @param color 文本颜色 (RGB)
     * @param fontSize 字体大小
     * @param align 文本对齐方式 ('left', 'center', 'right')
     */
    drawText(text: string, x: number, y: number, color = 0x00FFFFFF, fontSize = 16, align = 'center') {
        try {
            // 检查缓存
            const cacheKey = `${text}_${fontSize}_${color}`;
            let cache = this.textCache.get(cacheKey);
            
            if (!cache) {
                // 创建字体
                const font = CreateFont(
                    fontSize, 0, 0, 0, 
                    FW_BOLD, 
                    0, 0, 0,
                    DEFAULT_CHARSET, 
                    OUT_DEFAULT_PRECIS,
                    CLIP_DEFAULT_PRECIS, 
                    DEFAULT_QUALITY,
                    DEFAULT_PITCH, 
                    "Arial"
                );
                
                if (!font) {
                    console.error("创建字体失败");
                    return;
                }
                
                // 保存到缓存
                cache = {
                    font,
                    width: this.calculateTextWidth(text, fontSize),
                    height: fontSize
                };
                
                this.textCache.set(cacheKey, cache);
            }
            
            // 选择缓存字体
            const oldFont = SelectObject(this.hdcMem, cache.font);
            SetTextColor(this.hdcMem, color);
            SetBkMode(this.hdcMem, TRANSPARENT);
            
            // 根据对齐方式调整位置
            let drawX = x;
            if (align === 'center') {
                drawX = Math.round(x - cache.width / 2);
            } else if (align === 'right') {
                drawX = Math.round(x - cache.width);
            }
            
            // 绘制文本
            TextOutA(
                this.hdcMem, 
                Math.round(drawX), 
                Math.round(y - cache.height / 2), 
                text, 
                text.length
            );
            
            // 恢复原始字体
            SelectObject(this.hdcMem, oldFont);
        } catch (error) {
            console.error("绘制文本时出错:", error);
        }
    }
    
    /**
     * 计算文本宽度
     * @param text 要测量的文本
     * @param fontSize 字体大小
     * @returns 文本宽度（像素）
     */
    calculateTextWidth(text: string, fontSize: number): number {
        // 简单估算：每个字符的平均宽度（假设等宽字体）
        return text.length * fontSize * 0.6;
    }
    
    /**
     * 填充矩形
     */
    fillRect(rect: any, colorref: number) {
        const hBrush = CreateSolidBrush(colorref);
        if (!hBrush) {
            console.error(`CreateSolidBrush 失败`);
            return;
        }
        
        const rectObj = {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom
        }
        
        const ok = FillRect(this.hdcMem, rectObj, hBrush);
        DeleteObject(hBrush);
        
        if (!ok) {
            console.error(`FillRect 失败`);
        }
    }
}