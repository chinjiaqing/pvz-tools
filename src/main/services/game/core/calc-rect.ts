import { MyPlayerInfo, PlayerInfo, PlayerRect } from "./types";

export function calcPlayerRectSize(
    myPlayer: MyPlayerInfo,
    otherPlayer: PlayerInfo,
    screenWidth: number,
    screenHeight: number
): PlayerRect | null {
    // 如果玩家死亡或无效，直接返回
    if (otherPlayer.health <= 0) {
        return null;
    }

    // 计算坐标差值
    const sub_x = otherPlayer.x - myPlayer.x;
    const sub_y = otherPlayer.y - myPlayer.y;
    const sub_z = otherPlayer.z - myPlayer.z;

    // 计算水平距离和空间距离
    const dis_on_top = Math.sqrt(sub_x * sub_x + sub_y * sub_y);
    const dis_on_space = Math.sqrt(dis_on_top * dis_on_top + sub_z * sub_z);

    // 初始化结果对象
    const result: PlayerRect = {
        x: 0,
        y: 0,
        size: dis_on_space, // 尺寸基于空间距离
        visible: false
    };

    // 第一象限：敌人在右上方
    if (sub_y > 0 && sub_x > 0) {
        // 计算横向角度
        const angle_DW_x = Math.atan(sub_y / sub_x) * 180 / Math.PI;
        let angle_DZ_x = myPlayer.fov_x - angle_DW_x;

        // 判断是否在横向可视范围内
        if (angle_DZ_x > -55 && angle_DZ_x < 50) {
            // 计算纵向角度
            const angle_DW_space = Math.asin(Math.abs(sub_z) / dis_on_space) * 180 / Math.PI;
            let angle_DZ_y = myPlayer.fov_y;
            
            // 根据敌人在我上方/下方调整角度
            if (otherPlayer.z > myPlayer.z) {
                angle_DZ_y += angle_DW_space;
            } else {
                angle_DZ_y -= angle_DW_space;
            }
            
            // 计算纵向距离
            const dis_DZ_y = Math.sin(angle_DZ_y * Math.PI / 180) * dis_on_space;
            const dis_WZ_y = Math.sqrt(dis_on_space * dis_on_space - dis_DZ_y * dis_DZ_y) * 0.80;
            
            // 计算屏幕坐标
            result.x = dis_on_top * Math.sin(angle_DZ_x * Math.PI / 180) * 
                       (screenWidth / 2) / dis_on_top + (screenWidth / 2);
            result.y = (screenHeight / 2) - dis_DZ_y / dis_WZ_y * (screenHeight / 2);
            result.visible = true;
        }
    }
    // 第二象限：敌人在左上方
    else if (sub_y > 0 && sub_x < 0) {
        // 计算横向角度
        const angle_DW_x = Math.atan(sub_y / sub_x) * 180 / Math.PI;
        let angle_DZ_x = myPlayer.fov_x - angle_DW_x - 180;
        
        // 判断是否在横向可视范围内
        if ((angle_DZ_x > -54 && angle_DZ_x < 50) || 
            (angle_DZ_x > -360 && angle_DZ_x < -305)) {
            
            // 计算纵向角度
            const angle_DW_space = Math.asin(Math.abs(sub_z) / dis_on_space) * 180 / Math.PI;
            let angle_DZ_y = myPlayer.fov_y;
            
            // 根据敌人在我上方/下方调整角度
            if (otherPlayer.z > myPlayer.z) {
                angle_DZ_y += angle_DW_space;
            } else {
                angle_DZ_y -= angle_DW_space;
            }
            
            // 计算纵向距离
            const dis_DZ_y = Math.sin(angle_DZ_y * Math.PI / 180) * dis_on_space;
            const dis_WZ_y = Math.sqrt(dis_on_space * dis_on_space - dis_DZ_y * dis_DZ_y) * 0.80;
            
            // 计算屏幕坐标
            result.x = dis_on_top * Math.sin(angle_DZ_x * Math.PI / 180) * 
                       (screenWidth / 2) / dis_on_top + (screenWidth / 2);
            result.y = (screenHeight / 2) - dis_DZ_y / dis_WZ_y * (screenHeight / 2);
            result.visible = true;
        }
    }
    // 第三象限：敌人在左下方
    else if (sub_y < 0 && sub_x < 0) {
        // 计算横向角度
        const angle_DW_x = Math.atan(sub_y / sub_x) * 180 / Math.PI;
        let angle_DZ_x = myPlayer.fov_x - angle_DW_x - 180;
        
        // 判断是否在横向可视范围内
        if ((angle_DZ_x > -410 && angle_DZ_x < -310) || 
            (angle_DZ_x > -50 && angle_DZ_x < 0)) {
            
            // 计算纵向角度
            const angle_DW_space = Math.asin(Math.abs(sub_z) / dis_on_space) * 180 / Math.PI;
            let angle_DZ_y = myPlayer.fov_y;
            
            // 根据敌人在我上方/下方调整角度
            if (otherPlayer.z > myPlayer.z) {
                angle_DZ_y += angle_DW_space;
            } else {
                angle_DZ_y -= angle_DW_space;
            }
            
            // 计算纵向距离
            const dis_DZ_y = Math.sin(angle_DZ_y * Math.PI / 180) * dis_on_space;
            const dis_WZ_y = Math.sqrt(dis_on_space * dis_on_space - dis_DZ_y * dis_DZ_y) * 0.80;
            
            // 计算屏幕坐标
            result.x = dis_on_top * Math.sin(angle_DZ_x * Math.PI / 180) * 
                       (screenWidth / 2) / dis_on_top + (screenWidth / 2);
            result.y = (screenHeight / 2) - dis_DZ_y / dis_WZ_y * (screenHeight / 2);
            result.visible = true;
        }
    }
    // 第四象限：敌人在右下方
    else if (sub_y < 0 && sub_x > 0) {
        // 计算横向角度
        const angle_DW_x = Math.atan(sub_y / sub_x) * 180 / Math.PI;
        let angle_DZ_x = myPlayer.fov_x - angle_DW_x;
        
        // 判断是否在横向可视范围内
        if (angle_DZ_x > -55 && angle_DZ_x < 50) {
            // 计算纵向角度
            const angle_DW_space = Math.asin(Math.abs(sub_z) / dis_on_space) * 180 / Math.PI;
            let angle_DZ_y = myPlayer.fov_y;
            
            // 根据敌人在我上方/下方调整角度
            if (otherPlayer.z > myPlayer.z) {
                angle_DZ_y += angle_DW_space;
            } else {
                angle_DZ_y -= angle_DW_space;
            }
            
            // 计算纵向距离
            const dis_DZ_y = Math.sin(angle_DZ_y * Math.PI / 180) * dis_on_space;
            const dis_WZ_y = Math.sqrt(dis_on_space * dis_on_space - dis_DZ_y * dis_DZ_y) * 0.80;
            
            // 计算屏幕坐标
            result.x = dis_on_top * Math.sin(angle_DZ_x * Math.PI / 180) * 
                       (screenWidth / 2) / dis_on_top + (screenWidth / 2);
            result.y = (screenHeight / 2) - dis_DZ_y / dis_WZ_y * (screenHeight / 2);
            result.visible = true;
          }
        }
        result.y = result.y + 0.05 * result.y

    return result.visible ? result : null;
}