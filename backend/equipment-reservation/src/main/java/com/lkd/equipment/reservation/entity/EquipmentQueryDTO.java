package com.lkd.equipment.reservation.entity;

import lombok.Data;

/**
 * 设备分页查询条件 DTO
 */
@Data
public class EquipmentQueryDTO {
    private Integer pageNo = 1;
    private Integer pageSize = 10;
    private String equipName;
    private Integer equipType;
    private Integer status;

    /** 学科领域 */
    private String filterField;

    /** 设备状态 (前端可能传 idle/occupied/maintenance 等) */
    private String filterStatus;

    /** 资质要求 (前端可能传 yes/no 等) */
    private String filterQual;
}