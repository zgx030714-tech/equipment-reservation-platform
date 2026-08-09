package com.lkd.equipment.reservation;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 仪器预约微服务启动类
 */
@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.lkd.equipment.reservation.mapper")
public class ReservationApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReservationApplication.class, args);
        System.out.println("====== 设备预约微服务启动成功 ======");
    }
}