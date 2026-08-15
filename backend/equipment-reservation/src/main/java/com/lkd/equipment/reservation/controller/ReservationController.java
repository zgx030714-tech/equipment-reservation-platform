package com.lkd.equipment.reservation.controller;

// 引入全局统一返回类
import com.lkd.equipment.common.Result;
import com.lkd.equipment.reservation.entity.Reservation;
import com.lkd.equipment.reservation.entity.ReservationSubmitDTO;
import com.lkd.equipment.reservation.service.IReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reservation")
public class ReservationController {

    @Autowired
    private IReservationService reservationService;

    /**
     * 提交预约申请
     */
    @PostMapping("/submit")
    public Result<String> submit(@RequestBody ReservationSubmitDTO dto) {
        try {
            // 1. 简单的非空校验 (校验前端传来的DTO字段)
            if (dto.getEquipId() == null) {
                return Result.error(400, "参数不完整：设备ID不能为空");
            }
            if (dto.getTimeSlots() == null || dto.getTimeSlots().isEmpty()) {
                return Result.error(400, "参数不完整：必须选择预约时间段");
            }

            // 2. 调用业务逻辑
            String reservationNo = reservationService.submitReservation(dto);
            return Result.success("预约申请提交成功，单号: " + reservationNo);

        } catch (Exception e) {
            // 核心修复：捕获所有异常（如主外键冲突），并把真实的错误原因返回给前端
            e.printStackTrace();
            return Result.error(500, "提交失败: " + e.getMessage());
        }
    }

    /**
     * 根据 ID 查询预约详情
     */
    @GetMapping("/{id}")
    public Result<Reservation> getDetail(@PathVariable Long id) {
        Reservation reservation = reservationService.getById(id);
        if (reservation == null) {
            return Result.error(404, "未找到该预约单");
        }
        return Result.success(reservation);
    }
}