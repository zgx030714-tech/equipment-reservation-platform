package com.lkd.equipment.reservation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lkd.equipment.reservation.entity.Reservation;

public interface IReservationService extends IService<Reservation> {

    /**
     * 提交仪器预约申请
     * @param reservation 预约信息对象
     * @return 预约单号
     */
    String submitReservation(Reservation reservation);
}