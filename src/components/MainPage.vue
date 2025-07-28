<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import HeaderSection from "./HeaderSection.vue";
import UserTable from "./UserTable.vue";
import UserDetail from "./UserDetail.vue";
import FooterSection from "./FooterSection.vue";
import UserEditPop from "./popup/UserEditPop.vue";
import UserDeletePop from "./popup/UserDeletePop.vue";
import CommonConfirmPop from "./popup/CommonConfirmPop.vue";

import {
    reqUserList,
    reqInsertUser,
    reqUpdateUser,
    reqDeleteUser,
} from "../api/userApi";
import Toast from "./popup/ToastMessage.vue"; // Toast import

// const users = ref([]);
const g_selectedIdx = ref(0);
const g_txtKeyword = ref("");
const g_toastMessage = ref("");
const g_toastShow = ref(false);
const g_showUpdateModal = ref(false);
const g_editMode = ref("add"); // 'add' or 'edit'
const g_editUser = ref(null);
const g_showDeleteModal = ref(false);
const g_deleteTarget = ref(null);
const g_userStore = useUserStore();
const g_commPopVisible = ref(false);
const g_popHeaderMsg = ref("");
const g_popBodyMsg = ref("");

function showToast(msg = "저장되었습니다!") {
    g_toastMessage.value = msg;
    g_toastShow.value = false; // 재클릭시 재생을 위해
    setTimeout(() => {
        g_toastShow.value = true;
    }, 10); // (nextTick 효과)
}
// showToast의 message, setTimeout을 공통함수를 빼야함.
// 화면 스택관리 - 업무 페이지 안에서 스택관리 필요

// 팝업 submit (add/edit) -> handleModalSubmmit 변경 / submit을 받으면 모달이 닫혀야함.
// param으로 mode가 올 수 있게, g_editMode는 없음.
// reqCreateUser, reqUpdateUser
async function onSaveUser(userData) {
    if (g_editMode.value === "add") {
        console.log("여기?", userData);
        await reqInsertUser(userData); // API 호출
        showToast("회원이 등록되었습니다.");
    } else {
        await reqUpdateUser({ ...g_editUser.value, ...userData });
        showToast("회원 정보가 수정되었습니다.");
    }
    hideUserPop();
    await searchUserList(g_userStore.page.value);
}

// 삭제 시 예시 -> onDeleteUser
async function onDeleteUser() {
    await reqDeleteUser(g_deleteTarget.value.user_key);
    await searchUserList(g_userStore.page.value);
    showToast("회원이 삭제되었습니다.");
    hideUserDeletePop();
}

async function onSelectUser(idx) {
    g_selectedIdx.value = idx;
    const mem = g_userStore.users.value[idx];
    if (mem) await searchUserListDetail(mem.user_key);
}

async function searchUserList(pageNum = 1) {
    g_userStore.searchUserList({
        page: pageNum,
        size: g_userStore.size,
        nick: g_txtKeyword.value,
        email: g_txtKeyword.value,
        phone: g_txtKeyword.value,
    });
}

async function searchUserListDetail(id) {
    const detail = g_userStore.users.value.find((mem) => mem.user_key === id);
    g_userStore.selectedUser.value = detail || null;
}

onMounted(() => {
    searchUserList();
});

// 팝업 열기/닫기
// openAddUser, openEditUser, closeEditUser
function openAddUserPop() {
    g_editMode.value = "add";
    g_editUser.value = null;
    g_showUpdateModal.value = true;
}

function onBtnUserAdd() {
    showAddUserPop();
}

function showUserUpdatePop() {
    g_editMode.value = "edit";
    g_editUser.value = g_userStore.users.value[g_selectedIdx.value];
    g_showUpdateModal.value = true;
}

function onBtnUserUpdate() {
    showUserUpdatePop();
}

// 삭제 팝업 관련
function showUserDeletePop() {
    g_deleteTarget.value = g_userStore.users.value[g_selectedIdx.value];
    g_showDeleteModal.value = true;
}

