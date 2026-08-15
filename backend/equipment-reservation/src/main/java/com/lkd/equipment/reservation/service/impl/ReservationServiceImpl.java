package com.lkd.equipment.reservation.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lkd.equipment.reservation.entity.Reservation;
import com.lkd.equipment.reservation.entity.ReservationSubmitDTO;
import com.lkd.equipment.reservation.mapper.ReservationMapper;
import com.lkd.equipment.reservation.service.IReservationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationServiceImpl extends ServiceImpl<ReservationMapper, Reservation> implements IReservationService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String submitReservation(ReservationSubmitDTO dto) {
        Reservation reservation = new Reservation();

        // 1. 生成唯一预约单号 (时间戳前缀 + UUID简码)
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String shortUuid = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String reservationNo = "RES-" + datePrefix + "-" + shortUuid;

        // 🌟 修复处 A：这里改为 setOrderNo
        reservation.setOrderNo(reservationNo);

        // 2. 基础数据赋值
        // 🌟 修复处 B：这里改为 setEquipId
        reservation.setEquipId(dto.getEquipId());

        reservation.setUserId(1L); // 小白联调阶段先写死用户ID，后续可从登录Token获取
        reservation.setTotalFee(dto.getEstimatedFee());

        // 3. 将样品信息和资质证明合并成 JSON 字符串存入 (如果没有独立字段)
        String sampleInfoJson = String.format("{\"sampleName\":\"%s\", \"isHazardous\":%b, \"proofFileUrl\":\"%s\"}",
                dto.getSampleName(), dto.getIsHazardous(), dto.getProofFileUrl());
        reservation.setSampleInfo(sampleInfoJson);

        // 4. 将前端的 ["2026-08-07_8", "2026-08-07_9"] 翻译成起止时间
        List<String> timeSlots = dto.getTimeSlots();
        if (timeSlots != null && !timeSlots.isEmpty()) {
            // 取出第一个和最后一个时间块
            String firstSlot = timeSlots.get(0);
            String lastSlot = timeSlots.get(timeSlots.size() - 1);

            // 分割字符串，例如把 "2026-08-07_8" 分成 "2026-08-07" 和 "8"
            String dateStr = firstSlot.split("_")[0];
            int startHour = Integer.parseInt(firstSlot.split("_")[1]);
            int endHour = Integer.parseInt(lastSlot.split("_")[1]) + 1; // 结束时间通常是整点后一小时

            // 格式化为数据库认识的 LocalDateTime 格式
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            reservation.setStartTime(LocalDateTime.parse(dateStr + " " + String.format("%02d", startHour) + ":00:00", formatter));
            reservation.setEndTime(LocalDateTime.parse(dateStr + " " + String.format("%02d", endHour) + ":00:00", formatter));
        }

        // 5. 状态设置为占用/已锁定
        reservation.setStatus(2); // 根据你的业务，2代表已锁定/占用

        // 6. 插入数据库
        this.save(reservation);

        return reservationNo;
    }
}