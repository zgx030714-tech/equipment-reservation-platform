package com.lkd.equipment.reservation.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("sys_organization")
public class SysOrganization {
    private Long id;
    private String orgName; // 组织/实验室名称
}