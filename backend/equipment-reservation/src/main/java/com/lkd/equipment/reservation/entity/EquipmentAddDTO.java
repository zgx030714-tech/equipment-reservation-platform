package com.lkd.equipment.reservation.entity;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class EquipmentAddDTO {
    private String equipName;
    private String assetCode;
    private Integer equipType;
    private String techField;
    private Integer qualCtrlType;

    // 新增的录入信息
    private Long orgId;          // 实验室ID
    private String photoUrl;     // 照片
    private String manualUrl;    // 手册
    private Integer billingMode; // 0-免费, 1-按时长
    private BigDecimal unitPrice;// 单价
}