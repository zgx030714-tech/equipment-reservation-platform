package com.lkd.equipment.reservation.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ReservationSubmitDTO {
    private Long equipId;
    private List<String> timeSlots; // 选中的时间段，例如 ["2026-08-07_8", "2026-08-07_9"]
    private String sampleName;      // 测试样品信息
    private Boolean isHazardous;    // 是否有毒有害
    private String proofFileUrl;    // 资质证明材料路径
    private BigDecimal estimatedFee;// 预估费用
}