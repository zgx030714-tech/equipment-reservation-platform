package com.lkd.equipment.reservation.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 科研设备实体类
 */
@Data
@TableName("biz_equipment")
public class Equipment implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Long id;

    /**
     * 资产编号（与校资产系统唯一对应）
     */
    private String assetCode;

    /**
     * 设备名称
     */
    private String equipName;

    /**
     * 设备类型（1-大型精密仪器, 2-常规设备, 3-实验场地）
     */
    private Integer equipType;

    /**
     * 所属技术领域
     */
    private String techField;

    /**
     * 关联sys_organization.id，所属实验室
     */
    private Long orgId;

    /**
     * 关联sys_user.id，设备负责人
     */
    private Long managerId;

    /**
     * 状态（0-停用, 1-空闲, 2-占用, 3-维修中）
     */
    private Integer status;

    /**
     * 资质要求（1-强管控, 2-弱管控, 3-无限制）
     */
    private Integer qualCtrlType;

    /**
     * 逻辑删除标识（0-正常, 1-已删除）
     */
    @TableLogic
    private Integer isDeleted;


    private String photoUrl;     // 设备照片链接
    private String manualUrl;    // 使用手册链接

    // 🌟 这是一个虚拟字段，数据库表中没有这个列，专门用来装查出来的实验室名字发给前端
    @com.baomidou.mybatisplus.annotation.TableField(exist = false)
    private String orgName;

    // 🌟 新增：用来装计费规则的虚拟字段
    @com.baomidou.mybatisplus.annotation.TableField(exist = false)
    private Integer billingMode; // 计费模式：0-免费, 1-按时长

    @com.baomidou.mybatisplus.annotation.TableField(exist = false)
    private java.math.BigDecimal unitPrice; // 计费单价

}