function onBtnUserDelete() {
    showUserDeletePop();
}

function hideUserDeletePop() {
    g_showDeleteModal.value = false;
}

// 스스로 닫히게 하는 내용 확인
function hideUserPop() {
    g_showUpdateModal.value = false;
}

function callbackCommPopConfirm() {}
function callbackCommPopCancel() {}

async function onLblUserDetail(id) {
    const detail = g_userStore.users.find((m) => m.user_key === id);
    g_userStore.selectedUser = detail || null;
}
</script>
<template>
    <div>
        <HeaderSection :total-count="g_userStore.totalCount" />

        <main class="layout-main">
            <section class="table-area">
                <UserTable
                    :users="g_userStore.users"
                    :selected="g_selectedIdx"
                    :page="page"
                    :totalPages="g_userStore.totalPages"
                    :size="size"
                    @onUserClick="onUserClick"
                    @onBtnUserSearch="onBtnUserSearch"
                    @onBtnUserAdd="onBtnUserAdd"
                />
                <!-- add -> btnAddUser , 함수 : onBtnAddUser -->
            </section>
            <aside class="detail-area">
                <UserDetail
                    v-if="g_userStore.users.length"
                    :user="g_userStore.users[g_selectedIdx]"
                    @onBtnUserUpdate="onBtnUserUpdate"
                    @onBtnUserDelete="onBtnUserDelete"
                />
            </aside>
        </main>
        <UserEditPop
            :visible="g_showUpdateModal"
            :mode="g_editMode"
            :user="g_editUser"
            :onSubmit="onSaveUser"
            :onClose="hideUserPop"
        />

        <CommonPopup
            v-model:visible="g_commPopVisible"
            :popHeaderMsg="g_popHeaderMsg"
            :popBodyMsg="g_popBodyMsg"
            :onConfirm="callbackCommPopConfirm"
            :onCancel="callbackCommPopCancel"
        />

        <Toast :message="g_toastMessage" :show="g_toastShow" :duration="2000" />
        <FooterSection />
    </div>
</template>

<style>
html,
body,
#app,
.app-root {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    min-width: 100vw;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    overflow: hidden;
    /* 필요 시 */
}

.layout-main {
    display: flex;
    flex-direction: row;
    gap: 32px;
    padding: 24px 16px;
    min-height: 70vh;
}

@media (max-width: 900px) {
    .layout-main {
        flex-direction: row;
        gap: 16px;
    }
}

.table-area {
    flex: 6 1 0;
    min-width: 300px;
    overflow-y: auto;
}

.detail-area {
    flex: 4 1 0;
    display: flex;
    align-items: start;
    justify-content: start;
    flex-direction: column;
    min-height: 300px;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
}

.user-table th,
.user-table td {
    border: 1px solid #aaa;
    padding: 8px;
    text-align: center;
}

.user-table th {
    background: #f8f8f8;
}

@media (max-width: 820px) {
    .layout-main {
        flex-direction: column;
        gap: 14px;
        padding: 16px 5vw;
    }

    .table-area,
    .detail-area {
        min-width: 0;
        width: 100%;
    }
}

/* 480px 이하: 표/버튼/모달 폰트·패딩 축소, 테이블 가로스크롤 허용 */
@media (max-width: 480px) {
    .layout-main {
        padding: 10px 2vw;
        gap: 7px;
    }

    .user-table th,
    .user-table td {
        font-size: 10px;
        padding: 3px 2px;
    }

    .user-table {
        font-size: 10px;
        /* min-width: 520px; 표 컬럼 잘림 방지, 가로스크롤 허용 */
        overflow-x: auto;
        /* display: block; */
    }

    .modal-box {
        min-width: 0 !important;
        width: 98vw !important;
        max-width: 98vw !important;
        padding: 10px 4vw 15px 4vw !important;
        font-size: 14px !important;
    }
}
</style>
