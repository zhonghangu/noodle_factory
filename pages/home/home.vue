<template>
    <view class="home-page">
        <!-- 轮播/横幅 -->
        <view class="banner">
            <image class="banner-img" src="https://modao.cc/agent-py/media/generated_images/2026-02-12/b491dde983544268a05184c2a0638920.jpg" mode="scaleToFill"></image>
            <view class="banner-text">
                <text class="banner-title">匠心面坊</text>
                <text class="banner-subtitle">2026年品质坚持 · 源自天然</text>
            </view>
        </view>

        <!-- 登录/未登录区域 -->
        <view class="auth-section" v-if="!user">
            <view class="auth-card">
                <text class="auth-desc">欢迎来到面条工厂，开启您的订制之旅</text>
                <view class="auth-btns">
                    <button class="btn login-btn" @click="showLogin">登录</button>
                    <button class="btn register-btn" @click="showRegister">注册</button>
                </view>
            </view>
        </view>
        <view class="auth-section" v-else>
            <view class="auth-card">
                <text class="auth-desc">欢迎回来，{{user.name}}</text>
                <button class="btn enter-btn" @click="goToProfile">进入我的信息</button>
            </view>
        </view>

        <!-- 核心功能 -->
        <view class="func-section">
            <view class="section-title">
                <view class="title-line"></view>
                <text class="title-text">核心功能</text>
            </view>
            <view class="func-grid">
                <view class="func-item" @click="goToOrder">
                    <image class="func-icon" src="/static/icon/order.png" mode="widthFix"></image>
                    <text class="func-title">极速订购</text>
                    <text class="func-desc">七大品类 快速直达</text>
                </view>
                <view class="func-item" @click="goToProfile">
                    <image class="func-icon" src="/static/icon/wallet.png" mode="widthFix"></image>
                    <text class="func-title">信用资产</text>
                    <text class="func-desc">额度管理 灵活结算</text>
                </view>
            </view>
        </view>

        <!-- 关于我们 -->
        <view class="about-section">
            <view class="section-title">
                <view class="title-line"></view>
                <text class="title-text">关于我们</text>
            </view>
            <view class="about-card">
                <image class="about-img" src="https://modao.cc/agent-py/media/generated_images/2026-02-12/19c51d455e1d4c7fb8ff385f060f2a5e.jpg" mode="scaleToFill"></image>
                <view class="about-mask">
                    <text class="about-text">我们致力于提供最新鲜的工厂直发面食，全自动化生产线确保食品安全。</text>
                </view>
            </view>
        </view>

        <!-- 登录弹窗 -->
        <u-modal v-model="loginShow" title="登录" @confirm="submitLogin">
            <view class="form-item">
                <label class="form-label">手机号</label>
                <input class="form-input" type="tel" v-model="loginForm.phone" placeholder="请输入手机号" maxlength="11" />
            </view>
            <view class="form-item">
                <label class="form-label">密码</label>
                <input class="form-input" type="password" v-model="loginForm.pwd" placeholder="请输入密码" />
            </view>
            <view class="form-tips" @click="switchToRegister">
                还没有账号？立即注册
            </view>
        </u-modal>

        <!-- 注册弹窗 -->
        <u-modal v-model="registerShow" title="注册" @confirm="submitRegister">
            <view class="form-item">
                <label class="form-label">昵称</label>
                <input class="form-input" type="text" v-model="registerForm.name" placeholder="请输入昵称" />
            </view>
            <view class="form-item">
                <label class="form-label">手机号</label>
                <input class="form-input" type="tel" v-model="registerForm.phone" placeholder="请输入手机号" maxlength="11" />
            </view>
            <view class="form-item">
                <label class="form-label">密码</label>
                <input class="form-input" type="password" v-model="registerForm.pwd" placeholder="请输入密码" />
            </view>
            <view class="form-tips" @click="switchToLogin">
                已有账号？去登录
            </view>
        </u-modal>
    </view>
</template>

<script>
import { getUser, saveUser, showToast } from '../../common/util.js';
import uModal from '../../components/u-modal/u-modal.vue';

