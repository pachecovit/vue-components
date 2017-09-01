<script>
  export default {
    name: 'SelectField',
    components: { Icon },
    data () {
      return {
        isSelected: false,
        dropdownOpen: false,
        val: [],
        option: [],
      }
    },
    props: {
      value: {
        default: ''
      },
      label: {
        type: String,
        default: 'Select an item'
      },
      multiSelect: {
        type: Boolean,
        default: false
      },
      items: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    methods: {
      toggleDropdown () {
        this.valueShouldChange = false
        this.dropdownOpen = !this.dropdownOpen
      },
      updateValue (item) {
        if (this.multiSelect) {
          if (this.option.indexOf(item.option) >= 0) {
            this.option.splice(this.option.indexOf(item.option), 1)
          } else {
            this.val.push(item.val)
            this.option.push(item.option)
          }
          if (this.option.length === 0) {
            this.isSelected = false
          } else {
            this.isSelected = true
          }
        } else {
          this.isSelected = true
          this.val = item.val
          this.option = item.option
          this.toggleDropdown()
        }
        this.$emit('selectVal', this.val)
      },
      setItemClass (index) {
        if (!this.multiSelect) {
          this.items.forEach(function (obj) {
            obj.selected = false
          })
        }
        this.items[index].selected = !this.items[index].selected
      },
      outside: function (e) {
        if (this.dropdownOpen) {
          this.toggleDropdown()
        }
      }
    },
    created () {
      if (this.val != null && this.option != null) {
        for (var i = 0; i < this.items.length; i++) {
          for (var j = 0; j < this.val.length; j++) {
            if (this.items[i].val === this.val[j]) {
              this.items[i].selected = true
            }
          }
        }
      }
    },
    directives: {
      'click-outside': {
        bind: function (el, binding) {
          const bubble = binding.modifiers.bubble
          const handler = (e) => {
            if (bubble || (!el.contains(e.target) && el !== e.target)) {
              binding.value(e)
            }
          }
          el.__vueClickOutside__ = handler
          document.addEventListener('click', handler)
        }
      }
    }
  }
</script>

<template>
  <div :class="{ 'is-selected': isSelected }" v-click-outside="outside" v-on:keyup.27="outside">
    <label v-if="label">{{label}}</label>
    <div :class="{ 'is-multi-select': multiSelect }" v-if="multiSelect">
      <input @click="toggleDropdown()" cols="30" rows="10" v-model="option" readonly="readonly">
      <ul tabindex="-1" v-if="dropdownOpen">
        <li :class="{ 'selected': item.selected }" v-for="(item, index) in items" @click="updateValue(item), setItemClass(index)">{{ item.option }}</li>
      </ul>
    </div>
    <div v-else>
      <input @click="toggleDropdown()" cols="30" rows="10" v-model="option" readonly="readonly">
      <ul tabindex="-1" v-if="dropdownOpen">
        <li :class="{ 'selected': item.selected }" v-for="(item, index) in items" @click="updateValue(item), setItemClass(index)">{{ item.option }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
