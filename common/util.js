import { STORAGE_KEYS } from './data.js';

// 本地存储操作
export const storage = {
    get(key) {
        return JSON.parse(uni.getStorageSync(key) || 'null');
    },
    set(key, data) {
        uni.setStorageSync(key, JSON.stringify(data));
    },
    remove(key) {
        uni.removeStorageSync(key);
    }
};

// 获取用户信息
export const getUser = () => storage.get(STORAGE_KEYS.USER);

// 保存用户信息
export const saveUser = (user) => storage.set(STORAGE_KEYS.USER, user);

// 获取购物车
export const getCart = () => storage.get(STORAGE_KEYS.CART) || [];

// 保存购物车
export const saveCart = (cart) => storage.set(STORAGE_KEYS.CART, cart);

// 获取订单
export const getOrders = () => storage.get(STORAGE_KEYS.ORDERS) || [];

// 保存订单
export const saveOrders = (orders) => storage.set(STORAGE_KEYS.ORDERS, orders);

// 显示提示
export const showToast = (title, icon = 'none') => {
    uni.showToast({
        title,
        icon,
        duration: 1500
    });
};

// 生成订单号
export const generateOrderId = () => 'ORD' + Date.now();
