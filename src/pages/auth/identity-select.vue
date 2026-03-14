<template>
    <view class="identity-page">
        <view class="logo-section">
            <image src="/static/logo.png" class="logo" mode="aspectFit"></image>
            <text class="app-name">匠心面坊</text>
            <text class="app-desc">新鲜面条 · 工厂直达</text>
        </view>

        <view class="identity-cards">
            <view class="identity-card user-card" @click="selectIdentity('user')">
                <view class="card-icon blue">
                    <text class="iconfont icon-yonghu"></text>
                </view>
                <text class="card-title">我是顾客</text>
                <text class="card-desc">在线订购，配送到家</text>
                <view class="card-arrow">></view>
            </view>

            <view class="identity-card merchant-card" @click="selectIdentity('merchant')">
                <view class="card-icon orange">
                    <text class="iconfont icon-shangjia"></text>
                </view>
                <text class="card-title">我是商家</text>
                <text class="card-desc">订单管理，店铺运营</text>
                <view class="card-arrow">></view>
            </view>
        </view>

        <view class="footer">
            <text class="footer-text">© 2026 匠心面坊 版权所有</text>
        </view>
    </view>
</template>

<script>
import { saveUser, saveMerchant, showToast } from '../../common/util.js'

export default {
    data() {
        return {}
    },
    onLoad() {
        // 检查是否已有登录身份
        const user = uni.getStorageSync('user')
        const merchant = uni.getStorageSync('merchant')
        if (user) {
            uni.switchTab({
                url: '/pages/user/home/home'
            })
        } else if (merchant) {
            uni.switchTab({
                url: '/pages/merchant/dashboard/dashboard'
            })
        }
    },
    methods: {
        selectIdentity(type) {
            if (type === 'user') {
                uni.switchTab({
                    url: '/pages/user/home/home'
                })
            } else {
                uni.navigateTo({
                    url: '/pages/auth/merchant-login'
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
.identity-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #FACC15 0%, #F97316 100%);
    padding: 80rpx 40rpx 40rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.logo-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo {
        width: 160rpx;
        height: 160rpx;
        margin-bottom: 30rpx;
    }

    .app-name {
        font-size: 48rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 16rpx;
    }

    .app-desc {
        font-size: 28rpx;
        color: rgba(255,255,255,0.8);
    }
}

.identity-cards {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    margin-bottom: 80rpx;

    .identity-card {
        background: #fff;
        border-radius: 32rpx;
        padding: 40rpx;
        display: flex;
        align-items: center;
        gap: 30rpx;
        box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.1);

        &:active {
            transform: scale(0.98);
        }

        .card-icon {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 48rpx;

            &.blue {
                background: #3B82F6;
            }
            &.orange {
                background: #F97316;
            }
        }

        .card-title {
            flex: 1;
            font-size: 32rpx;
            font-weight: bold;
            color: $gray-800;
        }

        .card-desc {
            font-size: 24rpx;
            color: $gray-500;
            display: block;
            margin-top: 8rpx;
        }

        .card-arrow {
            font-size: 32rpx;
            color: $gray-400;
        }
    }
}

.footer {
    text-align: center;

    .footer-text {
        font-size: 24rpx;
        color: rgba(255,255,255,0.7);
    }
}
</style>
