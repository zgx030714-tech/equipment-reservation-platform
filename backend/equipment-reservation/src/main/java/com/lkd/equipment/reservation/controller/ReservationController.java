package com.lkd.equipment.reservation.controller;

import com.lkd.equipment.reservation.entity.Reservation;
import com.lkd.equipment.reservation.service.IReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> submit(@RequestBody Reservation reservation) {
        // 简单非空校验
        if (reservation.getEquipmentId() == null || reservation.getUserId() == null) {
            return ResponseEntity.badRequest().body("参数不完整：设备ID或用户ID不能为空");
        }
        if (reservation.getStartTime() == null || reservation.getEndTime() == null) {
            return ResponseEntity.badRequest().body("参数不完整：预约起止时间不能为空");
        }
        if (reservation.getStartTime().isAfter(reservation.getEndTime())) {
            return ResponseEntity.badRequest().body("逻辑错误：预约开始时间不能晚于结束时间");
        }

        String reservationNo = reservationService.submitReservation(reservation);
        return ResponseEntity.ok("预约申请提交成功，预约单号: " + reservationNo);
    }

    /**
     * 根据 ID 查询预约详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getDetail(@PathVariable Long id) {
        Reservation reservation = reservationService.getById(id);
        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reservation);
    }
}