package com.lkd.equipment.reservation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lkd.equipment.reservation.entity.Equipment;
import com.lkd.equipment.reservation.entity.EquipmentAddDTO;
import com.lkd.equipment.reservation.entity.EquipmentQueryDTO;
import com.lkd.equipment.reservation.entity.EquipmentRule;
import com.lkd.equipment.reservation.entity.SysOrganization;
import com.lkd.equipment.reservation.mapper.EquipmentMapper;
import com.lkd.equipment.reservation.mapper.EquipmentRuleMapper;
import com.lkd.equipment.reservation.mapper.SysOrganizationMapper;
import com.lkd.equipment.reservation.service.IEquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

@Service
public class EquipmentServiceImpl extends ServiceImpl<EquipmentMapper, Equipment> implements IEquipmentService {

    @Autowired
    private EquipmentMapper equipmentMapper;

    // 🌟 新增注入设备规则表和组织实验室表的 Mapper
    @Autowired
    private EquipmentRuleMapper equipmentRuleMapper;

    @Autowired
    private SysOrganizationMapper sysOrganizationMapper;

    // 🌟 新增：处理同时存入主表和规则表的事务方法
    @Transactional(rollbackFor = Exception.class)
    public Equipment addEquipmentWithRule(EquipmentAddDTO dto) {
        // 1. 存入主表 (biz_equipment)
        Equipment eq = new Equipment();
        eq.setEquipName(dto.getEquipName());
        eq.setAssetCode(dto.getAssetCode());
        eq.setEquipType(dto.getEquipType());
        eq.setTechField(dto.getTechField());
        eq.setQualCtrlType(dto.getQualCtrlType());
        eq.setOrgId(dto.getOrgId());
        eq.setPhotoUrl(dto.getPhotoUrl());
        eq.setManualUrl(dto.getManualUrl());
        eq.setStatus(1); // 默认初始化状态为 1-空闲中
        eq.setIsDeleted(0); // 默认未被逻辑删除为 0-正常

        // 为了方便本地联调，如果没有传负责人，先给个默认值 1
        if(eq.getManagerId() == null) eq.setManagerId(1L);

        this.save(eq); // MyBatis-Plus 保存后会自动将生成的 ID 注入进 eq

        // 2. 存入规则表 (biz_equipment_rule)
        EquipmentRule rule = new EquipmentRule();
        rule.setEquipId(eq.getId()); // 获取刚才生成的主键ID
        rule.setBillingMode(dto.getBillingMode());
        // 如果计费模式是0(免费)，单价存0；否则存入传过来的真实单价
        rule.setUnitPrice(dto.getBillingMode() == 0 ? BigDecimal.ZERO : dto.getUnitPrice());
        equipmentRuleMapper.insert(rule);

        return eq;
    }

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

        // 4. 按“资质要求”查询
        if (StringUtils.hasText(queryDTO.getFilterQual()) && !"all".equals(queryDTO.getFilterQual())) {
            if ("yes".equals(queryDTO.getFilterQual())) {
                queryWrapper.eq(Equipment::getQualCtrlType, 1);
            } else if ("no".equals(queryDTO.getFilterQual())) {
                queryWrapper.ne(Equipment::getQualCtrlType, 1);
            }
        }

        // 5. 按 ID 倒序排列
        queryWrapper.orderByDesc(Equipment::getId);

        // 执行查询
        Page<Equipment> resultPage = equipmentMapper.selectPage(page, queryWrapper);

        // 6. 将查询出来的 orgId 翻译为真实的实验室名称，同时连表查出计费规则
        for (Equipment eq : resultPage.getRecords()) {
            if (eq.getOrgId() != null) {
                SysOrganization org = sysOrganizationMapper.selectById(eq.getOrgId());
                if (org != null) {
                    eq.setOrgName(org.getOrgName());
                }
            }

            // 🌟 核心修复：去 biz_equipment_rule 表查出这台设备的计费模式和单价
            EquipmentRule rule = equipmentRuleMapper.selectById(eq.getId());
            if (rule != null) {
                eq.setBillingMode(rule.getBillingMode());
                eq.setUnitPrice(rule.getUnitPrice());
            }
        }

        return resultPage;
    }
}