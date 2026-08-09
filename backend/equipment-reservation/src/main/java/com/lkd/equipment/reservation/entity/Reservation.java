package com.lkd.equipment.reservation.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("biz_reservation")
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 预约单号 (全局唯一)
     */
    private String reservationNo;

    /**
     * 关联的设备 ID
     */
    private Long equipmentId;

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
     * 逻辑删除标识 (0:未删除, 1:已删除)
     */
    @TableLogic
    private Integer deleted;

    /**
     * 记录创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 记录更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}