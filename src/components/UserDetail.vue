<script setup>
defineProps({ userDetail: Object });
const g_emitToParentEvt = defineEmits(["onBtnUserUpdate", "onBtnUserDelete"]);
</script>

<template>
    <div class="memmber-detail-header">
        <div class="detail-title" v-if="userDetail">
            {{ userDetail.nick }}님 상세정보
        </div>
    </div>
    <div class="userDetail-detail-box" v-if="userDetail">
        <div class="userDetail-detail-row">
            <span class="label"><b>이름</b> *</span>
            <span class="value bordered">{{ userDetail.nick }}</span>
        </div>
        <div class="userDetail-detail-row">
            <span class="label"><b>이메일</b> *</span>
            <span class="value bordered">{{ userDetail.email }}</span>
        </div>
        <div class="userDetail-detail-row">
            <span class="label"><b>전화번호</b> *</span>
            <span class="value bordered">{{ userDetail.phone }}</span>
        </div>
        <div class="userDetail-detail-row">
            <span class="label"><b>성별</b> *</span>
            <span class="value bordered">{{
                userDetail.gender === "M" ? "남자" : "여자"
            }}</span>
        </div>

        <div class="userDetail-detail-buttons">
            <button
                class="edit=button"
                @click="g_emitToParentEvt('onBtnUserUpdate')"
            >
                수정
            </button>
            <button
                class="delete=button"
                @click="g_emitToParentEvt('onBtnUserDelete')"
            >
                삭제
            </button>
        </div>
    </div>
</template>

<style>
.userDetail-detail-box {
    border: 1px solid #222;
    padding: 24px;
    width: 100%;
    height: 100%;
    /* max-width: 400px; */
    margin: 8px 0px 32px 0px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 62vh;
    max-height: 62vh;
}

/* .detail-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
} */
.userDetail-detail-header,
.detail-title {
    min-height: 42px;
    /* 같은 값으로 맞춤! 실제 높이에 따라 40~44px 등 조정 */
    font-weight: 600;
    display: flex;
    align-items: center;
    /* 필요하면 padding, gap 등 추가 */
}

.userDetail-detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.label {
    min-width: 90px;
    font-weight: 500;
    font-size: clamp(10px, 20vw, 15px);
    text-align: left;
}

.value {
    flex: 1;
    text-align: left;
    padding-left: 16px;
    font-size: clamp(10px, 20vw, 15px);
}

.value.bordered {
    border-left: 2px solid #ccc;
}

.userDetail-detail-buttons {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 12px;
    font-size: clamp(10px, 20vw, 15px);
}

.button:hover,
.button:focus {
    border: 1.5px solid #bdbdbd !important;
    background: #f5f5f5 !important;
}

@media (max-width: 820px) {
    .userDetail-detail-box {
        font-size: 10px;
        padding: 15px 8px;
        max-width: 98vw;
        min-height: 28vh;
        max-height: 28vh;
    }

    .userDetail-detail-row .label,
    .userDetail-detail-row .value {
        font-size: 0.98em;
    }

    .edit-button,
    .delete-button {
        font-size: 14px;
        padding: 5px 9px;
    }
}

/* 480px 이하 */
@media (max-width: 480px) {
    .userDetail-detail-box {
        font-size: 10px;
        /* padding: 8px 1vw; */
        max-width: 99vw;
        min-height: 28vh;
        max-height: 28vh;
        margin: 7px 0;
    }

    .userDetail-detail-row {
        /* flex-direction: column; */
        gap: 3px;
        align-items: flex-start;
    }

    .userDetail-detail-row .label,
    .userDetail-detail-row .value {
        font-size: 0.96em;
    }

    .edit-button,
    .delete-button {
        font-size: 12px;
        padding: 3px 7px;
    }

    .userDetail-detail-buttons {
        gap: 7px;
        /* margin-top: 10px; */
    }
}
</style>
