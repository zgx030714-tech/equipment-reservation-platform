package com.lkd.equipment.reservation.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;

@Data
@TableName("biz_equipment_rule")
public class EquipmentRule {
    @TableId
    private Long equipId;        // 关联设备ID
    private Integer billingMode; // 计费模式: 0-免费, 1-按时长
    private BigDecimal unitPrice;// 计费单价
}