<script setup>
import { ref, onMounted, computed, defineExpose } from "vue";
import { reqUserList } from "../api/userApi";
import { useUserStore } from "../stores/userStore";
const PAGE_GROUP_SIZE = 5;
const g_userStore = useUserStore();

const g_selected = ref(0);
const g_users = computed(() => g_userStore.users);
const g_page = computed(() => g_userStore.page);
const g_totalPages = computed(() => g_userStore.totalPages);
const g_size = computed(() => g_userStore.size);
const g_selectedIdx = ref(0); // 필요하면 store에도 만들고 관리!

const g_emitToParentEvt = defineEmits([
    "onUserClick",
    "onBtnUserSearch",
    "onBtnUserAdd",
    "onPageChange",
]);

const g_searchKeyword = ref("");
defineExpose({
    g_searchKeyword,
});
const g_currentPageGroup = computed(() =>
    Math.floor((g_page.value - 1) / PAGE_GROUP_SIZE)
);
const g_pageGroupStart = computed(
    () => g_currentPageGroup.value * PAGE_GROUP_SIZE + 1
);
const g_pageGroupEnd = computed(() =>
    Math.min(g_pageGroupStart.value + PAGE_GROUP_SIZE - 1, g_totalPages.value)
);

const g_visiblePages = computed(() =>
    Array.from(
        { length: g_pageGroupEnd.value - g_pageGroupStart.value + 1 },
        (_, i) => g_pageGroupStart.value + i
    )
);

function gotoPrevPage() {
    if (g_page.value > 1) {
        g_userStore.searchUserList({
            page: g_page.value - 1,
            size: g_size.value,
        });
    }
}
function gotoNextPage() {
    if (g_page.value < g_totalPages.value) {
        g_userStore.searchUserList({
            page: g_page.value + 1,
            size: g_size.value,
        });
    }
}
function gotoPrevGroup() {
    if (g_pageGroupStart.value > 1) {
        g_userStore.searchUserList({
            page: g_pageGroupStart.value - 1,
            size: g_size.value,
        });
    }
}
function gotoNextGroup() {
    console.log(g_pageGroupEnd.value);
    if (g_pageGroupEnd.value < g_totalPages.value) {
        g_userStore.searchUserList({
            page: g_pageGroupEnd.value + 1,
            size: g_size.value,
        });
    }
}
function searchUserList(pageNum = 1) {
    g_userStore.searchUserList({
        g_page: pageNum,
        g_size: g_size.value,
        nick: g_searchKeyword.value,
        email: g_searchKeyword.value,
        phone: g_searchKeyword.value,
    });
}
function handleSelect(i) {
    g_selectedIdx.value = i;
    const mem = g_users.value[i];
    if (mem) {
        g_userStore.loadUserDetail(mem.user_key);
    }
}
</script>

<template>
    <div>
        <div style="display: flex; gap: 8px; margin-bottom: 8px">
            <input
                type="text"
                v-model="g_searchKeyword"
                placeholder="이름, 이메일, 전화번호로 검색..."
                style="flex: 1"
                @keyup.enter="searchUserList"
            />
            <button @click="searchUserList">검색</button>
            <button @click="g_emitToParentEvt('onBtnUserAdd')">
                회원 추가
            </button>
        </div>
        <table class="user-table">
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
                    v-for="(m, i) in g_users"
                    :key="m.user_key"
                    @click="g_emitToParentEvt('onClickUser', i)"
                    :style="{ background: g_selected === i ? '#f3faff' : '' }"
                >
                    <td class="td-number">
                        {{ (g_page - 1) * g_size + i + 1 }}
                    </td>
                    <td>{{ m.nick }}</td>
                    <td class="td-email">{{ m.email }}</td>
                    <td>{{ m.phone }}</td>
                    <td class="td-gender">
                        {{ m.gender === "M" ? "남자" : "여자" }}
                    </td>
                </tr>
                <!-- 빈 row -->

                <tr
                    v-for="n in g_size - g_users.length"
                    :key="'empty-' + n"
                    style="background: #f8fcff"
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
        <div style="margin-top: 8px; text-align: center">
            <button
                class="button pagination-btn"
                @click="gotoPrevGroup"
                :disabled="g_pageGroupStart.value === 1"
            >
                &lsaquo;&lsaquo;
            </button>
            <button
                class="button pagination-btn"
                @click="gotoPrevPage"
                :disabled="g_page === 1"
            >
                &lsaquo;
            </button>

            <button
                v-for="p in g_visiblePages"
                :key="p"
                @click="g_page !== p && g_emitToParentEvt('onPageChange', p)"
                :class="['pagination-btn', { active: p === g_page }]"
                :disabled="p === g_page"
                type="button"
            >
                {{ p }}
            </button>
            <button
                class="button pagination-btn"
                @click="gotoNextPage"
                :disabled="g_page === g_totalPages"
            >
                &rsaquo;
            </button>
            <button
                class="button pagination-btn"
                @click="gotoNextGroup"
                :disabled="g_pageGroupEnd.value === g_totalPages"
            >
                &rsaquo;&rsaquo;
            </button>
        </div>
    </div>
</template>

<style>
/* 기본: 전부 보임 */
.th-email,
.td-email,
.th-gender,
.td-gender {
    display: table-cell;
}

.user-table th,
.user-table td {
    font-g_size: 14px;
}

/* 900px 이하: 성별 열 숨김 */
@media (max-width: 980px) {
    .th-gender,
    .td-gender {
        display: none;
    }

    .user-table th,
    .user-table td {
        font-g_size: 12px;
    }

    input,
    button,
    select {
        font-g_size: 14px !important;
        padding: 6px 9px !important;
    }
}

/* 700px 이하: 이메일도 숨김 */
@media (max-width: 700px) {
    .th-email,
    .td-email {
        display: none;
    }

    .user-table th,
    .user-table td {
        font-g_size: 12px;
    }
}

.user-table {
    min-height: 62vh;
    max-height: 62vh;
    cursor: pointer;
}

@media (max-width: 480px) {
    input,
    button,
    select {
        font-g_size: 10px !important;
        padding: 6px 9px !important;
    }

    .user-table {
        min-width: 0;
        /* 👈 최소폭 없애기 */
        width: 100%;
        /* 👈 꽉차게 */
        font-g_size: 10px;
        /* 나머지 스타일은 기존 유지 */
    }

    .user-table th,
    .user-table td {
        font-g_size: 10px;
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
    font-g_size: 1rem;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    transition: background 0.12s, color 0.12s, border 0.12s;
    box-shadow: 0 2px 4px 0 rgba(200, 200, 200, 0.06);
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
