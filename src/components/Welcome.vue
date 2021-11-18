<template>
  <div class="container">
    <div class="top-title">
      <span class="title-span">Welcome, 电商后台管理系统!</span>
    </div>

    <div class="foot-area">
      <div class="seprate"></div>
      <span>By Hinoki</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeCompt',
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.top-title {
  height: 90%;
  width: 100%;
  display: flex;
  position: absolute;
  text-align: center;
  align-items: flex-end;
  background-image: url('../assets/logo.png');
  background-repeat: no-repeat;
  background-position: center;

  .title-span {
    width: 100%;
    bottom: 20px;
    margin-bottom: 100px;
    border-radius: 20px;
    font-size: 30px;
    font-weight: bold;
    color: rgb(184, 204, 186);
  }
}

.foot-area {
  width: 100%;
  position: absolute;
  text-align: center;
  bottom: 0;
  .seprate {
    width: 100%;
    background-color: rgb(204, 204, 204);
    padding: 1px;
    border-radius: 20px;
  }
  span {
    margin-top: 20px;
    padding: 5px;
    font-size: 6px;
    font-style: italic;
  }
}
</style>
