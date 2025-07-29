// Drawer.ts
import koffi from "koffi";
import { PlayerRect } from "./types";

// ------------- 类型定义与常量 -------------
koffi.alias("HDC", "void*");
koffi.alias("HPEN", "void*");
koffi.alias("HBRUSH", "void*");
koffi.alias("COLORREF", "uint32");
koffi.alias("DWORD", "uint32");

// GDI函数声明（仅保留必要部分）
const gdi32 = koffi.load("gdi32.dll");
const user32 = koffi.load("user32.dll");
const GetDC = user32.func("HDC __stdcall GetDC(void*)");
const ReleaseDC = user32.func("int __stdcall ReleaseDC(void*, HDC)");
const CreatePen = gdi32.func("HPEN __stdcall CreatePen(int, int, COLORREF)");
const GetStockObject = gdi32.func("void* __stdcall GetStockObject(int)");
const SelectObject = gdi32.func("void* __stdcall SelectObject(HDC, void*)");
const DeleteObject = gdi32.func("int __stdcall DeleteObject(void*)");
const Rectangle = gdi32.func("bool __stdcall Rectangle(HDC, int, int, int, int)");
const TextOutA = gdi32.func("bool __stdcall TextOutA(HDC, int, int, const char*, int)");
const CreateFontA = gdi32.func("void* __stdcall CreateFontA(int, int, int, int, int, DWORD, DWORD, DWORD, DWORD, DWORD, DWORD, DWORD, DWORD, const char*)");
const SetTextColor = gdi32.func("COLORREF __stdcall SetTextColor(HDC, COLORREF)");
const SetBkMode = gdi32.func("int __stdcall SetBkMode(HDC, int)");

// GDI常量
const PS_SOLID = 0;       // 实线画笔
const NULL_BRUSH = 5;     // 空画刷（不填充）
const TRANSPARENT = 1;    // 透明背景
const FW_BOLD = 700;      // 粗体字
const DEFAULT_CHARSET = 1;// 默认字符集

// ------------- Drawer类 -------------
export class Drawer {
  private hdc: number | null = null; // 屏幕DC
  private screenWidth: number = 0;
  private screenHeight: number = 0;

  constructor() {
    this.init();
  }
  initialize(){
    this.init()
  }
  /** 初始化GDI资源 */
  private init(): void {
    this.hdc = GetDC(null); // 获取全屏DC
    this.screenWidth = user32.func("int __stdcall GetSystemMetrics(int)")(0); // 屏幕宽度
    this.screenHeight = user32.func("int __stdcall GetSystemMetrics(int)")(1); // 屏幕高度
  }

  /** 清理GDI资源 */
  public cleanup(): void {
    if (this.hdc) ReleaseDC(null, this.hdc);
  }

  /**
   * 绘制矩形边框（内部透明）
   * @param rect 玩家屏幕矩形
   * @param color 边框颜色（格式：0x00BBGGRR，如绿色0x0000FF00）
   * @param thickness 边框厚度（像素）
   */
  public drawRectOutline(rect: PlayerRect, color: number, thickness: number = 2): void {
    if (!rect.valid || rect.width <= 0 || rect.height <= 0) return;

    // 1. 创建实线画笔
    const pen = CreatePen(PS_SOLID, thickness, color);
    if (!pen) return;

    // 2. 使用空画刷（不填充内部）
    const nullBrush = GetStockObject(NULL_BRUSH);
    if (!nullBrush) {
      DeleteObject(pen);
      return;
    }

    // 3. 保存旧GDI对象
    const oldPen = SelectObject(this.hdc, pen);
    const oldBrush = SelectObject(this.hdc, nullBrush);

    // 4. 绘制矩形（左上角+右下角）
    Rectangle(this.hdc, rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);

    // 5. 恢复旧对象并清理
    SelectObject(this.hdc, oldPen);
    SelectObject(this.hdc, oldBrush);
    DeleteObject(pen);
  }

  /**
   * 绘制玩家方框（含血量文本）
   * @param rect 玩家屏幕矩形
   * @param health 玩家血量（用于颜色判断）
   */
  public drawPlayerRect(rect: PlayerRect, health: number): void {
    // 1. 根据血量选择边框颜色
    const color = health > 70 ? 0x0000FF00 : // 绿色（健康）
                  health > 30 ? 0x0000FFFF : // 黄色（中等）
                                0x00FF0000;   // 红色（危险）

    // 2. 绘制边框
    this.drawRectOutline(rect, color, 2);

    // 3. 绘制血量文本（底部居中）
    this.drawText(
      `${health} HP`,
      rect.x + rect.width / 2,
      rect.y + rect.height + 5,
      0x00FFFFFF // 白色文本
    );
  }

  /**
   * 绘制文本（居中）
   * @param text 文本内容
   * @param x 文本中心X坐标
   * @param y 文本中心Y坐标
   * @param color 文本颜色
   */
  private drawText(text: string, x: number, y: number, color: number): void {
    // 1. 创建字体（Arial粗体，12号）
    const font = CreateFontA(
      12, 0, 0, 0, FW_BOLD, 0, 0, 0, DEFAULT_CHARSET, 0, 0, 0, 0, "Arial"
    );
    if (!font) return;

    // 2. 设置文本属性
    const oldFont = SelectObject(this.hdc, font);
    SetTextColor(this.hdc, color);
    SetBkMode(this.hdc, TRANSPARENT);

    // 3. 计算文本宽度（粗略估算）
    const textWidth = text.length * 8; // 每个字符约8像素
    const textX = x - textWidth / 2; // 中心X - 半宽
    const textY = y - 6; // 中心Y - 半高（12号字体高度约12像素）

    // 4. 绘制文本
    TextOutA(this.hdc, textX, textY, text, text.length);

    // 5. 恢复旧字体并清理
    SelectObject(this.hdc, oldFont);
    DeleteObject(font);
  }
}