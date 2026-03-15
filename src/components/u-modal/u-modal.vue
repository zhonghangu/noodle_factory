<template>
    <view class="modal-overlay" v-if="visible" @click="closeModal">
        <view class="modal-content" @click.stop>
            <view class="modal-header">
                <text class="modal-title">{{title}}</text>
                <button class="modal-close" type="default" hover-class="none" @click="closeModal">×</button>
            </view>
            <view class="modal-body">
                <slot></slot>
            </view>
            <view class="modal-footer">
                <button class="modal-confirm" type="default" hover-class="none" @click="handleConfirm">确认</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            visible: this.show
        };
    },
    watch: {
        show(newVal) {
            this.visible = newVal;
        }
    },
    methods: {
        closeModal() {
            this.visible = false;
            this.$emit('close');
        },
        handleConfirm() {
            this.$emit('confirm');
            this.closeModal();
        }
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}
.modal-content {
    background-color: #FFFFFF;
    border-radius: 16rpx;
    width: 80%;
    max-width: 600rpx;
    padding: 32rpx;
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
}
.modal-title {
    font-size: 32rpx;
    font-weight: bold;
}
.modal-close {
    font-size: 32rpx;
    background: none;
    border: none;
    color: #9CA3AF;
}
.modal-footer {
    margin-top: 32rpx;
}
.modal-confirm {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: #FACC15;
    color: #FFFFFF;
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;
}
</style>
