package com.lkd.equipment.reservation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lkd.equipment.reservation.entity.Equipment;
import com.lkd.equipment.reservation.entity.EquipmentQueryDTO;
import com.lkd.equipment.reservation.mapper.EquipmentMapper;
import com.lkd.equipment.reservation.service.IEquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EquipmentServiceImpl extends ServiceImpl<EquipmentMapper, Equipment> implements IEquipmentService {

    @Autowired
    private EquipmentMapper equipmentMapper;

    @Override
    public Page<Equipment> queryEquipmentPage(EquipmentQueryDTO queryDTO) {
        Page<Equipment> page = new Page<>(queryDTO.getPageNo(), queryDTO.getPageSize());
        LambdaQueryWrapper<Equipment> queryWrapper = new LambdaQueryWrapper<>();

        // 1. 保留原有功能：按设备名称模糊查询、按设备类型精确查询
        queryWrapper.like(StringUtils.hasText(queryDTO.getEquipName()), Equipment::getEquipName, queryDTO.getEquipName())
                .eq(queryDTO.getEquipType() != null, Equipment::getEquipType, queryDTO.getEquipType());

        // 2. 按“学科领域”查询
        if (StringUtils.hasText(queryDTO.getFilterField()) && !"all".equals(queryDTO.getFilterField())) {
            queryWrapper.eq(Equipment::getTechField, queryDTO.getFilterField());
        }

        // 3. 按“设备状态”查询
        if (StringUtils.hasText(queryDTO.getFilterStatus()) && !"all".equals(queryDTO.getFilterStatus())) {
            int statusVal = 1;
            if ("occupied".equals(queryDTO.getFilterStatus())) {
                statusVal = 2;
            } else if ("maintenance".equals(queryDTO.getFilterStatus())) {
                statusVal = 3;
            }
            queryWrapper.eq(Equipment::getStatus, statusVal);
        } else if (queryDTO.getStatus() != null) {
            queryWrapper.eq(Equipment::getStatus, queryDTO.getStatus());
        }

        // 4. 🌟 修复核心：按“资质要求”查询 🌟
        if (StringUtils.hasText(queryDTO.getFilterQual()) && !"all".equals(queryDTO.getFilterQual())) {
            if ("yes".equals(queryDTO.getFilterQual())) {
                // 前端选了“需资质”：精确匹配 1 (强管控)
                queryWrapper.eq(Equipment::getQualCtrlType, 1);
            } else if ("no".equals(queryDTO.getFilterQual())) {
                // 前端选了“免资质”：只要不是 1 的（包含了录入时存的 2 或者 3），都算免资质！
                // ne 的意思是 Not Equal (不等于)
                queryWrapper.ne(Equipment::getQualCtrlType, 1);
            }
        }

        // 5. 按 ID 倒序排列
        queryWrapper.orderByDesc(Equipment::getId);

        return equipmentMapper.selectPage(page, queryWrapper);
    }
}