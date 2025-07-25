
<script setup>
import { ref, onMounted } from 'vue'
import { useMemberStore } from '../stores/memberStore'
import { storeToRefs } from 'pinia'
import HeaderSection from './HeaderSection.vue'
import MemberTable from './MemberTable.vue'
import MemberDetail from './MemberDetail.vue'
import FooterSection from './FooterSection.vue'
import MemberEditModal from "./popup/MemberOptionModal.vue";
import MemberDeleteModal from "./popup/MemberDeleteModal.vue";
import { fetchMemberList,createMember,updateMember,deleteMember } from "../api/memberApi";
import Toast from './popup/ToastMessage.vue' // Toast import

// const members = ref([]);
const selectedIdx = ref(0);
const keyword = ref('');
const toastMessage = ref('');
const toastShow = ref(false);
const showEditModal = ref(false);
const editMode = ref("add"); // 'add' or 'edit'
const editMember = ref(null);
const showDeleteModal = ref(false);
const deleteTarget = ref(null);
const memberStore = useMemberStore()
const { members, totalCount, page, size, totalPages, selectedMember } = storeToRefs(memberStore)


async function handleSearch(searchText) {
  keyword.value = searchText;
  page.value = 1;
  await load(page.value, searchText);
}

function showToast(msg = "저장되었습니다!") {
  toastMessage.value = msg;
  toastShow.value = false; // 재클릭시 재생을 위해
  setTimeout(() => {
    toastShow.value = true;
  }, 10); // (nextTick 효과)
}
// showToast의 message, setTimeout을 공통함수를 빼야함.
// 화면 스택관리 - 업무 페이지 안에서 스택관리 필요

// 팝업 submit (add/edit) -> handleModalSubmmit 변경 / submit을 받으면 모달이 닫혀야함.
// param으로 mode가 올 수 있게, editMode는 없음.
// reqCreateUser, reqUpdateUser
async function handleModalSubmit(memberData) {
  if (editMode.value === "add") {
    console.log("여기?",memberData);
    await createMember(memberData); // API 호출
    showToast("회원이 등록되었습니다.");
  } else {
    await updateMember({ ...editMember.value, ...memberData });
    showToast("회원 정보가 수정되었습니다.");
  }
  closeEditModal();
  await load(page.value);
}

// 삭제 시 예시 -> onDeleteUser
async function handleDeleteConfirm() {
  await deleteMember(deleteTarget.value.user_key);
  showToast("회원이 삭제되었습니다.");
  closeDeleteModal();
  await load(page.value);
}

// onSelectUserList
async function handleSelect(idx) {
  selectedIdx.value = idx
  const mem = members.value[idx]
  if (mem) await loadDetail(mem.user_key)
}

async function load(pageNum = 1, keyword = '') {
  const result = await fetchMemberList({ page: pageNum, size: size.value, nick:keyword,email:keyword,phone:keyword});
  console.log(result);
  members.value = result.members || [];
  totalCount.value = result.total_count || 0;
  page.value = result.page;
  totalPages.value = result.total_pages;
  // 첫번째 멤버 상세도 같이 불러올 경우
  if (members.value.length > 0) loadDetail(members.value[0].user_key);
}

async function loadDetail(id) {
  const detail = members.value.find(m => m.user_key === id);
  selectedMember.value = detail || null;
}


onMounted(() => {
  load();
});

function handlePageChange(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    console.log("newPage");
    load(newPage);
  }
}

// 팝업 열기/닫기
// openAddUser, openEditUser, closeEditUser 
function openAddModal() {
  editMode.value = "add";
  editMember.value = null;
  showEditModal.value = true;
}
function openEditModal() {
  editMode.value = "edit";
  editMember.value = members.value[selectedIdx.value];
  showEditModal.value = true;
}

// 스스로 닫히게 하는 내용 확인
function closeEditModal() {
  showEditModal.value = false;
}


// 삭제 팝업 관련
function openDeleteModal() {
  deleteTarget.value = members.value[selectedIdx.value];
  showDeleteModal.value = true;
}
function closeDeleteModal() { showDeleteModal.value = false; }

</script>
<template>
  <div>

    <HeaderSection :total-count="totalCount"/>

    <main class="layout-main">
      <section class="table-area">
        <MemberTable
          :members="members"
          :selected="selectedIdx"
          :page="page"
          :totalPages="totalPages"
          :size="size"
          @select="handleSelect"
          @changePage="handlePageChange"
          @search="handleSearch"
          @add="openAddModal"
        />
        <!-- add -> btnAddUser , 함수 : onBtnAddUser -->
      </section>
      <aside class="detail-area">
        <MemberDetail
              v-if="members.length"
              :member="members[selectedIdx]"
              @edit="openEditModal"
              @delete="openDeleteModal"
        />
      </aside>
    </main>
    <MemberEditModal
      :visible="showEditModal"
      :mode="editMode"
      :member="editMember"
      :onSubmit="handleModalSubmit"
      :onClose="closeEditModal"
    />
    <MemberDeleteModal
      :visible="showDeleteModal"
      :member="deleteTarget"
      :onSubmit="handleDeleteConfirm"
      :onClose="closeDeleteModal"
    />
    <Toast :message="toastMessage" :show="toastShow" :duration="2000" />
    <FooterSection />
  </div>
</template>

<style>
html, body, #app, .app-root {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  overflow: hidden; /* 필요 시 */
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
.member-table {
  width: 100%;
  border-collapse: collapse;
}
.member-table th, .member-table td {
  border: 1px solid #aaa;
  padding: 8px;
  text-align: center;
}
.member-table th {
  background: #f8f8f8;
}
@media (max-width: 820px) {
  .layout-main {
    flex-direction: column;
    gap: 14px;
    padding: 16px 5vw;
  }
  .table-area, .detail-area {
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
  .member-table th, .member-table td {
    font-size: 10px;
    padding: 3px 2px;
  }
  .member-table {
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
