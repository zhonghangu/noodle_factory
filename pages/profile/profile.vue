<template>
    <view class="profile-page">
        <!-- 个人信息头部 -->
        <view class="profile-header">
            <view class="avatar-section">
                <image class="avatar" src="https://modao.cc/agent-py/media/generated_images/2026-02-12/ec07a702deb64c16a994f4b5823012b5.jpg" mode="scaleToFill" ></image>
                <view class="user-info">
                    <text class="user-name">{{user?.name || '未登录'}}</text>
                    <text class="user-phone">{{user?.phone || '请先登录'}}</text>
                </view>
            </view>
            <!-- 信用信息 -->
            <view class="credit-section">
                <view class="credit-item">
                    <text class="credit-label">当前信用额度</text>
                    <text class="credit-value">¥ 10,000.00</text>
                </view>
                <view class="credit-item">
                    <text class="credit-label">本月账单</text>
                    <text class="credit-value">¥ {{monthBill}}</text>
                </view>
            </view>
        </view>
        <!-- 地址管理 -->
        <view class="address-section">
            <view class="section-title">
                <text>地址管理</text>
            </view>
            <view class="address-list">
                <view class="address-item">
                    <image class="address-icon" src="/static/icon/home.png" mode="widthFix"></image>
                    <view class="address-info">
                        <view class="address-header">
                            <text class="address-name">我的默认地址</text>
                            <text class="address-tag">默认</text>
                        </view>
                        <text class="address-detail">北京市朝阳区某某街道 1 号</text>
                    </view>
                </view>
                <view class="address-item">
                    <image class="address-icon" src="/static/icon/star.png" mode="widthFix"></image>
                    <view class="address-info">
                        <text class="address-name">收藏地址：连锁分店A</text>
                        <text class="address-detail">上海市浦东新区某某路 2 号</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- 订单列表 -->
        <view class="order-section">
            <view class="section-title">
                <text>订单信息</text>
            </view>
            <view class="order-list" v-if="orders.length > 0">
                <view class="order-item" v-for="order in orders" :key="order.id" @click="toggleOrderDetail(order.id)" >
                    <view class="order-header">
                        <view class="order-info">
                            <text class="order-id">订单号: {{order.id}}</text>
                            <text class="order-time">{{order.createdAt}}</text>
                        </view>
                        <view class="order-status" :class="getStatusClass(order.status)" >
                            {{getStatusText(order.status)}}
                        </view>
                    </view>
                    <text class="order-brief">{{getOrderBrief(order)}}</text>
                    <!-- 订单详情 -->
                    <view class="order-detail" v-if="expandedOrder === order.id">
                        <!-- 进度条 -->
                        <view class="progress-bar">
                            <view class="progress-item" v-for="(text, index) in statusText" :key="index" :class="getProgressClass(index, order.status)" ></view>
                        </view>
                        <view class="progress-labels">
                            <text v-for="(text, index) in statusText" :key="index">{{text}}</text>
                        </view>
                        <!-- 商品详情 -->
                        <view class="order-items">
                            <text v-for="item in order.items" :key="item.spec">{{item.spec}} × {{item.qty}} 包</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="no-order" v-else>
                <text>暂无订单</text>
            </view>
        </view>
    </view>
</template>

<script>
import { STATUS_TEXT } from '../../common/data.js';
import { getUser, getOrders, showToast } from '../../common/util.js';

export default {
    data() {
        return {
            user: null,
            orders: [],
            monthBill: '0.00',
            statusText: STATUS_TEXT,
            expandedOrder: ''
        };
    },
    onShow() {
        this.user = getUser();
        this.orders = getOrders();
        // 计算本月账单
        this.calcMonthBill();
    },
    methods: {
        // 计算本月账单
        calcMonthBill() {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            let total = 0;
            this.orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                if (orderDate.getMonth() + 1 === month && orderDate.getFullYear() === year) {
                    order.items.forEach(item => {
                        total += 12 * item.qty; // 单价12元/包
                    });
                }
            });
            this.monthBill = total.toFixed(2);
        },
        // 获取订单状态文本
        getStatusText(status) {
            return this.statusText[status] || '已下单';
        },
        // 获取订单状态样式类
        getStatusClass(status) {
            if (status === 3) return 'status-yellow';
            if (status === 4) return 'status-green';
            return 'status-blue';
        },
        // 获取进度条样式
        getProgressClass(index, status) {
            if (index < status) {
                if (status === 3) return 'progress-yellow';
                if (status === 4) return 'progress-green';
                return 'progress-blue';
            } else if (index === status) {
                if (status === 3) return 'progress-yellow pulse';
                if (status === 4) return 'progress-green';
                return 'progress-blue pulse';
            }
            return 'progress-gray';
        },
        // 获取订单简要信息
        getOrderBrief(order) {
            const items = order.items.slice(0, 2).map(item => `${item.spec}×${item.qty}`).join('、');
            return order.items.length > 2 ? `${items}...` : items;
        },
        // 展开/收起订单详情
        toggleOrderDetail(orderId) {
            if (this.expandedOrder === orderId) {
                this.expandedOrder = '';
            } else {
                this.expandedOrder = orderId;
            }
        }
    }
};
</script>

