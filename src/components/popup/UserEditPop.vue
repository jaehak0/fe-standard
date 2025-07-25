<script setup>
import { reactive, computed, watch } from "vue";
import { useUserStore } from "../../stores/userStore";
const g_propsFromParentEvt = defineProps({
    visible: Boolean,
    user: Object,
    mode: { type: String, default: "add" }, // add or edit
    onClose: Function,
    onSubmit: Function,
});
const g_userStore = useUserStore();
const g_editYn = computed(() => g_propsFromParentEvt.mode === "edit");
const g_userDetail = reactive({
    nick: "",
    email: "",
    phone: "",
    gender: "M", // 기본값 남성
});

watch(
    () => [
        g_propsFromParentEvt.visible,
        g_propsFromParentEvt.mode,
        g_propsFromParentEvt.user,
    ],
    ([visible, mode]) => {
        if (visible && mode === "add") {
            // 회원추가일 때 항상 초기화!
            g_userDetail.nick = "";
            g_userDetail.email = "";
            g_userDetail.age = 0;
            g_userDetail.phone = "";
            g_userDetail.gender = "M"; // 기본값
        } else if (visible && mode === "edit" && g_propsFromParentEvt.user) {
            // 수정일 때는 복사!
            Object.assign(g_userDetail, g_propsFromParentEvt.user);
        }
    },
    { immediate: true }
);

async function onBtnSubmit() {
    // 이름 검사
    if (!/^[가-힣a-zA-Z]{2,20}$/.test(g_userDetail.nick)) {
        alert("이름은 한글/영문 2~20자로 입력해주세요.");
        return;
    }
    // 나이 검사
    if (!g_userDetail.age || g_userDetail.age < 0 || g_userDetail.age > 150) {
        alert("나이는 0~150 사이의 숫자로 입력해주세요.");
        return;
    }
    // 전화번호 검사
    if (!/^010-\d{4}-\d{4}$/.test(g_userDetail.phone)) {
        alert("전화번호는 010-1234-5678 형식으로 입력해주세요.");
        return;
    }
    // 이메일 검사 (간단체크, 이미 type=email)
    if (!g_userDetail.email || g_userDetail.email.length > 40) {
        alert("올바른 이메일을 입력해주세요.");
        return;
    }
    // 성별 검사
    if (!g_userDetail.gender) {
        alert("성별을 선택해주세요.");
        return;
    }
    // 서버로 제출
    g_propsFromParentEvt.onSubmit({ ...g_userDetail });
    g_propsFromParentEvt.onClose(); // 저장 후 모달 닫기
}
function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, ""); // 숫자만 남김
    if (value.length <= 3) {
        value = value;
    } else if (value.length <= 7) {
        value = value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else {
        value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
    }
    g_userDetail.phone = value;
}
function limitAgeLength(e) {
    // 세 자리(999)까지만 입력 가능, 150 초과면 150으로 자동 조정
    let value = e.target.value;
    if (value.length > 3) {
        value = value.slice(0, 3);
    }
    if (parseInt(value, 10) > 150) {
        value = "150";
    }
    e.target.value = value;
    g_userDetail.age = Number(value);
}
</script>
<!--                 pattern="^[가-힣a-zA-Z]{2,20}$" -->
<template>
    <div v-if="visible" class="modal-backdrop">
        <div class="modal-box">
            <div class="modal-header">
                <span>
                    {{
                        g_editYn
                            ? `${g_userDetail.nick || ""}님 상세정보 수정`
                            : `회원 추가`
                    }}
                </span>
                <button class="modal-close" @click="onClose" aria-label="닫기">
                    ×
                </button>
            </div>
            <form @submit.prevent="onBtnSubmit" autocomplete="off">
                <div class="modal-body">
                    <div class="form-row">
                        <label>이름 *</label>
                        <input
                            v-model="g_userDetail.nick"
                            required
                            type="tel"
                            placeholder="이름을 입력하세요"
                            maxlength="20"
                        />
                    </div>
                    <div class="form-row">
                        <label>나이 *</label>
                        <input
                            v-model.number="g_userDetail.age"
                            type="number"
                            min="0"
                            max="150"
                            required
                            placeholder="나이 입력 (숫자)"
                            @input="limitAgeLength"
                        />
                    </div>
                    <div class="form-row">
                        <label>이메일 *</label>
                        <input
                            v-model="g_userDetail.email"
                            type="email"
                            required
                            maxlength="40"
                            placeholder="이메일을 입력하세요"
                        />
                    </div>
                    <div class="form-row">
                        <label>전화번호 *</label>
                        <input
                            v-model="g_userDetail.phone"
                            @input="formatPhone"
                            type="tel"
                            pattern="^010-\d{4}-\d{4}$"
                            maxlength="13"
                            inputmode="numeric"
                            required
                            placeholder="010-1234-5678"
                        />
                    </div>
                    <div class="form-row">
                        <label>성별 *</label>
                        <div class="gender-radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="M"
                                    v-model="g_userDetail.gender"
                                    required
                                />
                                남성
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="F"
                                    v-model="g_userDetail.gender"
                                />
                                여성
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="primary">
                        {{ g_editYn ? "저장" : "추가" }}
                    </button>
                    <button type="button" @click="onClose">취소</button>
                </div>
            </form>
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
    background: rgba(0, 0, 0, 0.19);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-box {
    background: #fff;
    border: 1.5px solid #95a4bb;
    padding: 26px 32px 22px 32px;
    min-width: 340px;
    max-width: 96vw;
    border-radius: 12px;
    box-shadow: 0 6px 24px 0 rgba(35, 45, 80, 0.1);
    position: relative;
}

