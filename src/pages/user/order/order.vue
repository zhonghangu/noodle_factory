<template>
    <view class="order-page">
        <!-- 顶部导航 -->
        <view class="order-header">
            <text class="header-title">在线订购</text>
            <view class="cart-icon" @click="showCart">
                <image src="/static/icon/cart.png" mode="widthFix"></image>
                <view class="cart-badge" v-if="cartTotal > 0">{{cartTotal}}</view>
            </view>
        </view>
        <!-- 分类+产品列表 -->
        <view class="order-content">
            <!-- 左侧分类 -->
            <scroll-view class="category-nav" scroll-y>
                <view class="category-item" v-for="cat in categories" :key="cat" :class="{ active: currentCategory === cat }" @click="changeCategory(cat)" >
                    {{cat}}类
                </view>
            </scroll-view>
            <!-- 右侧产品列表 -->
            <scroll-view class="product-list" scroll-y>
                <view class="product-title">
                    <image src="/static/icon/label.png" mode="widthFix"></image>
                    <text>{{currentCategory}}系列产品</text>
                </view>
                <view class="product-card" v-for="item in currentProducts" :key="item">
                    <view class="product-header">
                        <image class="product-img" src="https://modao.cc/agent-py/media/generated_images/2026-02-12/6893a0ffbfcd4446b3a940811587c572.jpg" mode="scaleToFill" ></image>
                        <view class="product-info">
                            <text class="product-name">{{item}}</text>
                            <text class="product-desc">口感劲道, 纯小麦研磨</text>
                            <text class="product-price">¥12.00 / 包</text>
                        </view>
                    </view>
                    <!-- 规格选择 -->
                    <view class="spec-section">
                        <text class="spec-label">选择规格：</text>
                        <view class="spec-list">
                            <view class="spec-item" v-for="spec in getSpecs(item)" :key="spec" :class="{ active: selectedSpec[item] === spec }" @click="selectSpec(item, spec)" >
                                {{spec}}
                            </view>
                        </view>
                    </view>
                    <!-- 数量选择 -->
                    <view class="qty-section">
                        <text class="qty-label">数量（包）：</text>
                        <view class="qty-controls">
                            <button class="qty-btn minus" @click="changeQty(item, -1)">-</button>
                            <text class="qty-value">{{productQty[item]}}</text>
                            <button class="qty-btn plus" @click="changeQty(item, 1)">+</button>
                        </view>
                    </view>
                    <!-- 操作按钮 -->
                    <view class="product-actions">
                        <button class="action-btn add-cart" @click="addToCart(item)">加入购物车</button>
                        <button class="action-btn quick-order" @click="quickOrder(item)">直接下单</button>
                    </view>
                </view>
            </scroll-view>
        </view>
        <!-- 购物车栏 -->
        <cart-bar v-if="cart.length > 0" :cart-count="cart.length" :cart-total="cartTotal" @place-order="placeOrder" ></cart-bar>
    </view>
</template>

<script>
import { CATEGORIES, SUB_ITEMS, SPECS } from '../../../common/data.js';
import { getUser, getCart, saveCart, getOrders, saveOrders, showToast, generateOrderId } from '../../../common/util.js';
import cartBar from '../../../components/cart-bar/cart-bar.vue';

export default {
    components: {
        cartBar
    },
    data() {
        return {
            categories: CATEGORIES,
            currentCategory: 'A',
            selectedSpec: {}, // 选中的规格 {item: spec}
            productQty: {}, // 产品数量 {item: qty}
            cart: []
        };
    },
    onShow() {
        this.cart = getCart();
        // 初始化规格和数量
        this.initProductData();
    },
    computed: {
        // 当前分类下的产品
        currentProducts() {
            return SUB_ITEMS[this.currentCategory] || [];
        },
        // 购物车总数
        cartTotal() {
            return this.cart.reduce((sum, item) => sum + item.qty, 0);
        }
    },
    methods: {
        // 初始化产品规格和数量
        initProductData() {
            const allProducts = Object.values(SUB_ITEMS).flat();
            allProducts.forEach(item => {
                if (!this.selectedSpec[item]) {
                    this.selectedSpec[item] = item + SPECS[0];
                }
                if (!this.productQty[item]) {
                    this.productQty[item] = 1;
                }
            });
        },
        // 获取产品规格
        getSpecs(item) {
            return SPECS.map(spec => item + spec);
        },
        // 切换分类
        changeCategory(cat) {
            this.currentCategory = cat;
        },
        // 选择规格
        selectSpec(item, spec) {
            this.selectedSpec[item] = spec;
        },
        // 改变数量
        changeQty(item, delta) {
            const currentQty = this.productQty[item] || 1;
            const newQty = Math.max(1, currentQty + delta);
            this.productQty[item] = newQty;
        },
        // 加入购物车
        addToCart(item) {
            const spec = this.selectedSpec[item];
            const qty = this.productQty[item];
            this.cart.push({ item, spec, qty });
            saveCart(this.cart);
            showToast('已加入购物车');
        },
        // 直接下单
        quickOrder(item) {
            const user = getUser();
            if (!user) {
                showToast('请先登录');
                uni.switchTab({
                    url: '/pages/home/home'
                });
                return;
            }
            const spec = this.selectedSpec[item];
            const qty = this.productQty[item];
            const orderId = generateOrderId();
            const orders = getOrders();
            orders.unshift({
                id: orderId,
                items: [{ item, spec, qty }],
                status: 0,
                createdAt: new Date().toLocaleString('zh-CN')
            });
            saveOrders(orders);
            showToast('下单成功！订单号：' + orderId);
            uni.switchTab({
                url: '/pages/profile/profile'
            });
        },
        // 提交订单
        placeOrder() {
            const user = getUser();
            if (!user) {
                showToast('请先登录');
                uni.switchTab({
                    url: '/pages/home/home'
                });
                return;
            }
            if (this.cart.length === 0) {
                showToast('请先添加商品');
                return;
            }
            const orderId = generateOrderId();
            const orders = getOrders();
            orders.unshift({
                id: orderId,
                items: [...this.cart],
                status: 0,
                createdAt: new Date().toLocaleString('zh-CN')
            });
            saveOrders(orders);
            // 清空购物车
            this.cart = [];
            saveCart([]);
            showToast('下单成功！订单号：' + orderId);
        },
        // 显示购物车
        showCart() {
            // 可扩展购物车弹窗逻辑
        }
    }
};
</script>

