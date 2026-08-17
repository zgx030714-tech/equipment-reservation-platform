package com.lkd.equipment.reservation.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lkd.equipment.common.Result;
import com.lkd.equipment.reservation.entity.Equipment;
import com.lkd.equipment.reservation.entity.EquipmentAddDTO; // 🌟 引入刚建好的DTO
import com.lkd.equipment.reservation.entity.EquipmentQueryDTO;
import com.lkd.equipment.reservation.service.IEquipmentService;
import com.lkd.equipment.reservation.service.impl.EquipmentServiceImpl; // 🌟 引入实现类
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
    public Result<Page<Equipment>> queryEquipmentPage(@RequestBody EquipmentQueryDTO queryDTO) {
        Page<Equipment> pageResult = equipmentService.queryEquipmentPage(queryDTO);
        return Result.success(pageResult);
    }

    /**
     * 录入新设备接口 (🌟 修复：改为接收带计费等信息的 DTO)
     */
    @PostMapping("/add")
    public Result<Equipment> addEquipment(@RequestBody EquipmentAddDTO dto) {
        // 调用 Service 里的新方法处理多表联调存入
        Equipment savedEq = ((EquipmentServiceImpl)equipmentService).addEquipmentWithRule(dto);
        return Result.success(savedEq);
    }

    /**
     * 下架（逻辑删除）设备
     */
    @DeleteMapping("/{id}")
    public Result<String> deleteEquipment(@PathVariable("id") Long id) {
        boolean success = equipmentService.removeById(id);
        if (success) {
            return Result.success("设备下架成功！");
        }
        return Result.error(500, "设备下架失败，请稍后重试");
    }
}