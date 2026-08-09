package com.lkd.equipment.reservation.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lkd.equipment.common.Result; // 请确保路径正确，如果不正确请按 Alt+Enter 导入您实际的 Result 类
import com.lkd.equipment.reservation.entity.Equipment;
import com.lkd.equipment.reservation.entity.EquipmentQueryDTO;
import com.lkd.equipment.reservation.service.IEquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/equipment")
public class EquipmentController {

    @Autowired
    private IEquipmentService equipmentService;

    /**
     * 分页条件查询科研设备大厅
     */
    @PostMapping("/page")
    public Result<Page<Equipment>> getEquipmentPage(@RequestBody EquipmentQueryDTO queryDTO) {
        Page<Equipment> pageResult = equipmentService.queryEquipmentPage(queryDTO);
        return Result.success(pageResult); // 使用咱们在 common 模块封装好的统一响应
    }
}