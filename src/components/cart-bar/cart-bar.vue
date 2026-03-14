<template>
    <view class="cart-bar">
        <text class="cart-info">已选 <text class="cart-count">{{cartCount}}</text> 项，共 <text class="cart-total">{{cartTotal}}</text> 件</text>
        <button class="place-order-btn" @click="handlePlaceOrder">立即下单</button>
    </view>
</template>

<script>
export default {
    props: {
        cartCount: {
            type: Number,
            default: 0
        },
        cartTotal: {
            type: Number,
            default: 0
        }
    },
    methods: {
        handlePlaceOrder() {
            this.$emit('place-order');
        }
    }
};
</script>

<style scoped>
.cart-bar {
    position: fixed;
    bottom: 80px;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    border-top: 1rpx solid #E5E7EB;
    padding: 24rpx 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
    z-index: 50;
}
.cart-info {
    font-size: 28rpx;
    color: #6B7280;
}
.cart-count, .cart-total {
    font-weight: bold;
    color: #111827;
}
.place-order-btn {
    background-color: #FACC15;
    color: #FFFFFF;
    padding: 16rpx 48rpx;
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;
}
</style>
