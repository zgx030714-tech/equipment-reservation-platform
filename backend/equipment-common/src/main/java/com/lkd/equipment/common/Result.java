package com.lkd.equipment.common;

import lombok.Data;
import java.io.Serializable;

/**
 * 全局统一 API 响应封装类
 * @param <T> 泛型数据类型
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 状态码（例如：200-成功，500-服务器错误，401-未授权）
     */
    private Integer code;

    /**
     * 提示信息
     */
    private String message;

    /**
     * 实际返回的数据体
     */
    private T data;

    // 私有化构造函数，强制使用静态工厂方法
    private Result() {}

    private Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 成功响应（无数据）
     */
    public static <T> Result<T> success() {
        return new Result<>(200, "操作成功", null);
    }

    /**
     * 成功响应（带数据）
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", data);
    }

    /**
     * 成功响应（自定义提示信息和数据）
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }

    /**
     * 失败响应
     */
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
}