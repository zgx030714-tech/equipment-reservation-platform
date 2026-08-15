package com.lkd.equipment.reservation.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lkd.equipment.reservation.entity.Reservation;
import com.lkd.equipment.reservation.entity.ReservationSubmitDTO; // 引入刚刚新建的DTO

public interface IReservationService extends IService<Reservation> {

    /**
     * 提交仪器预约申请
     * @param dto 前端传来的预约信息对象
     * @return 预约单号
     */
    String submitReservation(ReservationSubmitDTO dto);
}