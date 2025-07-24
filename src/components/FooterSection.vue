<template>
  <footer class="main-footer">
    <div class="logo-area">
      <img src="../assets/saeumlogo.png" alt="로고" class="logo-img" />
    </div>
    <div class="footer-info">
      © (주)새움소프트<br/>
      대표전화:  031-429-4216<br/>
      사업자등록번호: 138-8125116
    </div>
    <div class="logo-area"></div> <!-- 오른쪽 공간 맞추기 -->
  </footer>
</template>

<style>
.main-footer {
  height: 48px;
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  padding: 0 10px;
  font-size: 15px;
  color: #444;
  flex-direction: column;
}
.logo-area {
  width: 150px;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-img {
  height: 28px;
}
.footer-info {
  flex: 1;
  text-align: center;
  font-size: 1.0rem;
  color: #666;
  letter-spacing: -0.5px;
}

@media (max-width: 768px) {
  .main-footer {
    height: 36px;
    padding: 0 4px;
    font-size: 12px;
  }
  .logo-area {
    width: 95px;
  }
  .logo-img {
    height: 16px;
  }
  .footer-info {
    font-size: 12px;
    letter-spacing: -0.5px;
  }
}

@media (max-width: 480px) {
  .main-footer {
    height: 28px;
    padding: 0 1vw;
    font-size: 10.5px;
  }
  .logo-area {
    width: 62px;
  }
  .logo-img {
    height: 12px;
  }
  .footer-info {
    font-size: 9px;
    padding: 0 1vw;
    white-space: normal;
    line-height: 1.3;
  }
}
</style>
