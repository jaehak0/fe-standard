<script setup>
    defineProps({ member: Object })
</script>

<template>
    <div 
    class="detail-title"
     v-if="member"
     >
      {{ member.nick }}님 상세정보
    </div>
    <div 
    class="member-detail-box"
    v-if="member"
    >
      <div class="member-detail-row">
        <span class="label"><b>이름</b> *</span>
        <span class="value bordered">{{ member.nick }}</span>
      </div>
      <div class="member-detail-row">
        <span class="label"><b>이메일</b> *</span>
        <span class="value bordered">{{ member.email }}</span>
      </div>
      <div class="member-detail-row">
        <span class="label"><b>전화번호</b> *</span>
        <span class="value bordered">{{ member.phone }}</span>
      </div>
      <div class="member-detail-row">
        <span class="label"><b>성별</b> *</span>
        <span class="value bordered">{{ member.gender === 'M' ? '남자' : '여자' }}</span>
      </div>
      <div class="member-detail-buttons">
        <button @click="$emit('edit')">수정</button>
        <button @click="$emit('delete')">삭제</button>
      </div>
    </div>
</template>

<style>
.member-detail-box {
  border: 1px solid #222;
  padding: 24px;
  width: 100%;
  height: 100%;
  /* max-width: 400px; */
  margin: 16px 0px 32px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.detail-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
.member-detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.label {
  min-width: 90px;
  font-weight: 500;
  text-align: left;
}
.value {
  flex: 1;
  text-align: left;
  padding-left: 16px;
}
.value.bordered {
  border-left: 2px solid #ccc;
}
.member-detail-buttons {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
