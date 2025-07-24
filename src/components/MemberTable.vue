<script setup>
import { ref, onMounted,computed } from "vue";
import { fetchMemberList } from "../api/memberApi";
import { useMemberStore } from "../stores/memberStore";
const memberStore = useMemberStore()
// const props = defineProps({
//   members: Array,
//   selected: Number,
//   page: { type: Number, default: 1 },
//   totalPages: { type: Number, default: 1 },
//   size: { type: Number, default: 10 }     // ← 기본값 10으로 지정
// });
const selected = ref(0);
const members = computed(() => memberStore.members);
const page = computed(() => memberStore.page);
const totalPages = computed(() => memberStore.totalPages);
const size = computed(() => memberStore.size);
const selectedIdx = ref(0); // 필요하면 store에도 만들고 관리!
const emit = defineEmits(['select', 'changePage', 'search','add']);
const PAGE_GROUP_SIZE = 10;
const searchKeyword = ref('');
const currentGroup = computed(() => Math.floor((page.value - 1) / PAGE_GROUP_SIZE));
const groupStart = computed(() => currentGroup.value * PAGE_GROUP_SIZE + 1);
const groupEnd = computed(() => Math.min(groupStart.value + PAGE_GROUP_SIZE - 1, totalPages.value));

const visiblePages = computed(() =>
  Array.from({ length: groupEnd.value - groupStart.value + 1 }, (_, i) => groupStart.value + i)
);
// const visiblePages = computed(() => {
//   console.log("페이지 전환");
//   return Array.from(
//     { length: groupEnd.value - groupStart.value + 1 },
//     (_, i) => groupStart.value + i
//   )
// });

function gotoPrevPage() {
  if (page.value > 1) {
    memberStore.loadMembers({ page: page.value - 1, size: size.value });
  }
}
function gotoNextPage() {
  if (page.value < totalPages.value) {
    memberStore.loadMembers({ page: page.value + 1, size: size.value });
  }
}
function gotoPrevGroup() {
  if (groupStart.value > 1) {
    memberStore.loadMembers({ page: groupStart.value - 1, size: size.value });
  }
}
function gotoNextGroup() {
  console.log(groupEnd.value,);
  if (groupEnd.value < totalPages.value) {
    memberStore.loadMembers({ page: groupEnd.value + 1, size: size.value });
  }
}
function handleSearch() {
  memberStore.loadMembers({
    page: 1,
    size: size.value,
    nick: searchKeyword.value,
    email: searchKeyword.value,
    phone: searchKeyword.value,
  });
}
function handleSelect(i) {
  selectedIdx.value = i;
  const mem = members.value[i];
  if (mem) {
    memberStore.loadMemberDetail(mem.user_key);
  }
}
</script>


<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
      <input type="text"  v-model="searchKeyword" placeholder="이름, 이메일, 전화번호로 검색..." style="flex:1;" @keyup.enter="handleSearch" />
      <button @click="handleSearch">검색</button>
      <button @click="$emit('add')">회원 추가</button>
    </div>
    <table class="member-table">
      <thead>
        <tr class="tr-header">
          <th class="th-number">번호</th>
          <th>이름</th>
          <th class="th-email">이메일</th>
          <th>전화번호</th>
          <th class="th-gender">성별</th>
        </tr>
      </thead>
      <tbody>
         <tr
          v-for="(m, i) in members"
          :key="m.user_key"
          @click="$emit('select', i)"
          :style="{background: selected===i?'#f3faff':''}"
        >
          <td class="td-number">{{(page - 1) * size + i + 1 }}</td>
          <td>{{m.nick}}</td>
          <td class="td-email">{{m.email}}</td>
          <td>{{m.phone}}</td>
          <td class="td-gender">{{ m.gender === 'M' ? '남자' : '여자' }}</td>
        </tr>
        <!-- 빈 row -->
        <tr
          v-for="n in (size - members.length)"
          :key="'empty-'+n"
          style="background: #f8fcff;"
        >
          <td class="td-number">&nbsp;</td>
          <td>&nbsp;</td>
          <td class="td-email">&nbsp;</td>
          <td>&nbsp;</td>
          <td class="td-gender">&nbsp;</td>
        </tr>
      </tbody>
    </table>
    <!-- 페이지네이션 생략 가능(원하면 아래 추가) -->
    <div style="margin-top:8px; text-align:center;">
         <button class="button pagination-btn" @click="gotoPrevGroup" :disabled="groupStart.value === 1">&lsaquo;&lsaquo;</button>
          <button class="button pagination-btn" @click="gotoPrevPage" :disabled="page === 1">&lsaquo;</button>
  
    <button
    v-for="p in visiblePages"
    :key="p"
    @click="page !== p && emit('changePage', p)"
    :class="['pagination-btn', { active: p === page }]"
    :disabled="p === page"
    type="button"
  >
    {{ p }}
  </button>
  <button class="button pagination-btn" @click="gotoNextPage" :disabled="page === totalPages">&rsaquo;</button>
  <button class="button pagination-btn" @click="gotoNextGroup" :disabled="groupEnd.value === totalPages">&rsaquo;&rsaquo;</button>
</div>
  </div>

</template>

<style>
/* 기본: 전부 보임 */
.th-email, .td-email,
.th-gender, .td-gender {
  display: table-cell;
}
.member-table th, .member-table td {
  font-size: 14px;
}

/* 900px 이하: 성별 열 숨김 */
@media (max-width: 980px) {
  .th-gender, .td-gender {
    display: none;
  }
  .member-table th, .member-table td {
    font-size: 12px;
  }
    input, button, select {
    font-size: 14px !important;
    padding: 6px 9px !important;
  }
}

/* 700px 이하: 이메일도 숨김 */
@media (max-width: 700px) {
  .th-email, .td-email {
    display: none;
  }
   .member-table th, .member-table td {
    font-size: 12px;
  }
}
.member-table {
  min-height: 62vh;
  max-height: 62vh;
  cursor: pointer;
}
@media (max-width: 480px) {
  input, button, select {
    font-size: 10px !important;
    padding: 6px 9px !important;
  }
  .member-table {
    min-width: 0;  /* 👈 최소폭 없애기 */
    width: 100%;   /* 👈 꽉차게 */
    font-size: 10px;
    /* 나머지 스타일은 기존 유지 */
  }
  .member-table th, .member-table td {
    font-size: 10px;
  }
  .pagination-btn {
    width: 20px !important;
    height: 18px !important;
  }
}
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  margin-bottom: 12px;
}

.pagination-btn {
  width: 40px;
  height: 36px;
  border: 1.5px solid #ededed;
  background: #fff;
  color: #333;
  font-size: 1.0rem;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: background 0.12s, color 0.12s, border 0.12s;
  box-shadow: 0 2px 4px 0 rgba(200,200,200,0.06);
  margin: 0;
  padding: 0;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.pagination-btn:not(:disabled):hover,
.pagination-btn:not(:disabled):focus {
  border: 1.5px solid #bdbdbd;
  background: #f5f5f5;
}

.pagination-btn:disabled {
  color: #bbb;
  background: #fafafa;
  border: 1.5px solid #ededed;
  cursor: not-allowed;
}

.pagination-btn.active,
.pagination-btn:disabled.active {
  background: #e0e0e0;
  color: #222;
  border: 1.5px solid #d0d0d0;
  font-weight: 600;
  pointer-events: none;
  box-shadow: none;
}
</style>
