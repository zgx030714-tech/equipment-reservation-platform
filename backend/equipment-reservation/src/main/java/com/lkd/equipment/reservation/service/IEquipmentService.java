package com.lkd.equipment.reservation.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lkd.equipment.reservation.entity.Equipment;
import com.lkd.equipment.reservation.entity.EquipmentQueryDTO;

public interface IEquipmentService extends IService<Equipment> {
    /**
     * 分页条件查询科研设备大厅
     */
    Page<Equipment> queryEquipmentPage(EquipmentQueryDTO queryDTO);
}