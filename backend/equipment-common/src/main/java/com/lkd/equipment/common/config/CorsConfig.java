package com.lkd.equipment.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 全局跨域配置类
 * 解决前后端分离架构下前端应用请求后端的跨域拦截问题
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // 允许所有域名跨域访问，生产环境中建议替换为具体的前端域名
        config.addAllowedOriginPattern("*");
        // 允许所有的请求头
        config.addAllowedHeader("*");
        // 允许所有的请求方法 (GET, POST, PUT, DELETE, OPTIONS等)
        config.addAllowedMethod("*");
        // 允许携带凭证 (如 Cookies)
        config.setAllowCredentials(true);
        // 跨域允许时间 (秒)，在此时间内浏览器无需再次发送预检请求 OPTIONS
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 对所有接口路径生效
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}