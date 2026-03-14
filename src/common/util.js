import { STORAGE_KEYS } from './data.js';

// 密码加密
const encryptPassword = (password) => {
    // 简单的加密处理，实际项目中应使用更安全的加密方式
    return btoa(password + 'noodle_factory_salt');
};

// 密码解密
const decryptPassword = (encryptedPassword) => {
    try {
        return atob(encryptedPassword).replace('noodle_factory_salt', '');
    } catch (e) {
        return '';
    }
};

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
export const getUser = () => {
    const user = storage.get(STORAGE_KEYS.USER);
    if (user && user.password) {
        user.password = decryptPassword(user.password);
    }
    return user;
};

// 保存用户信息
export const saveUser = (user) => {
    if (user && user.password) {
        user = { ...user, password: encryptPassword(user.password) };
    }
    storage.set(STORAGE_KEYS.USER, user);
};

// 获取商家信息
export const getMerchant = () => {
    const merchant = storage.get('merchant');
    if (merchant && merchant.password) {
        merchant.password = decryptPassword(merchant.password);
    }
    return merchant || null;
};

// 保存商家信息
export const saveMerchant = (merchant) => {
    if (merchant && merchant.password) {
        merchant = { ...merchant, password: encryptPassword(merchant.password) };
    }
    storage.set('merchant', merchant);
};

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
