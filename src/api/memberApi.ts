// src/api/backend.ts

import axios from "axios";

// API 서버 기본 주소
const BASE_URL = "https://anytalk.com:8701";

// =======================
// 타입 정의 (Swagger 기반)
// =======================

export interface Member {
  user_key: number;
  nick: string;
  age: number;
  phone: string;
  email: string;
  gender: string; // "M" 또는 "F"
}

// 목록 응답 (API 응답 구조 기준)
export interface MemberListResponse {
  members: Member[];
  total_count: number;
  page: number;
  size: number;
  total_pages: number;
}

// ==========================
// API 함수들
// ==========================

/** 1. 회원 목록 조회 */
export async function fetchMemberList(params?: { nick?: string; phone?: string; email?: string; page?: number; size?: number }) {
  const { data } = await axios.post<MemberListResponse>(
    `${BASE_URL}/member/getMemberList`,
    params || {}
  );
  return data; // members, total_count, page, size, total_pages 등 포함
}

/** 2. 회원 상세조회 */
export async function fetchMemberDetail(user_key: number) {
  const { data } = await axios.post<Member>(
    `${BASE_URL}/member/getMemberDetail`,
    { user_key }
  );
  return data;
}

/** 3. 회원 생성 */
export async function createMember(member: Omit<Member, "user_key">) {
  const { data } = await axios.post<Member>(
    `${BASE_URL}/member/createMember`,
    member
  );
  return data;
}

/** 4. 회원 수정 */
export async function updateMember(member: Member) {
  const { data } = await axios.put<Member>(
    `${BASE_URL}/member/updateMember`,
    member
  );
  return data;
}

/** 5. 회원 삭제 */
export async function deleteMember(user_key: number) {
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
