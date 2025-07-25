<script setup>
defineProps({
	totalCount: {
		type: Number,
		default: 0
	}
});
</script>

<template>
	<header class="main-header">
		<div class="logo-area">
			<img src="../assets/saeumlogo.png" alt="로고" class="logo-img" />
		</div>
		<div class="header-title">
			새움소프트 회원관리 (총: {{ totalCount }}명)
		</div>
		<div class="logo-area"></div> <!-- 오른쪽도 같은 크기로 공간 확보 -->
	</header>
</template>

<style>
.main-header {
	height: 50px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid #ddd;
	padding: 0 10px;
}

.logo-area {
	width: 150px;
	/* 로고 이미지 width에 맞춰서, 크기 조정 */
	display: flex;
	align-items: center;
	justify-content: center;
}

.logo-img {
	height: 32px;
	/* 원하는 크기로 조정 */
}

.header-title {
	flex: 1;
	text-align: center;
	font-weight: bold;
	font-size: 18px;
}

@media (max-width: 820px) {
	.main-header {
		height: 40px;
		padding: 0 4px;
	}

	.logo-area {
		width: 95px;
	}

	.logo-img {
		height: 22px;
	}

	.header-title {
		font-size: 12px;
		letter-spacing: -0.5px;
	}
}

@media (max-width: 480px) {
	.main-header {
		height: 32px;
		padding: 0 1vw;
	}

	.logo-area {
		width: 62px;
	}

	.logo-img {
		height: 15px;
	}

	.header-title {
		font-size: 10px;
		font-weight: 600;
		word-break: keep-all;
		white-space: normal;
		padding: 0 2vw;
		/* 혹시나 길면 2줄 처리 */
	}
}
</style>
