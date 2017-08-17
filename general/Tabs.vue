<script>
  export default {
    name: 'tabs',
    data () {
      return {
        activeTabIndex: 0
      }
    },
    props: {
      tabs: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    methods: {
      goToTab (tab, index) {
        this.activeTabIndex = index
      }
    }
  }
</script>

<template>
  <div class="tabs-wrapper">
    <div class="tabs-body">
      <ul class="tabs-nav">
        <li class="tabs-nav-item" @click="goToTab(tab, index)" v-for="(tab, index) in this.tabs"><a role="button" class="tabs-nav-link" :class="{ 'is-active': activeTabIndex === index }">{{ tab.title }}</a></li>
      </ul>
      <div class="tabs-content">
        <div role="tabpanel" class="tabs-content-item" v-for="(tab, index) in this.tabs" :class="{ 'is-active': activeTabIndex === index }">
          {{ tab.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .tabs-wrapper {
    padding: 15px;
  }

  .tabs-nav {
    border-bottom: 1px solid #ddd;
  }

  .tabs-nav>.tabs-nav-item {
    display: inline-block;
    position: relative;
    margin-bottom: -1px;
    z-index: 15;
  }

  .tabs-nav>.tabs-nav-item>.tabs-nav-link {
    font-size: 1.4em;
    display: block;
    padding: 0 12px 6px 12px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }

  .tabs-nav>.tabs-nav-item>.tabs-nav-link:hover {
    color: red;
  }

  .tabs-nav>.tabs-nav-item>.tabs-nav-link.is-active {
    color: red;
    border-bottom-color: red;
  }

  .tabs-content-item {
    display: none;
    margin-top: 15px;
    font-size: 1.4em;
  }

  .tabs-content-item.is-active {
    display: block;
  }
</style>