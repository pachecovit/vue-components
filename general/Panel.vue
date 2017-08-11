<script>
  export default {
    name: 'panel',
    props: {
      title: String,
      content: String
    }
    computed: {
      classes () {
        return {
          'panel-wrapper': true,
          'panel-default': this.default,
          'panel-success': this.success,
          'panel-info': this.info,
          'panel-warning': this.warning,
          'panel-error': this.error
        }
      }
    }
  }
</script>

<template>
  <div v-bind:class="classes" class="panel-error">
    <div class="panel-header">{{title}}</div>
    <div class="panel-content">
      {{content}}
    </div>
  </div>
</template>

<style>
  .panel-wrapper {
    font-size: 14px;
    position: relative;
    margin-bottom: 32px;
    border-radius: 3px;
    border: 1px solid #fff;
  }
  .panel-header {
    line-height: 1.2;
    padding: 10px 10px;
    margin: 0;
    border-radius: 3px 3px 0 0;
    border-bottom: 1px solid #fff;
  }
  .panel-content {
    background-color: #fff;
    border-radius: 0 0 3px 3px;
    padding: 10px;
  }

  /* panel DEFAULT */
  .panel-default {
    border-color: #bbb;
  }
  .panel-default .panel-header {
    color: #999;
    background-color: #eee;
    border-color: #bbb;
  }

  /* panel SUCCESS */
  .panel-success {
    border-color: #d6e9c6;
  }
  .panel-success .panel-header {
    color: #3c763d;
    background-color: #dff0d8;
    border-color: #d6e9c6;
  }

  /* panel INFO */
  .panel-info {
    border-color: #bde2fb;
  }
  .panel-info .panel-header {
    color: #31708f;
    background-color: #d9edf7;
    border-color: #bde2fb;
  }

  /* panel WARNING */
  .panel-warning {
    border-color: #faebcc;
  }
  .panel-warning .panel-header {
    color: #8a6d3b;
    background-color: #fcf8e3;
    border-color: #faebcc;
  }

  /* panel WARNING */
  .panel-error {
    border-color: #ebccd1;
  }
  .panel-error .panel-header {
    color: #a94442;
    background-color: #f2dede;
    border-color: #ebccd1;
  }
</style>