export default {
    components: {
        uModal
    },
    data() {
        return {
            user: null,
            loginShow: false,
            registerShow: false,
            loginForm: {
                phone: '',
                pwd: ''
            },
            registerForm: {
                name: '',
                phone: '',
                pwd: ''
            }
        };
    },
    onShow() {
        this.user = getUser();
    },
    methods: {
        // 显示登录弹窗
        showLogin() {
            this.loginShow = true;
        },
        // 显示注册弹窗
        showRegister() {
            this.registerShow = true;
        },
        // 切换到注册
        switchToRegister() {
            this.loginShow = false;
            this.registerShow = true;
        },
        // 切换到登录
        switchToLogin() {
            this.registerShow = false;
            this.loginShow = true;
        },
        // 提交登录
        submitLogin() {
            const { phone, pwd } = this.loginForm;
            if (!phone || !pwd) {
                showToast('请填写手机号和密码');
                return;
            }
            const user = getUser();
            if (user && user.phone === phone && user.password === pwd) {
                this.user = user;
                saveUser(user);
                this.loginShow = false;
                this.loginForm = { phone: '', pwd: '' };
                showToast('登录成功');
            } else {
                showToast('手机号或密码错误');
            }
        },
        // 提交注册
        submitRegister() {
            const { name, phone, pwd } = this.registerForm;
            if (!name || !phone || !pwd) {
                showToast('请填写昵称、手机号和密码');
                return;
            }
            const user = { name, phone, password: pwd };
            saveUser(user);
            this.user = user;
            this.registerShow = false;
            this.registerForm = { name: '', phone: '', pwd: '' };
            showToast('注册成功');
        },
        // 跳转到订购页
        goToOrder() {
            uni.switchTab({
                url: '/pages/order/order'
            });
        },
        // 跳转到我的信息页
        goToProfile() {
            uni.switchTab({
                url: '/pages/profile/profile'
            });
        }
    }
};
</script>

<style scoped>
.home-page {
    background-color: #F3F4F6;
    min-height: 100vh;
}
.banner {
    height: 256rpx;
    position: relative;
}
.banner-img {
    width: 100%;
    height: 100%;
    opacity: 0.6;
}
.banner-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
.banner-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #FFFFFF;
    display: block;
}
.banner-subtitle {
    font-size: 24rpx;
    color: #FFFFFF;
    opacity: 0.9;
    display: block;
    margin-top: 8rpx;
}
.auth-section {
    padding: 0 32rpx;
    margin-top: -32rpx;
}
.auth-card {
    background-color: #FFFFFF;
    border-radius: 32rpx;
    padding: 40rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    text-align: center;
}
.auth-desc {
    font-size: 24rpx;
    color: #6B7280;
    margin-bottom: 32rpx;
    display: block;
}
.auth-btns {
    display: flex;
    gap: 24rpx;
}
.btn {
    flex: 1;
    height: 64rpx;
    line-height: 64rpx;
    border-radius: 16rpx;
    font-weight: bold;
    font-size: 28rpx;
}
.login-btn {
    background-color: #FACC15;
    color: #FFFFFF;
    border: none;
}
.register-btn {
    background-color: #FFFFFF;
    color: #D97706;
    border: 2rpx solid #FACC15;
}
.enter-btn {
    width: 100%;
    background-color: #FACC15;
    color: #FFFFFF;
    border: none;
}
.func-section {
    padding: 0 32rpx;
    margin-top: 32rpx;
}
.section-title {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 32rpx;
}
.title-line {
    width: 8rpx;
    height: 40rpx;
    background-color: #FACC15;
    border-radius: 4rpx;
}
.title-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #111827;
}
.func-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32rpx;
}
.func-item {
    background-color: #EFF6FF;
    border-radius: 32rpx;
    padding: 32rpx;
    text-align: center;
}
.func-icon {
    width: 64rpx;
    height: 64rpx;
}
.func-title {
    font-size: 28rpx;
    font-weight: bold;
    margin-top: 16rpx;
    display: block;
}
.func-desc {
    font-size: 20rpx;
    color: #6B7280;
    margin-top: 8rpx;
    display: block;
}
.about-section {
    padding: 0 32rpx;
    margin-top: 64rpx;
}
.about-card {
    position: relative;
    border-radius: 32rpx;
    overflow: hidden;
    height: 160rpx;
}
.about-img {
    width: 100%;
    height: 100%;
}
.about-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
    padding: 32rpx;
}
.about-text {
    font-size: 24rpx;
    color: #FFFFFF;
    line-height: 1.5;
}
.form-item {
    margin-bottom: 32rpx;
}
.form-label {
    font-size: 28rpx;
    color: #6B7280;
    margin-bottom: 16rpx;
    display: block;
}
.form-input {
    height: 88rpx;
    line-height: 88rpx;
    padding: 0 24rpx;
    border: 2rpx solid #E5E7EB;
    border-radius: 16rpx;
    font-size: 28rpx;
}
.form-tips {
    text-align: center;
    font-size: 24rpx;
    color: #6B7280;
    margin-top: 16rpx;
}
</style>
