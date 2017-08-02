<script>
  export default {
    name: 'inputTextArea',
    data () {
      return {
        isFocused: false,
        objectStyle: {
          height: 'auto'
        }
      }
    },
    props: {
      placeholder: String,
      label: String,
      disabled: Boolean,
      readonly: Boolean,
      value: null,
      rows: {
        type: Number,
        default: 6
      },
      maxRows: {
        type: Number,
        default: null
      },
      type: String
    }
  }
</script>

<template>
  <div>
    <textarea
      spellcheck="false"
      :style="objectStyle"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :value="value"
      @input="updateValue($event.target.value)"
    </textarea>
  </div>
</template>

<style scoped>
  
</style>
