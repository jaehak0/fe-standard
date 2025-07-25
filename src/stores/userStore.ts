import { defineStore } from "pinia";
import { ref } from "vue";
import { reqUserList, reqDeleteUser } from "../api/userApi";
import type { User } from "../api/types";

export const useUserStore = defineStore("user", () => {
    const users = ref<User[]>([]);
    const totalCount = ref(0);
    const page = ref(1);
    const size = ref(10);
    const totalPages = ref(1);
    const selectedUser = ref<User | null>(null);

    // 회원 목록 조회
    async function searchUserList(params = { page: 1, size: 10 }) {
        debugger;
        const result = await reqUserList(params);
        users.value = result.members;
        totalCount.value = result.total_count;
        page.value = result.page;
        size.value = result.size;
        totalPages.value = result.total_pages;
    }

    // 회원 삭제
    async function removeUser(user_key: number) {
        await reqDeleteUser(user_key);
        await searchUserList({ page: page.value, size: size.value }); // 목록 갱신
    }

    return {
        // state
        users,
        totalCount,
        page,
        size,
        totalPages,
        selectedUser,
        // actions
        searchUserList,
        removeUser,
    };
});
