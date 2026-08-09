package com.lkd.equipment.reservation.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lkd.equipment.reservation.entity.Reservation;
import com.lkd.equipment.reservation.mapper.ReservationMapper;
import com.lkd.equipment.reservation.service.IReservationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class ReservationServiceImpl extends ServiceImpl<ReservationMapper, Reservation> implements IReservationService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String submitReservation(Reservation reservation) {
        // 1. 生成唯一预约单号 (时间戳前缀 + UUID简码)
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String shortUuid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String reservationNo = "RES-" + datePrefix + "-" + shortUuid;

        // 2. 补全默认信息
        reservation.setReservationNo(reservationNo);
        reservation.setStatus(0); // 默认状态：待审核

        // 3. 插入数据库
        this.save(reservation);

        return reservationNo;
    }
}