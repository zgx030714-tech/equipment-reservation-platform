package com.lkd.equipment.reservation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.lkd.equipment.common.Result;
import com.lkd.equipment.reservation.entity.SysOrganization;
import com.lkd.equipment.reservation.mapper.SysOrganizationMapper;

@RestController
@RequestMapping("/api/v1/organization")
public class SysOrganizationController {

    @Autowired
    private SysOrganizationMapper sysOrganizationMapper;

    /**
     * 获取全校所有实验室/组织列表
     */
    @GetMapping("/list")
    public Result<List<SysOrganization>> getOrgList() {
        // null 表示没有任何条件，直接 select * from sys_organization 查出所有组织
        List<SysOrganization> list = sysOrganizationMapper.selectList(null);
        // 使用 common 模块里封装的 Result 统一返回格式
        return Result.success(list);
    }
}