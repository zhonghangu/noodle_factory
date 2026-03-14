<template>
    <view class="dashboard-page">
        <!-- 头部信息 -->
        <view class="header">
            <view class="merchant-info">
                <image :src="merchant.avatar || '/static/merchant-avatar.png'" class="avatar"></image>
                <view class="info">
                    <text class="merchant-name">{{merchant.name}}</text>
                    <text class="merchant-desc">营业中 · 今日已接单 {{todayData.orderCount}} 单</text>
                </view>
            </view>
            <view class="setting-btn" @click="goToSetting">
                <text class="iconfont icon-shezhi"></text>
            </view>
        </view>

        <!-- 数据概览 -->
        <view class="overview-section">
            <view class="overview-card">
                <view class="overview-item" @click="goToOrder(1)">
                    <text class="item-num">{{todayData.orderCount}}</text>
                    <text class="item-label">今日订单</text>
                </view>
                <view class="overview-item">
                    <text class="item-num">¥{{todayData.amount}}</text>
                    <text class="item-label">今日营业额</text>
                </view>
                <view class="overview-item">
                    <text class="item-num">{{todayData.userCount}}</text>
                    <text class="item-label">今日新客</text>
                </view>
            </view>
        </view>

        <!-- 快捷入口 -->
        <view class="quick-section">
            <view class="section-title">快捷操作</view>
            <view class="quick-grid">
                <view class="quick-item" @click="goToProduct">
                    <view class="quick-icon blue">
                        <text class="iconfont icon-shangpin"></text>
                    </view>
                    <text class="quick-text">商品管理</text>
                </view>
                <view class="quick-item" @click="goToOrder(0)">
                    <view class="quick-icon orange">
                        <text class="iconfont icon-dingdan"></text>
                    </view>
                    <text class="quick-text">待处理订单</text>
                    <view class="quick-badge" v-if="pendingOrderCount > 0">{{pendingOrderCount}}</view>
                </view>
                <view class="quick-item" @click="goToDelivery">
                    <view class="quick-icon green">
                        <text class="iconfont icon-peisong"></text>
                    </view>
                    <text class="quick-text">配送管理</text>
                </view>
                <view class="quick-item" @click="goToData">
                    <view class="quick-icon purple">
                        <text class="iconfont icon-shuju"></text>
                    </view>
                    <text class="quick-text">数据统计</text>
                </view>
            </view>
        </view>

        <!-- 最近订单 -->
        <view class="recent-section">
            <view class="section-header">
                <text class="section-title">最近订单</text>
                <text class="more-text" @click="goToOrder()">查看全部 ></text>
            </view>
            <view class="order-list">
                <view class="order-item" v-for="order in recentOrders" :key="order.id">
                    <view class="order-info">
                        <text class="order-user">{{order.userName}}</text>
                        <text class="order-time">{{order.time}}</text>
                        <text class="order-goods">{{order.goods}}</text>
                    </view>
                    <view class="order-right">
                        <text class="order-amount">¥{{order.amount}}</text>
                        <text class="order-status">{{order.statusText}}</text>
                    </view>
                </view>
            </view>
            <view class="empty-text" v-if="recentOrders.length === 0">
                暂无订单
            </view>
        </view>
    </view>
</template>

<script>
import { getMerchant, getOrders, showToast } from '../../../common/util.js'