<style scoped>
.order-page {
    background-color: #F3F4F6;
    min-height: 100vh;
    padding-bottom: 120rpx;
}
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    background-color: #FFFFFF;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 99;
}
.header-title {
    font-size: 32rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8rpx;
}
.cart-icon {
    position: relative;
    width: 48rpx;
    height: 48rpx;
}
.cart-icon image {
    width: 100%;
    height: 100%;
}
.cart-badge {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    width: 32rpx;
    height: 32rpx;
    line-height: 32rpx;
    text-align: center;
    background-color: #EF4444;
    color: #FFFFFF;
    font-size: 20rpx;
    border-radius: 50%;
}
.order-content {
    display: flex;
    height: calc(100vh - 88rpx - 120rpx);
}
.category-nav {
    width: 160rpx;
    background-color: #F9FAFB;
}
.category-item {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
    border-left: 8rpx solid transparent;
}
.category-item.active {
    border-left-color: #FACC15;
    background-color: #FFFFFF;
    color: #D97706;
    font-weight: bold;
}
.product-list {
    flex: 1;
    padding: 32rpx;
}
.product-title {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 32rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
}
.product-title image {
    width: 32rpx;
    height: 32rpx;
}
.product-card {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 32rpx;
}
.product-header {
    display: flex;
    gap: 24rpx;
    margin-bottom: 24rpx;
}
.product-img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
}
.product-info {
    flex: 1;
}
.product-name {
    font-size: 32rpx;
    font-weight: bold;
    display: block;
}
.product-desc {
    font-size: 24rpx;
    color: #9CA3AF;
    margin-top: 8rpx;
    display: block;
}
.product-price {
    font-size: 28rpx;
    color: #EF4444;
    font-weight: bold;
    margin-top: 16rpx;
    display: block;
}
.spec-section {
    margin-bottom: 24rpx;
}
.spec-label {
    font-size: 24rpx;
    color: #6B7280;
    margin-bottom: 16rpx;
    display: block;
}
.spec-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}
.spec-item {
    padding: 16rpx 24rpx;
    border: 2rpx solid #E5E7EB;
    border-radius: 8rpx;
    font-size: 24rpx;
}
.spec-item.active {
    background-color: #FACC15;
    color: #FFFFFF;
    border-color: #FACC15;
}
.qty-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}
.qty-label {
    font-size: 24rpx;
    color: #6B7280;
}
.qty-controls {
    display: flex;
    align-items: center;
    gap: 16rpx;
}
.qty-btn {
    width: 64rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    border-radius: 8rpx;
    font-size: 32rpx;
}
.qty-btn.minus {
    background-color: #FFFFFF;
    border: 2rpx solid #E5E7EB;
}
.qty-btn.plus {
    background-color: #FACC15;
    color: #FFFFFF;
    border: none;
}
.qty-value {
    font-size: 28rpx;
    font-weight: bold;
}
.product-actions {
    display: flex;
    gap: 16rpx;
}
.action-btn {
    flex: 1;
    height: 64rpx;
    line-height: 64rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
}
.add-cart {
    background-color: #FFFFFF;
    color: #D97706;
    border: 2rpx solid #FACC15;
}
.quick-order {
    background-color: #FACC15;
    color: #FFFFFF;
    border: none;
}
</style>
