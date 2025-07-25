// src/api/backend.ts

import axios from "axios";
import type { User, UserListResponse } from "./types";

// API 서버 기본 주소
const BASE_URL = "https://anytalk.com:8701";

/** 1. 회원 목록 조회 */
export async function reqUserList(params?: {
    nick?: string;
    phone?: string;
    email?: string;
    page?: number;
    size?: number;
}) {
    const { data } = await axios.post<UserListResponse>(
        `${BASE_URL}/member/getMemberList`,
        params || {}
    );
    return data; // users, total_count, page, size, total_pages 등 포함
}

/** 2. 회원 상세조회 */
// export async function fetchUserDetail(user_key: number) {
//   const { data } = await axios.post<User>(
//     `${BASE_URL}/user/getUserDetail`,
//     { user_key }
//   );
//   return data;
// }

/** 3. 회원 생성 */
export async function reqInsertUser(user: Omit<User, "user_key">) {
    const { data } = await axios.post<User>(
        `${BASE_URL}/member/createMember`,
        user
    );
    return data;
}

/** 4. 회원 수정 */
export async function reqUpdateUser(user: User) {
    const { data } = await axios.put<User>(
        `${BASE_URL}/member/updateMember`,
        user
    );
    return data;
}

/** 5. 회원 삭제 */
export async function reqDeleteUser(user_key: number) {
    const { data } = await axios.delete<{ success: boolean }>(
        `${BASE_URL}/member/deleteMember`,
        { data: { user_key } }
    );
    return data.success;
}

// =========================
// API 서버 생존 여부
// =========================
export async function healthCheck() {
    const { data } = await axios.get(`${BASE_URL}/health`);
    return data;
}
