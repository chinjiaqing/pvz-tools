import { MyPlayerInfo, PlayerInfo, PlayerRect } from "./types";

/**
 * 计算敌人在屏幕上的框位置
 * @param player 敌人位置
 * @param self 本地玩家位置
 * @param fov_x 水平视角 [-180, 180]
 * @param fov_y 垂直视角 [-89, 89]
 * @param screenW 屏幕宽度（如1920）
 * @param screenH 屏幕高度（如1080）
 * @returns 若敌人在视野内，返回框位置；否则 null
 */
export function calcPlayerRectSize(
  player: MyPlayerInfo,
  self: PlayerInfo,
  fov_x: number,
  fov_y: number,
  screenW: number,
  screenH: number
): PlayerRect {

  const defaultRect:PlayerRect = {
    x:0,
    y:0,
    width:0,
    height:0
  }
  // 方向角差值
  let deltaX = player.x - self.x;
  let deltaY = player.y - self.y;
  let deltaZ = player.z - self.z;

  const disOnSpace = Math.sqrt(deltaX ** 2 + deltaY ** 2 + deltaZ ** 2);
  const disFlat = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  if (disOnSpace < 0.0001) return defaultRect;

  // 计算目标方位角
  let yaw = Math.atan2(deltaY, deltaX); // 水平方向
  let pitch = Math.atan2(deltaZ, disFlat); // 垂直方向

  // 转为角度
  yaw = yaw * 180 / Math.PI;
  pitch = pitch * 180 / Math.PI;

  // 计算相对角度（与视角偏移）
  let dx = yaw - fov_x;
  let dy = pitch - fov_y;

  // 范围修正 [-180,180]
  if (dx > 180) dx -= 360;
  if (dx < -180) dx += 360;

  // 判断是否在视野范围
  const fov_x_half = 90;
  const fov_y_half = 89;
  if (Math.abs(dx) > fov_x_half || Math.abs(dy) > fov_y_half) {
    return defaultRect; // 不在视野范围
  }

  // 映射到屏幕坐标
  const screenX = (screenW / 2) - (dx * (screenW / (fov_x_half * 2)));
  const screenY = (screenH / 2) + (dy * (screenH / (fov_y_half * 2)));

  // 计算宽高（与距离反比）
  const width = Math.max(2, Math.floor(20899 / disOnSpace));
  const height = Math.max(2, Math.floor(49999 / disOnSpace));

  return {
    x: Math.floor(screenX - width / 2),
    y: Math.floor(screenY - height / 2),
    width,
    height,
  };
}