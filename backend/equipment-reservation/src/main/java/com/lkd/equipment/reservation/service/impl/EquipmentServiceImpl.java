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

    // 🌟 关键修改：显式注入 EquipmentMapper，不依赖父类的 baseMapper
    @Autowired
    private EquipmentMapper equipmentMapper;

    @Override
    public Page<Equipment> queryEquipmentPage(EquipmentQueryDTO queryDTO) {
        // 1. 构建分页对象
        Page<Equipment> page = new Page<>(queryDTO.getPageNo(), queryDTO.getPageSize());

        // 2. 构建条件查询器
        LambdaQueryWrapper<Equipment> queryWrapper = new LambdaQueryWrapper<>();

        queryWrapper.like(StringUtils.hasText(queryDTO.getEquipName()), Equipment::getEquipName, queryDTO.getEquipName())
                .eq(queryDTO.getEquipType() != null, Equipment::getEquipType, queryDTO.getEquipType())
                .eq(queryDTO.getStatus() != null, Equipment::getStatus, queryDTO.getStatus())
                .orderByDesc(Equipment::getId);

        // 🌟 关键修改：直接使用我们显式注入的 equipmentMapper，而不是 this.page()
        return equipmentMapper.selectPage(page, queryWrapper);
    }
}