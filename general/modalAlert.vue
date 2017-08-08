<script>
  export default {
    name: 'feedBack',
    props: {
      title: {
        type: String,
        required: false,
        default: ''
      },

      overlayTheme: {
        type: String,
        required: false,
        default: 'light'
      },

      modalTheme: {
        type: String,
        required: false,
        default: 'light'
      },

      blocking: {
        type: Boolean,
        required: false,
        default: false
      },

      pulseOnBlock: {
        type: Boolean,
        required: false,
        default: true
      },

      icon: {
        type: String,
        required: false,
        default: ''
      },

      hideCloseButton: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    mounted () {
      this.tabs = this.$children.filter(c => c.cmpName && c.cmpName === 'tab')

      if (this.has_tabs) {
        this.currentTab = this._changeTab(this.tabs[0])
      }

      document.addEventListener('keyup', this._onDocumentKeyup)
    },

    beforeDestroy () {
      document.removeEventListener('keyup', this._onDocumentKeyup)
    },

    data () {
      return {
        visible: false,
        is_open: false,
        is_bouncing: false,
        tabs: [],

        backups: {
          body: {
            height: null,
            overflow: null
          }
        }
      }
    },

    computed: {
      has_title () {
        return this.title || this.$slots.title
      },

      has_tabs () {
        return this.tabs.length > 0
      },

      has_content () {
        return this.$slots.default
      },

      current_tab () {
        return this.tabs.filter(t => t.active === true)[0]
      },

      overlay_classes () {
        return [
          'simple-modal-overlay',
          'theme-' + this.overlayTheme,
          'simple-modal-clickable',
          {
            'is-visible': this.visible,
            blocking: this.blocking
          }
        ]
      },

      modal_classes () {
        return [
          'simple-modal',
          'theme-' + this.modalTheme,
          {
            'has-title': this.has_title,
            'has-tabs': this.has_tabs,
            'has-content': this.has_content,
            'has-icon': this.icon,
            'is-visible': this.visible,
            'simple-alert': (this.icon && !this.has_tabs) || (!this.icon && !this.title && !this.$slots.title),
            bounce: this.is_bouncing
          }
        ]
      }
    },

    methods: {
      open (tabId = null) {
        if (tabId && this.has_tabs) {
          // Find tab with wanted id.
          let openingTabs = this.tabs.filter((tab) => { return tab.id === tabId })
          if (openingTabs.length > 0) {
            // Set current tab to first match.
            this.currentTab = this._changeTab(openingTabs[0])
          } else {
            // Try opening index instead of id as an alternative.
            let openingTab = this.tabs[tabId]
            if (openingTab) {
              this.currentTab = this._changeTab(openingTab)
            }
          }
        }

        this.is_open = true
        this._lockBody()
        this._animateIcon()

        setTimeout(() => (this.visible = true), 30)
        this.$emit('open')
      },
      close () {
        this.visible = false
        this._unlockBody()

        setTimeout(() => (this.is_open = false), 300)
        this.$emit('close')
      },
      bounce () {
        this.is_bouncing = true

        setTimeout(() => (this.is_bouncing = false), 330)
      },
      _lockBody () {
        this.backups.body.height = document.body.style.height
        this.backups.body.overflow = document.body.style.overflow

        document.body.style.height = '100%'
        document.body.style.overflow = 'hidden'
      },
      _unlockBody () {
        document.body.style.height = this.backups.body.height
        document.body.style.overflow = this.backups.body.overflow
      },
      _onOverlayClick (event) {
        if (!event.target.classList || event.target.classList.contains('simple-modal-clickable')) {
          if (this.blocking) {
            if (this.pulseOnBlock) this.bounce()
          } else {
            this.close()
          }
        }
      },
      _onDocumentKeyup (event) {
        if (event.keyCode === 27) {
          if (this.blocking) {
            if (this.pulseOnBlock) this.bounce()
          } else {
            this.close()
          }
        }
      },
      _changeTab (tab) {
        this.tabs.map(t => (t.active = t === tab))
        this.currentTab = tab
      },
      _getClassesForTab (tab) {
        return [
          'simple-modal-tab',

          {
            active: tab.active,
            disabled: tab.disabled
          }
        ]
      },

      _animateIcon () {
        if (!this.icon) return

        switch (this.icon) {
          case 'success':
            setTimeout(() => {
              this._applyClasses(this.$refs.icon_success, {
                '': [ 'animate' ],
                '.simple-modal-tip': [ 'animateSuccessTip' ],
                '.simple-modal-long': [ 'animateSuccessLong' ]
              })
            }, 80)

            break

          case 'warning':
            this._applyClasses(this.$refs.icon_warning, {
              '': [ 'pulseWarning' ],
              '.simple-modal-body': [ 'pulseWarningIns' ],
              '.simple-modal-dot': [ 'pulseWarningIns' ]
            })

            break

          case 'error':
            setTimeout(() => {
              this._applyClasses(this.$refs.icon_error, {
                '': [ 'animateErrorIcon' ],
                '.simple-modal-x-mark': [ 'animateXMark' ]
              })
            }, 80)

            break
        }
      },
      _applyClasses ($ref, classMap) {
        for (let cl in classMap) {
          let classes = classMap[cl]
          let $el

          if (cl === '') {
            $el = $ref
          } else {
            $el = $ref.querySelector(cl)
          }

          $el.classList.remove(...classes)
          $el.classList.add(...classes)
        }
      }
    }
  }
</script>

<template>
  <div :class="overlay_classes" v-show="is_open" v-on:click="_onOverlayClick">
    <div :class="modal_classes">
      <div class="simple-box-actions">
        <!-- Custom Actions -->
        <slot name="box-action"></slot>

        <!-- Close Button -->
        <div class="simple-action-close" v-on:click="close" v-if="!hideCloseButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#292c34" /></svg>
        </div>
      </div>

      <!-- Title: Housing the title and tabs, if no title is present -->
      <div class="simple-title" v-if="has_title || has_tabs">
        <!-- Tabs but no title -->
        <template v-if="has_tabs && !has_title">
          <ul class="simple-modal-tabs">
            <li v-for="tab in tabs" :class="_getClassesForTab(tab)">
              <a href="#" v-on:click.prevent="_changeTab(tab)">
                <div class="simple-modal-valign">
                  <span v-if="tab.icon" v-html="tab.icon" class="simple-modal-tab-icon" />
                  <span class="simple-modal-tab-title">{{ tab.title }}</span>
                </div>
              </a>
            </li>
          </ul>
        </template>

        <!-- Title -->
        <template v-if="has_title">
          <h2 v-if="title" v-html="title"></h2>
          <slot name="title"></slot>
        </template>
      </div>

      <!-- Tabs: If title AND tabs are present -->
      <ul class="simple-modal-tabs" v-if="has_title && has_tabs">
        <li v-for="tab in tabs" :class="_getClassesForTab(tab)">
          <a href="#" v-on:click.prevent="_changeTab(tab)">
            <div class="simple-modal-valign">
              <span v-if="tab.icon" v-html="tab.icon" class="simple-modal-tab-icon" />
              <span class="simple-modal-tab-title">{{ tab.title }}</span>
            </div>
          </a>
        </li>
      </ul>

      <!-- Content: Wrapper -->
      <div class="simple-content" ref="content">
        <!-- Icon: Error -->
        <div class="simple-modal-icon simple-modal-error" v-if="icon == 'error'" ref="icon_error">
          <span class="simple-modal-x-mark">
            <span class="simple-modal-line simple-modal-left"></span>
            <span class="simple-modal-line simple-modal-right"></span>
          </span>
        </div>

        <!-- Icon: Warning -->
        <div class="simple-modal-icon simple-modal-warning" v-if="icon == 'warning'" ref="icon_warning">
          <span class="simple-modal-body"></span>
          <span class="simple-modal-dot"></span>
        </div>

        <!-- Icon: Info -->
        <div class="simple-modal-icon simple-modal-info" v-if="icon == 'info'" ref="icon_info"></div>

        <!-- Icon: Success -->
        <div class="simple-modal-icon simple-modal-success" v-if="icon == 'success'" ref="icon_success">
          <span class="simple-modal-line simple-modal-tip"></span>
          <span class="simple-modal-line simple-modal-long"></span>
          <div class="simple-modal-placeholder"></div>
          <div class="simple-modal-fix"></div>
        </div>

        <!-- Actual Content -->
        <div class="simple-content-content" v-if="$slots.default">
          <slot></slot>
        </div>
      </div>

      <!-- Buttons -->
      <div class="simple-buttons" v-if="$slots.button">
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<style>
  @keyframes animateSuccessTip {
    0% {
      width: 0;
      left: 1px;
      top: 19px;
    }
    54% {
      width: 0;
      left: 1px;
      top: 19px;
    }
    70% {
      width: 50px;
      left: -8px;
      top: 37px;
    }
    84% {
      width: 17px;
      left: 21px;
      top: 48px;
    }
    100% {
      width: 25px;
      left: 14px;
      top: 45px;
    }
  }

  @keyframes animateSuccessLong {
    0% {
      width: 0;
      right: 46px;
      top: 54px;
    }
    65% {
      width: 0;
      right: 46px;
      top: 54px;
    }
    84% {
      width: 55px;
      right: 0px;
      top: 35px;
    }
    100% {
      width: 47px;
      right: 8px;
      top: 38px;
    }
  }

  @keyframes rotatePlaceholder {
    0% {
      transform: rotate(-45deg);
    }
    5% {
      transform: rotate(-45deg);
    }
    12% {
      transform: rotate(-405deg);
    }
    100% {
      transform: rotate(-405deg);
    }
  }

  .animateSuccessTip {
    animation: animateSuccessTip 0.75s;
  }

  .animateSuccessLong {
    animation: animateSuccessLong 0.75s;
  }

  .simple-modal-icon.simple-modal-success.animate::after {
    animation: rotatePlaceholder 4.25s ease-in;
  }

  @keyframes animateErrorIcon {
    0% {
      transform: rotateX(100deg);
      opacity: 0;
    }
    100% {
      transform: rotateX(0deg);
      opacity: 1;
    }
  }

  .animateErrorIcon {
    animation: animateErrorIcon 0.5s;
  }

  @keyframes animateXMark {
    0% {
      transform: scale(0.4);
      margin-top: 26px;
      opacity: 0;
    }
    50% {
      transform: scale(0.4);
      margin-top: 26px;
      opacity: 0;
    }
    80% {
      transform: scale(1.15);
      margin-top: -6px;
    }
    100% {
      transform: scale(1);
      margin-top: 0;
      opacity: 1;
    }
  }

  .animateXMark {
    animation: animateXMark 0.5s;
  }

  @keyframes pulseWarning {
    0% {
      border-color: #F8D486;
    }
    100% {
      border-color: #F8BB86;
    }
  }

  .pulseWarning {
    animation: pulseWarning 0.75s infinite alternate;
  }

  @keyframes pulseWarningIns {
    0% {
      background-color: #F8D486;
    }
    100% {
      background-color: #F8BB86;
    }
  }

  .pulseWarningIns {
    animation: pulseWarningIns 0.75s infinite alternate;
  }

  @keyframes rotate-loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .simple-modal-icon {
    position: relative;
    width: 80px;
    height: 80px;
    border: 4px solid gray;
    border-radius: 50%;
    margin: auto;
    padding: 0;
    box-sizing: content-box;
  }

  .simple-modal-icon.simple-modal-error {
    border-color: #F44336;
  }

  .simple-modal-icon.simple-modal-error .simple-modal-x-mark {
    position: relative;
    display: block;
  }

  .simple-modal-icon.simple-modal-error .simple-modal-line {
    display: block;
    position: absolute;
    top: 37px;
    height: 5px;
    width: 47px;
    background-color: #F44336;
    border-radius: 2px;
  }

  .simple-modal-icon.simple-modal-error .simple-modal-line.simple-modal-left {
    transform: rotate(45deg);
    left: 17px;
  }

  .simple-modal-icon.simple-modal-error .simple-modal-line.simple-modal-right {
    transform: rotate(-45deg);
    right: 16px;
  }

  .simple-modal-icon.simple-modal-warning {
    border-color: #FF9800;
  }

  .simple-modal-icon.simple-modal-warning .simple-modal-body {
    position: absolute;
    width: 5px;
    height: 47px;
    left: 50%;
    top: 10px;
    margin-left: -2px;
    border-radius: 2px;
    background-color: #FF9800;
  }

  .simple-modal-icon.simple-modal-warning .simple-modal-dot {
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 7px;
    height: 7px;
    margin-left: -3px;
    border-radius: 50%;
    background-color: #FF9800;
  }

  .simple-modal-icon.simple-modal-info {
    border-color: #039BE5;
  }

  .simple-modal-icon.simple-modal-info::before {
    content: '';
    position: absolute;
    width: 5px;
    height: 29px;
    left: 50%;
    bottom: 17px;
    margin-left: -2px;
    border-radius: 2px;
    background-color: #039BE5;
  }

  .simple-modal-icon.simple-modal-info::after {
    content: '';
    position: absolute;
    width: 7px;
    height: 7px;
    top: 19px;
    margin-left: -3px;
    border-radius: 50%;
    background-color: #039BE5;
  }

  .simple-modal-icon.simple-modal-success {
    border-color: #4CAF50;
  }

  .simple-modal-icon.simple-modal-success::before,
  .simple-modal-icon.simple-modal-success::after {
    content: '';
    position: absolute;
    border-radius: 40px;
    width: 60px;
    height: 120px;
    background: white;
    transform: rotate(45deg);
  }

  .simple-modal-icon.simple-modal-success::before {
    border-radius: 120px 0 0 120px;
    top: -7px;
    left: -33px;
    transform: rotate(-45deg);
    -webkit-transform-origin: 60px 60px;
    transform-origin: 60px 60px;
  }

  .simple-modal-icon.simple-modal-success::after {
    border-radius: 0 120px 120px 0;
    top: -11px;
    left: 30px;
    transform: rotate(-45deg);
    -webkit-transform-origin: 0px 60px;
    transform-origin: 0px 60px;
  }

  .simple-modal-icon.simple-modal-success .simple-modal-placeholder {
    box-sizing: content-box;
    position: absolute;
    left: -4px;
    top: -4px;
    z-index: 2;
    width: 80px;
    height: 80px;
    border: 4px solid rgba(76, 175, 80, 0.2);
    border-radius: 50%;
  }

  .simple-modal-icon.simple-modal-success .simple-modal-fix {
    position: absolute;
    left: 28px;
    top: 8px;
    z-index: 1;
    width: 7px;
    height: 90px;
    background-color: white;
    transform: rotate(-45deg);
  }

  .simple-modal-icon.simple-modal-success .simple-modal-line {
    display: block;
    position: absolute;
    z-index: 2;
    height: 5px;
    background-color: #4CAF50;
    border-radius: 2px;
  }

  .simple-modal-icon.simple-modal-success .simple-modal-line.simple-modal-tip {
    width: 25px;
    left: 14px;
    top: 46px;
    transform: rotate(45deg);
  }

  .simple-modal-icon.simple-modal-success .simple-modal-line.simple-modal-long {
    width: 47px;
    right: 8px;
    top: 38px;
    transform: rotate(-45deg);
  }

  .simple-modal-icon.simple-modal-custom {
    border-radius: 0;
    border: none;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .simple-modal.theme-dark .simple-modal-icon.simple-modal-success::before,
  .simple-modal.theme-dark .simple-modal-icon.simple-modal-success::after,
  .simple-modal.theme-dark .simple-modal-icon.simple-modal-success .simple-modal-fix {
    background-color: #182028;
  }

  .simple-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9001;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    background: rgba(255, 255, 255, 0.9);
    opacity: 0;
    transition: opacity 0.3s;
    transform: translate3D(0, 0, 0);
    -webkit-perspective: 500px;
  }

  .simple-modal-overlay.theme-dark {
    background: rgba(24, 32, 40, 0.94);
  }

  .simple-modal-overlay.is-visible {
    opacity: 1;
  }

  .simple-modal {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0px 8px 46px rgba(0, 0, 0, 0.08), 0px 2px 6px rgba(0, 0, 0, 0.03);
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    max-width: 640px;
    max-height: 100vh;
    overflow-y: auto;
    border-radius: 2px;
    transform: scale(0.9) translate(calc(-50% - 32px), -50%);
    opacity: 0;
    transition-property: transform, opacity;
    transition-duration: 0.3s;
    transition-delay: 0.05s;
    transition-timing-function: cubic-bezier(0.52, 0.02, 0.19, 1.02);
  }

  .simple-modal .simple-box-actions {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .simple-modal .simple-box-actions .simple-action-close {
    display: inline-block;
    cursor: pointer;
    color: #222C38;
    text-align: center;
    width: 42px;
    height: 42px;
    line-height: 42px;
    border-radius: 50%;
  }

  .simple-modal .simple-box-actions .simple-action-close svg {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-top: -2px;
  }

  .simple-modal .simple-box-actions .simple-action-close svg path,
  .simple-modal .simple-box-actions .simple-action-close svg polygon,
  .simple-modal .simple-box-actions .simple-action-close svg rect,
  .simple-modal .simple-box-actions .simple-action-close svg circle {
    fill: currentColor;
  }

  .simple-modal .simple-box-actions .simple-action-close svg {
    fill: currentColor;
  }

  .simple-modal .simple-box-actions .simple-action-close:hover {
    background: #039BE5;
    color: #fff;
  }

  .simple-modal .simple-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 64px;
    line-height: 64px;
    border-bottom: 1px solid #eaeaea;
    padding-left: 32px;
    padding-right: 64px;
  }

  .simple-modal .simple-title>h2 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0;
    font-weight: 500;
    font-size: 22px;
  }

  .simple-modal ul.simple-modal-tabs {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    align-items: center;
    width: calc(100% + 32px);
    height: 100%;
    margin-left: -32px;
    overflow-x: auto;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab {
    display: block;
    height: 100%;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    color: #222C38;
    text-decoration: none;
    text-align: center;
    height: 100%;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-title {
    display: block;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon {
    display: block;
    line-height: 1.0;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon svg,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon img {
    width: 16px;
    height: 16px;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon svg path,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon svg polygon,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon svg rect,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon svg circle,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon img path,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon img polygon,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon img rect,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon img circle {
    fill: currentColor;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon svg,
  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon img {
    fill: currentColor;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon+span.simple-modal-tab-title {
    line-height: 1.0;
    margin-top: 8px;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab:first-child a {
    padding-left: 32px;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab.active a {
    font-weight: 600;
    color: #039BE5;
  }

  .simple-modal ul.simple-modal-tabs li.simple-modal-tab.disabled a {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    cursor: default;
    pointer-events: none;
    color: #999;
  }

  .simple-modal.has-tabs:not(.has-title) .simple-title {
    height: 84px;
    line-height: 84px;
  }

  .simple-modal.has-tabs.has-title ul.simple-modal-tabs {
    width: 100%;
    height: 48px;
    margin: 0;
    border-bottom: 1px solid #eaeaea;
  }

  .simple-modal.has-tabs.has-title ul.simple-modal-tabs li.simple-modal-tab a {
    margin-top: -4px;
  }

  .simple-modal.has-tabs.has-title ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon {
    display: inline-block;
  }

  .simple-modal.has-tabs.has-title ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon svg,
  .simple-modal.has-tabs.has-title ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-icon img {
    vertical-align: middle;
    margin-top: -2px;
    margin-right: 8px;
  }

  .simple-modal.has-tabs.has-title ul.simple-modal-tabs li.simple-modal-tab a span.simple-modal-tab-title {
    display: inline-block;
  }

  .simple-modal .simple-content {
    display: flex;
    align-items: center;
    padding-left: 32px;
    padding-right: 32px;
    padding-top: 24px;
    padding-bottom: 24px;
    line-height: 1.5;
  }

  .simple-modal .simple-content .simple-content-content {
    flex-grow: 1;
  }

  .simple-modal .simple-content .simple-modal-tab:not(.active) {
    display: none;
  }

  .simple-modal .simple-content .simple-modal-icon {
    margin-bottom: 36px;
  }

  .simple-modal .simple-buttons {
    text-align: right;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .simple-modal .simple-content+.simple-buttons {
    border-top: 1px solid #eaeaea;
  }

  .simple-modal.simple-alert .simple-content {
    display: block;
    text-align: center;
    font-size: 16px;
    padding-top: 64px;
    padding-bottom: 64px;
  }

  .simple-modal.has-tabs.has-icon .simple-content {
    padding-top: 32px;
    padding-bottom: 32px;
  }

  .simple-modal.has-tabs.has-icon .simple-content .simple-content-content {
    padding-left: 32px;
  }

  .simple-modal.has-tabs.has-icon .simple-content .simple-modal-icon {
    margin-bottom: 0;
  }

  .simple-modal:not(.has-content) .simple-modal-icon {
    margin-bottom: 0;
  }

  .simple-modal.theme-dark {
    background: #182028;
    color: #fff;
  }

  .simple-modal.theme-dark .simple-box-actions .simple-action-close {
    color: #fff;
  }

  .simple-modal.theme-dark .simple-title {
    border-bottom-color: #090c0f;
    box-shadow: 0px 1px 0px #273442;
  }

  .simple-modal.theme-dark ul.simple-modal-tabs li a {
    color: #fff;
  }

  .simple-modal.theme-dark ul.simple-modal-tabs li.active a {
    color: #039BE5;
  }

  .simple-modal.theme-dark ul.simple-modal-tabs li.disabled a {
    color: #3e5368;
  }

  .simple-modal.theme-dark.has-tabs.has-title ul.simple-modal-tabs {
    border-bottom-color: #090c0f;
    box-shadow: 0px 1px 0px #273442;
  }

  .simple-modal.theme-dark .simple-content+.simple-buttons {
    border-top-color: #273442;
    box-shadow: 0px -1px 0px #090c0f;
  }

  .simple-modal .simple-buttons,
  .simple-modal .simple-content {
    opacity: 0;
    transition-property: transform, opacity;
    transition-duration: 0.3s;
    transition-delay: 0.09s;
    transition-timing-function: cubic-bezier(0.52, 0.02, 0.19, 1.02);
  }

  .simple-modal .simple-content {
    transform: translateY(-8px);
  }

  .simple-modal .simple-buttons {
    transform: translateY(16px);
  }

  .simple-modal.is-visible {
    transform: translate(-50%, -50%);
    opacity: 1;
  }

  .simple-modal.is-visible .simple-buttons,
  .simple-modal.is-visible .simple-content {
    transform: none;
    opacity: 1;
  }

  .simple-modal.bounce {
    animation-name: bounce;
    animation-duration: 0.3s;
    animation-iteration-count: 2;
    animation-direction: alternate;
  }

  @media screen and (min-width: 601px) {
    @keyframes bounce {
      0% {
        transform: scale(1) translate(-50%, -50%);
      }
      50% {
        transform: scale(1.02) translate(calc(-50% + 8px), -50%);
      }
      100% {
        transform: scale(1) translate(-50%, -50%);
      }
    }
  }

  @media screen and (max-width: 600px) {
    .simple-modal {
      width: 100%;
      height: 100vh;
      left: 0;
      top: 0;
      transform: scale(0.9);
    }
    .simple-modal.is-visible {
      transform: none;
    }
    .simple-modal .simple-buttons {
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
</style>