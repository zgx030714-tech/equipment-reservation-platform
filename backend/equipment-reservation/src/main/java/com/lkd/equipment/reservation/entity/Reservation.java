package com.lkd.equipment.reservation.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("biz_reservation")
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 🌟 修复 1：把 reservationNo 改成 orderNo，并强行映射数据库的 order_no 字段
     */
    @TableField("order_no")
    private String orderNo;

    /**
     * 🌟 修复 2：把 equipmentId 改成 equipId，并强行映射数据库的 equip_id 字段
     */
    @TableField("equip_id")
    private Long equipId;

    /**
     * 预约人 (用户 ID)
     */
    private Long userId;

    /**
     * 预约开始时间
     */
    private LocalDateTime startTime;

    /**
     * 预约结束时间
     */
    private LocalDateTime endTime;

    /**
     * 预约状态 (0:待审核 1:已通过 2:已驳回 3:进行中 4:已完成 5:已违约)
     */
    private Integer status;

    /**
     * 🌟 修复 3：补充上真实的费用和样品信息字段，替代原来的空方法，保证数据能存进数据库！
     */
    private BigDecimal totalFee;
    private String sampleInfo;

    /**
     * 逻辑删除标识 (0:未删除, 1:已删除)
     */
    @TableLogic
    private Integer deleted;

//    /**
//     * 记录创建时间
//     */
//    @TableField(fill = FieldFill.INSERT)
//    private LocalDateTime createTime;
//
//    /**
//     * 记录更新时间
//     */
//    @TableField(fill = FieldFill.INSERT_UPDATE)
//    private LocalDateTime updateTime;
}