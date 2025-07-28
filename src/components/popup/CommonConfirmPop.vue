<script setup>
import { useUserStore } from "../../stores/userStore";

const g_propsFromParentEvt = defineProps({
    visible: Boolean,
    user: Object,
    onConfirm: Function,
    onCancel: Function,
    popHeaderMsg: String,
    popBodyMsg: String,
    popConfirmMsg: String,
});

const g_emitToParentEvt = defineEmits(["onConfirm", "onCancel"]);
</script>

<template>
    <div v-if="visible" class="modal-backdrop">
        <div class="modal-box">
            <div class="modal-header">
                <span>{{ popHeaderMsg }}</span>
                <button
                    class="modal-close"
                    @click="g_emitToParentEvt('onCancel')"
                    aria-label="닫기"
                >
                    ×
                </button>
            </div>
            <div class="modal-body" style="padding: 24px 0">
                <div
                    style="
                        font-size: 17px;
                        text-align: center;
                        margin-bottom: 20px;
                    "
                >
                    {{ popBodyMsg }}
                </div>

                <div
                    class="modal-footer"
                    style="display: flex; gap: 14px; justify-content: center"
                >
                    <button
                        @click="g_emitToParentEvt('onConfirm')"
                        class="danger"
                    >
                        {{ popConfirmMsg }}
                    </button>
                    <button @click="g_emitToParentEvt('onCancel')">취소</button>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.17);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-box {
    background: #fff;
    border: 1.5px solid #d4d4d4;
    /* padding: 5px 36px 22px 36px; */
    padding-left: 20px;
    min-width: 340px;
    border-radius: 12px;
    box-shadow: 0 6px 18px 0 rgba(60, 70, 90, 0.12);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 14px;
}

.modal-close {
    border: none;
    background: none;
    font-size: 22px;
    cursor: pointer;
    color: #222;
}

.danger {
    background: #fa4747;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 8px 24px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.13s;
}

.danger:hover {
    background: #b81414;
}

button:focus,
button:active {
    outline: none;
    box-shadow: none;
    border-color: inherit;
    /* 기존 border 색 유지 */
}

/* 모바일 (600px 이하) 대응 */
@media (max-width: 600px) {
    .modal-box {
        min-width: 0;
        width: 90vw;
        padding: 18px 8vw 14px 8vw;
        font-size: 15px;
    }

    .modal-header {
        font-size: 17px;
    }

    .modal-body {
        font-size: 15px;
    }

    .danger,
    .modal-footer button {
        font-size: 15px;
        padding: 8px 12px;
    }
}
</style>
