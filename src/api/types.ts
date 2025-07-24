/** 회원 정보 */
export interface Member {
  user_key: number;
  nick: string;
  age: number;
  phone: string;
  email: string;
  gender: string; // "M" 또는 "F"
}

/** 회원 목록 응답 */
export interface MemberListResponse {
  members: Member[];
  total_count: number;
  page: number;
  size: number;
  total_pages: number;
}
