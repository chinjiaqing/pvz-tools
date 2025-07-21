import { STORE_RECT_SETTING } from "../../store.service";
import { PlayerInfo } from "./types";


type ScreenRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  valid: boolean; // 是否有效（是否在视野内）
};

export function calcPlayerRectSize(
  myPlayer: PlayerInfo,
  otherPlayer:PlayerInfo, 
  screenWidth: number,
  screenHeight: number
): ScreenRect {
  const subX = otherPlayer.x - myPlayer.x;
  const subY = otherPlayer.y - myPlayer.y;
  const subZ = otherPlayer.z - myPlayer.z;

  const disOnTop = Math.sqrt(subX ** 2 + subY ** 2);
  const disOnSpace = Math.sqrt(subX ** 2 + subY ** 2 + subZ ** 2);

  if (disOnTop === 0 || disOnSpace === 0) return { x: 0, y: 0, width: 0, height: 0, valid: false };

  const angleDWX = Math.atan2(subY, subX) * (180 / Math.PI); // 与 +X 轴夹角
  const angleDZX = (myPlayer?.fov_x || 0) - angleDWX;
  const disDZX = Math.sin(degToRad(angleDZX)) * disOnTop;
  const disWZX = Math.sqrt(disOnTop ** 2 - disDZX ** 2) * 1.3;

  if (!Number.isFinite(disWZX) || Math.abs(angleDZX) > 55) {
    return { x: 0, y: 0, width: 0, height: 0, valid: false };
  }

  const screenX = (disDZX / disWZX) * (screenWidth / 2) + screenWidth / 2;

  const angleDWZ = Math.asin(subZ / disOnSpace) * (180 / Math.PI);
  const angleDZY =
    otherPlayer.z > myPlayer.z
      ? (myPlayer.fov_y || 0) + Math.abs(angleDWZ)
      : (myPlayer.fov_y || 0) - Math.abs(angleDWZ);

  const disDZY = Math.sin(degToRad(angleDZY)) * disOnSpace;
  const disWZY = Math.sqrt(disOnSpace ** 2 - disDZY ** 2) * 0.8;

  if (!Number.isFinite(disWZY)) {
    return { x: 0, y: 0, width: 0, height: 0, valid: false };
  }

  const screenY = screenHeight / 2 - (disDZY / disWZY) * (screenHeight / 2);
  
  // 根据距离动态缩放方框尺寸
  const width = Math.max(1, Math.floor(STORE_RECT_SETTING.scaleX / disOnSpace));
  // const height = Math.max(1, Math.floor(49999 / disOnSpace));
  const height = Math.max(1, Math.floor(STORE_RECT_SETTING.scaleY / disOnSpace));
  
  const adjustedScreenY = screenY + height * STORE_RECT_SETTING.offsetY; // 或 height * 0.25
  const adjustedScreenX = screenX + width * STORE_RECT_SETTING.offsetX; // 或 height * 0.25

  return {
    x: adjustedScreenX,
    y: adjustedScreenY,
    width,
    height,
    valid: true
  };
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
