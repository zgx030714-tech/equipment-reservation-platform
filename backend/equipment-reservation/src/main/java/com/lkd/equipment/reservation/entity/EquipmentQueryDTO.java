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
}