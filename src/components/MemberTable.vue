<script setup>
import { ref, onMounted,computed } from "vue";
import { fetchMemberList } from "../api/memberApi";
const props = defineProps({
  members: Array,
  selected: Number,
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  size: { type: Number, default: 10 }     // ← 기본값 10으로 지정
});
const emit = defineEmits(['select', 'changePage', 'search','add']);
const PAGE_GROUP_SIZE = 10;
const searchKeyword = ref('');
const currentGroup = computed(() => Math.floor((props.page - 1) / PAGE_GROUP_SIZE));
const groupStart = computed(() => currentGroup.value * PAGE_GROUP_SIZE + 1);
const groupEnd = computed(() =>
  Math.min(groupStart.value + PAGE_GROUP_SIZE - 1, props.totalPages)
);

const visiblePages = computed(() => {
  console.log("페이지 전환");
  return Array.from(
    { length: groupEnd.value - groupStart.value + 1 },
    (_, i) => groupStart.value + i
  )
});
function gotoPrevGroup() {
  if (groupStart.value > 1) {
    console.log("이전 페이지");
  emit('changePage', groupStart.value - 1);
  }
}
function gotoNextGroup() {
  if (groupEnd.value < props.totalPages){
  console.log("다음 페이지");
  emit('changePage', groupEnd.value + 1);
  } 
}
function handleSearch() {
  console.log("search");
  emit('search', searchKeyword.value); // 부모로 검색 키워드 전달
}
</script>


<template>
  <div>
    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
      <input type="text"  v-model="searchKeyword" placeholder="이름, 이메일, 전화번호로 검색..." style="flex:1;" />
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
  <button @click="gotoPrevGroup" :disabled="groupStart.value === 1">◀</button>
  <span
    v-for="p in visiblePages"
    :key="p"
    @click="emit('changePage', p)"
    :style="{ fontWeight: p === page ? 'bold' : '', margin: '0 6px', cursor: 'pointer' }"
  >
    {{ p }}
  </span>
  <button @click="gotoNextGroup" :disabled="groupEnd.value === totalPages">▶</button>
</div>
  </div>

</template>

<style>
/* 기본: 전부 보임 */
.th-email, .td-email,
.th-gender, .td-gender {
  display: table-cell;
}
.tr-header {
  font-size: 20px;
}

/* 900px 이하: 성별 열 숨김 */
@media (max-width: 900px) {
  .th-gender, .td-gender {
    display: none;
  }
}

/* 700px 이하: 이메일도 숨김 */
@media (max-width: 700px) {
  .th-email, .td-email {
    display: none;
  }
}
.member-table {
  min-height: 522px;
}
@media (max-width: 480px) {
  input, button, select {
    font-size: 14px !important;
    padding: 6px 9px !important;
  }
  .member-table {
    min-width: 0;  /* 👈 최소폭 없애기 */
    width: 100%;   /* 👈 꽉차게 */
    font-size: 12px;
    /* 나머지 스타일은 기존 유지 */
  }
}
</style>