<style scoped>
.profile-page {
    background-color: #F3F4F6;
    min-height: 100vh;
}
.profile-header {
    background: linear-gradient(to right, #FACC15, #F97316);
    padding: 40rpx 32rpx;
    color: #FFFFFF;
}
.avatar-section {
    display: flex;
    gap: 24rpx;
    align-items: center;
}
.avatar {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
    border: 8rpx solid rgba(255, 255, 255, 0.3);
}
.user-info {
    flex: 1;
}
.user-name {
    font-size: 36rpx;
    font-weight: bold;
    display: block;
}
.user-phone {
    font-size: 24rpx;
    opacity: 0.8;
    margin-top: 8rpx;
    display: block;
}
.credit-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 16rpx;
    padding: 32rpx;
    margin-top: 32rpx;
    backdrop-filter: blur(8rpx);
}
.credit-item {
    text-align: center;
}
.credit-item:first-child {
    border-right: 2rpx solid rgba(255, 255, 255, 0.2);
}
.credit-label {
    font-size: 20rpx;
    opacity: 0.8;
    display: block;
}
.credit-value {
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 8rpx;
    display: block;
}
.address-section {
    padding: 0 32rpx;
    margin-top: 32rpx;
}
.section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
    display: block;
}
.address-list {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 24rpx;
}
.address-item {
    display: flex;
    gap: 24rpx;
    margin-bottom: 24rpx;
}
.address-item:last-child {
    margin-bottom: 0;
}
.address-icon {
    width: 48rpx;
    height: 48rpx;
    margin-top: 8rpx;
}
.address-info {
    flex: 1;
}
.address-header {
    display: flex;
    gap: 16rpx;
    align-items: center;
}
.address-name {
    font-size: 28rpx;
    font-weight: bold;
}
.address-tag {
    background-color: #FEF3C7;
    color: #D97706;
    font-size: 20rpx;
    padding: 4rpx 8rpx;
    border-radius: 4rpx;
}
.address-detail {
    font-size: 24rpx;
    color: #6B7280;
    margin-top: 8rpx;
    display: block;
}
.order-section {
    padding: 0 32rpx;
    margin-top: 32rpx;
}
.order-list {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 24rpx;
}
.order-item {
    border-left: 8rpx solid #3B82F6;
    padding-left: 24rpx;
    margin-bottom: 24rpx;
}
.order-item:last-child {
    margin-bottom: 0;
}
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
.order-info {
    flex: 1;
}
.order-id {
    font-size: 24rpx;
    font-weight: bold;
    display: block;
}
.order-time {
    font-size: 20rpx;
    color: #9CA3AF;
    margin-top: 4rpx;
    display: block;
}
.order-status {
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    font-size: 20rpx;
    font-weight: bold;
}
.status-blue {
    background-color: #EFF6FF;
    color: #2563EB;
}
.status-yellow {
    background-color: #FEF3C7;
    color: #D97706;
}
.status-green {
    background-color: #D1FAE5;
    color: #059669;
}
.order-brief {
    font-size: 24rpx;
    color: #6B7280;
    margin-top: 16rpx;
    display: block;
}
.order-detail {
    margin-top: 16rpx;
}
.progress-bar {
    display: flex;
    gap: 8rpx;
    height: 8rpx;
}
.progress-item {
    flex: 1;
    border-radius: 4rpx;
    background-color: #E5E7EB;
}
.progress-blue {
    background-color: #3B82F6;
}
.progress-yellow {
    background-color: #F59E0B;
}
.progress-green {
    background-color: #10B981;
}
.pulse {
    animation: pulse 1.5s infinite;
}
@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
.progress-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 8rpx;
}
.progress-labels text {
    font-size: 16rpx;
    color: #9CA3AF;
}
.order-items {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #6B7280;
}
.no-order {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    padding: 48rpx;
    text-align: center;
    font-size: 28rpx;
    color: #9CA3AF;
}
</style>
