<script setup>
import { ref, watch } from "vue";
const g_propsFromParentEvt = defineProps({
    message: String,
    show: Boolean,
    duration: { type: Number, default: 2000 }, // ms
});
const g_showToast = ref(g_propsFromParentEvt.show);
watch(
    () => g_propsFromParentEvt.show,
    (val) => {
        g_showToast.value = val;
        if (val) {
            setTimeout(() => (g_showToast.value = false), g_propsFromParentEvt.duration);
        }
    },
    { immediate: true }
);
</script>
<template>
    <transition name="toast-fade">
        <div class="toast-message" v-if="g_showToast">
            {{ message }}
        </div>
    </transition>
</template>
<style scoped>
.toast-message {
    position: fixed;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 220px;
    background: #222;
    color: #fff;
    font-size: 17px;
    border-radius: 8px;
    padding: 18px 28px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.14);
    text-align: center;
    z-index: 99999;
    opacity: 0.92;
}

/* 페이드 애니메이션 */
.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: opacity .33s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
    opacity: 0;
}
</style>