.modal-header {
    font-weight: 600;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
}

.modal-close {
    padding-right: 1px;
    border: none;
    background: none;
    font-size: 22px;
    color: #222;
    cursor: pointer;
    font-weight: 600;
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 13px;
}

.form-row {
    display: flex;
    flex-direction: row;
    /* row로 변경! */
    align-items: center;
    /* 수직 중앙정렬 */
    gap: 10px;
    /* 라벨-인풋 간격 */
    margin-bottom: 14px;
}

.form-row label {
    display: flex;
    min-height: 35px;
    align-self: start;
    align-items: center;
    min-width: 90px;
    /* 라벨 고정폭 */
    font-size: 15px;
    color: #2d2d2d;
    font-weight: 500;
    margin-bottom: 0;
    /* 혹시 남아있으면 제거 */
}

.form-row input,
.form-row select {
    flex: 1;
    /* 남은 공간 모두 사용 */
    padding: 8px 10px;
    border: 1px solid #bfc9da;
    border-radius: 5px;
    font-size: 15px;
    background: #fcfdff;
}

.form-row input:focus,
.form-row select:focus {
    outline: 2px solid #3e77fa22;
    border-color: #3e77fa;
}

.modal-footer {
    margin-top: 22px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

button.primary {
    background: #3e77fa;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 8px 22px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.12s;
}

button.primary:hover {
    background: #265dc2;
}

button {
    background: #f5f7fa;
    border: 1px solid #bfc9da;
    border-radius: 5px;
    padding: 8px 22px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
}

button:active {
    opacity: 0.9;
}

.gender-radio-group {
    display: flex;
    gap: 22px;
    align-items: center;
    padding-left: 6px;
}

.gender-radio-group label {
    font-size: 15px;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 4px;
}

.gender-radio-group input[type="radio"] {
    accent-color: #3e77fa;
    margin-right: 3px;
    width: 15px;
    height: 15px;
}

button:focus,
button:active {
    outline: none;
    box-shadow: none;
    border-color: inherit;
    /* 기존 border 색 유지 */
}
</style>
