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
    public Result<Page<Equipment>> queryEquipmentPage(@RequestBody EquipmentQueryDTO queryDTO) {
        Page<Equipment> pageResult = equipmentService.queryEquipmentPage(queryDTO);
        return Result.success(pageResult); // 使用咱们在 common 模块封装好的统一响应
    }

    /**
     * 录入新设备接口
     */
    @PostMapping("/add")
    public Result addEquipment(@RequestBody Equipment equipment) {
        // 提示：前端通常只传名称、编号等核心数据，后端需要补齐默认状态
        equipment.setStatus(1); // 默认初始化状态为 1-空闲中
        equipment.setIsDeleted(0); // 默认未被逻辑删除为 0-正常

        // 为了方便本地联调，如果没有传归属和负责人，先给个默认值 1
        if(equipment.getOrgId() == null) equipment.setOrgId(1L);
        if(equipment.getManagerId() == null) equipment.setManagerId(1L);

        // 调用 MyBatis-Plus 提供的 save 方法直接保存到数据库
        boolean success = equipmentService.save(equipment);

        if (success) {
            // MyBatis-Plus 的 save 执行后，会自动将生成的雪花 ID 注入到 equipment 对象中
            // 这里直接将完整的 equipment 对象返回给前端
            return Result.success(equipment);
        } else {
            return Result.error(500, "录入新设备失败，请重试");
        }
    }

    /**
     * 下架（逻辑删除）设备
     */
    @DeleteMapping("/{id}")
    public Result<String> deleteEquipment(@PathVariable("id") Long id) {
        // 直接调用 MyBatis-Plus 自带的 removeById 方法触发逻辑删除
        boolean success = equipmentService.removeById(id);
        if (success) {
            return Result.success("设备下架成功！");
        }
        return Result.error(500,"设备下架失败，请稍后重试");
    }
}