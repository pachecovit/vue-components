<script>
  export default {
    name: 'card',
    props: {
      imageSrc: String
    }
  }
</script>

<template>
  <div class="card-container" @click="$emit('click')" @mouseover="$emit('mouseover')" @mouseout="$emit('mouseout')">
    <img v-if="imageSrc !== null" :src="imageSrc">
    <div class="card-title"><span><slot></slot></span></div>
  </div>
</template>

<style scoped>
  .card-container {
    cursor: pointer;
    position: relative;
    display: inline-block;
    width: 240px;
    height: 280px;
    box-shadow: 2px 2px 4px 0 #ccc;
  }
  .card-container img {
    width: 240px;
    height: 280px;
    border: none;
    background: url('http://via.placeholder.com/240x280');
  }
  .card-title {
    text-transform: uppercase;
    width: 100%;
    background-color: #999;
    height: 32px;
    color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 10px;
    z-index: 10;
  }
  .card-title span {
    line-height: 34px;
  }
</style>