export default {
    data() {
        return {
            merchant: {},
            todayData: {
                orderCount: 0,
                amount: '0.00',
                userCount: 0
            },
            pendingOrderCount: 0,
            recentOrders: []
        }
    },
    onShow() {
        this.merchant = getMerchant()
        this.loadData()
    },
    methods: {
        loadData() {
            // 模拟数据，实际对接接口
            this.todayData = {
                orderCount: 28,
                amount: '2568.00',
                userCount: 12
            }
            this.pendingOrderCount = 3
            
            // 最近订单模拟
            const orders = getOrders()
            this.recentOrders = orders.slice(0, 3).map(order => ({
                id: order.id,
                userName: '顾客' + Math.floor(Math.random() * 1000),
                time: order.createdAt,
                goods: order.items.map(item => `${item.spec}×${item.qty}`).join('、'),
                amount: (order.items.reduce((sum, item) => sum + 12 * item.qty, 0)).toFixed(2),
                statusText: ['待接单', '制作中', '配送中', '已完成'][order.status]
            }))
        },
        goToSetting() {
            uni.navigateTo({
                url: '/pages/merchant/setting/setting'
            })
        },
        goToProduct() {
            uni.navigateTo({
                url: '/pages/merchant/product/list'
            })
        },
        goToOrder(status = null) {
            const url = status !== null ? 
                `/pages/merchant/order/list?status=${status}` : 
                '/pages/merchant/order/list'
            uni.navigateTo({ url })
        },
        goToDelivery() {
            uni.navigateTo({
                url: '/pages/merchant/delivery/list'
            })
        },
        goToData() {
            uni.navigateTo({
                url: '/pages/merchant/data/statistics'
            })
        },
        logout() {
            uni.showModal({
                title: '提示',
                content: '确定要退出登录吗？',
                success: (res) => {
                    if (res.confirm) {
                        uni.removeStorageSync('merchant')
                        uni.reLaunch({
                            url: '/pages/auth/identity-select'
                        })
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.dashboard-page {
    min-height: 100vh;
    background-color: $gray-100;
    padding-bottom: 120rpx;
}

.header {
    background: linear-gradient(135deg, $primary-color 0%, #F97316 100%);
    padding: 60rpx 30rpx 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .merchant-info {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .avatar {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            border: 4rpx solid rgba(255,255,255,0.3);
        }

        .info {
            .merchant-name {
                font-size: 32rpx;
                font-weight: bold;
                color: #fff;
                display: block;
            }
            .merchant-desc {
                font-size: 24rpx;
                color: rgba(255,255,255,0.8);
                margin-top: 8rpx;
                display: block;
            }
        }
    }

    .setting-btn {
        width: 60rpx;
        height: 60rpx;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 32rpx;
    }
}

.overview-section {
    padding: 0 30rpx;
    margin-top: -30rpx;

    .overview-card {
        background: #fff;
        border-radius: 24rpx;
        padding: 40rpx 0;
        display: flex;
        box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.08);

        .overview-item {
            flex: 1;
            text-align: center;

            &:not(:last-child) {
                border-right: 1rpx solid $gray-200;
            }

            .item-num {
                font-size: 36rpx;
                font-weight: bold;
                color: $gray-800;
                display: block;
                margin-bottom: 8rpx;
            }

            .item-label {
                font-size: 24rpx;
                color: $gray-500;
            }
        }
    }
}

.quick-section {
    padding: 40rpx 30rpx 0;

    .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: $gray-800;
        margin-bottom: 30rpx;
    }

    .quick-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 20rpx;

        .quick-item {
            background: #fff;
            border-radius: 20rpx;
            padding: 30rpx 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            box-shadow: $shadow-sm;

            .quick-icon {
                width: 80rpx;
                height: 80rpx;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 40rpx;
                margin-bottom: 16rpx;

                &.blue { background: #3B82F6; }
                &.orange { background: #F97316; }
                &.green { background: #10B981; }
                &.purple { background: #8B5CF6; }
            }

            .quick-text {
                font-size: 24rpx;
                color: $gray-700;
            }

            .quick-badge {
                position: absolute;
                top: 16rpx;
                right: 16rpx;
                min-width: 32rpx;
                height: 32rpx;
                background: $danger-color;
                color: #fff;
                font-size: 20rpx;
                border-radius: 16rpx;
                padding: 0 6rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}

.recent-section {
    padding: 40rpx 30rpx 0;

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30rpx;

        .section-title {
            font-size: 32rpx;
            font-weight: bold;
            color: $gray-800;
        }

        .more-text {
            font-size: 24rpx;
            color: $primary-color;
        }
    }

    .order-list {
        background: #fff;
        border-radius: 20rpx;
        overflow: hidden;
        box-shadow: $shadow-sm;

        .order-item {
            padding: 30rpx;
            display: flex;
            justify-content: space-between;
            border-bottom: 1rpx solid $gray-100;

            &:last-child {
                border-bottom: none;
            }

            .order-info {
                flex: 1;

                .order-user {
                    font-size: 28rpx;
                    font-weight: 500;
                    color: $gray-800;
                    display: block;
                }
                .order-time {
                    font-size: 20rpx;
                    color: $gray-400;
                    margin: 6rpx 0;
                    display: block;
                }
                .order-goods {
                    font-size: 24rpx;
                    color: $gray-600;
                    display: block;
                }
            }

            .order-right {
                text-align: right;

                .order-amount {
                    font-size: 28rpx;
                    font-weight: bold;
                    color: $danger-color;
                    display: block;
                }
                .order-status {
                    font-size: 20rpx;
                    color: $primary-color;
                    margin-top: 6rpx;
                    display: block;
                }
            }
        }
    }

    .empty-text {
        text-align: center;
        padding: 80rpx 0;
        font-size: 28rpx;
        color: $gray-400;
        background: #fff;
        border-radius: 20rpx;
    }
}
</style>
