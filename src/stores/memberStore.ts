import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMemberList, createMember, updateMember, deleteMember } from '../api/memberApi'
import type { Member } from '../api/types'

export const useMemberStore = defineStore('member', () => {
  const members = ref<Member[]>([])
  const totalCount = ref(0)
  const page = ref(1)
  const size = ref(10)
  const totalPages = ref(1)
  const selectedMember = ref<Member | null>(null)

  // 회원 목록 조회
  async function loadMembers(params = { page: 1, size: 10 }) {
    const result = await fetchMemberList(params)
    members.value = result.members
    totalCount.value = result.total_count
    page.value = result.page
    size.value = result.size
    totalPages.value = result.total_pages
  }

  // 회원 상세조회
  async function loadMemberDetail(user_key: number) {
    selectedMember.value = await fetchMemberDetail(user_key)
  }

  // 회원 생성
  async function addMember(member: Omit<Member, 'user_key'>) {
    await createMember(member)
    await loadMembers({ page: page.value, size: size.value }) // 목록 갱신
  }

  // 회원 수정
  async function editMember(member: Member) {
    await updateMember(member)
    await loadMembers({ page: page.value, size: size.value }) // 목록 갱신
  }

  // 회원 삭제
  async function removeMember(user_key: number) {
    await deleteMember(user_key)
    await loadMembers({ page: page.value, size: size.value }) // 목록 갱신
  }

  return {
    // state
    members, totalCount, page, size, totalPages, selectedMember,
    // actions
    loadMembers, loadMemberDetail, addMember, editMember, removeMember,
  }
})
