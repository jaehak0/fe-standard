<script setup>
    defineProps({ member: Object })
</script>

<template>
    <div class="memmber-detail-header">
      <div 
      class="detail-title"
      v-if="member"
      >
        {{ member.nick }}님 상세정보
      </div>
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
        <button class="edit=button" @click="$emit('edit')">수정</button>
        <button class="delete=button" @click="$emit('delete')">삭제</button>
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
  margin: 8px 0px 32px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 62vh;
  max-height: 62vh;
}
/* .detail-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
} */
 .member-detail-header,
.detail-title {
  min-height: 42px;  /* 같은 값으로 맞춤! 실제 높이에 따라 40~44px 등 조정 */
  font-weight: 600;
  display: flex;
  align-items: center;
  /* 필요하면 padding, gap 등 추가 */
}
.member-detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.label {
  min-width: 90px;
  font-weight: 500;
  font-size: clamp(10px, 20vw, 15px);
  text-align: left;
}
.value {
  flex: 1;
  text-align: left;
  padding-left: 16px;
font-size: clamp(10px, 20vw, 15px);
}
.value.bordered {
  border-left: 2px solid #ccc;
}
.member-detail-buttons {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
font-size: clamp(10px, 20vw, 15px);
}
.button:hover,
.button:focus {
  border: 1.5px solid #bdbdbd !important;
  background: #f5f5f5 !important; 
}
</style>
