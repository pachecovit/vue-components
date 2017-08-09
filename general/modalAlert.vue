<script>
  export default {
    name: 'modalAlert',
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
        visible: true,
        is_open: true,
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
          'modalert-modal-overlay',
          'theme-' + this.overlayTheme,
          'modalert-modal-clickable',
          {
            'is-visible': this.visible,
            blocking: this.blocking
          }
        ]
      },

      modal_classes () {
        return [
          'modalert-modal',
          'theme-' + this.modalTheme,
          {
            'has-title': this.has_title,
            'has-tabs': this.has_tabs,
            'has-content': this.has_content,
            'has-icon': this.icon,
            'is-visible': this.visible,
            'modalert-alert': (this.icon && !this.has_tabs) || (!this.icon && !this.title && !this.$slots.title),
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
        if (!event.target.classList || event.target.classList.contains('modalert-modal-clickable')) {
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
          'modalert-modal-tab',

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
                '.modalert-modal-tip': [ 'animateSuccessTip' ],
                '.modalert-modal-long': [ 'animateSuccessLong' ]
              })
            }, 80)

            break

          case 'warning':
            this._applyClasses(this.$refs.icon_warning, {
              '': [ 'pulseWarning' ],
              '.modalert-modal-body': [ 'pulseWarningIns' ],
              '.modalert-modal-dot': [ 'pulseWarningIns' ]
            })

            break

          case 'error':
            setTimeout(() => {
              this._applyClasses(this.$refs.icon_error, {
                '': [ 'animateErrorIcon' ],
                '.modalert-modal-x-mark': [ 'animateXMark' ]
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
      <div class="modalert-box-actions">
        <!-- Custom Actions -->
        <slot name="box-action"></slot>

        <!-- Close Button -->
        <div class="modalert-action-close" v-on:click="close" v-if="!hideCloseButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#292c34" /></svg>
        </div>
      </div>

      <!-- Title: Housing the title and tabs, if no title is present -->
      <div class="modalert-title" v-if="has_title || has_tabs">
        <!-- Tabs but no title -->
        <template v-if="has_tabs && !has_title">
          <ul class="modalert-modal-tabs">
            <li v-for="tab in tabs" :class="_getClassesForTab(tab)">
              <a href="#" v-on:click.prevent="_changeTab(tab)">
                <div class="modalert-modal-valign">
                  <span v-if="tab.icon" v-html="tab.icon" class="modalert-modal-tab-icon" />
                  <span class="modalert-modal-tab-title">{{ tab.title }}</span>
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
      <ul class="modalert-modal-tabs" v-if="has_title && has_tabs">
        <li v-for="tab in tabs" :class="_getClassesForTab(tab)">
          <a href="#" v-on:click.prevent="_changeTab(tab)">
            <div class="modalert-modal-valign">
              <span v-if="tab.icon" v-html="tab.icon" class="modalert-modal-tab-icon" />
              <span class="modalert-modal-tab-title">{{ tab.title }}</span>
            </div>
          </a>
        </li>
      </ul>

      <!-- Content: Wrapper -->
      <div class="modalert-content" ref="content">
        <!-- Icon: Error -->
        <div class="modalert-modal-icon modalert-modal-error" v-if="icon == 'error'" ref="icon_error">
          <span class="modalert-modal-x-mark">
            <span class="modalert-modal-line modalert-modal-left"></span>
            <span class="modalert-modal-line modalert-modal-right"></span>
          </span>
        </div>

        <!-- Icon: Warning -->
        <div class="modalert-modal-icon modalert-modal-warning" v-if="icon == 'warning'" ref="icon_warning">
          <span class="modalert-modal-body"></span>
          <span class="modalert-modal-dot"></span>
        </div>

        <!-- Icon: Info -->
        <div class="modalert-modal-icon modalert-modal-info" v-if="icon == 'info'" ref="icon_info"></div>

        <!-- Icon: Success -->
        <div class="modalert-modal-icon modalert-modal-success" v-if="icon == 'success'" ref="icon_success">
          <span class="modalert-modal-line modalert-modal-tip"></span>
          <span class="modalert-modal-line modalert-modal-long"></span>
          <div class="modalert-modal-placeholder"></div>
          <div class="modalert-modal-fix"></div>
        </div>

        <!-- Actual Content -->
        <div class="modalert-content-content" v-if="$slots.default">
          <slot></slot>
        </div>
      </div>

      <!-- Buttons -->
      <div class="modalert-buttons" v-if="$slots.button">
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

  .modalert-modal-icon.modalert-modal-success.animate::after {
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

  .modalert-modal-icon {
    position: relative;
    width: 80px;
    height: 80px;
    border: 4px solid gray;
    border-radius: 50%;
    margin: auto;
    padding: 0;
    box-sizing: content-box;
  }

  .modalert-modal-icon.modalert-modal-error {
    border-color: #F44336;
  }

  .modalert-modal-icon.modalert-modal-error .modalert-modal-x-mark {
    position: relative;
    display: block;
  }

  .modalert-modal-icon.modalert-modal-error .modalert-modal-line {
    display: block;
    position: absolute;
    top: 37px;
    height: 5px;
    width: 47px;
    background-color: #F44336;
    border-radius: 2px;
  }

  .modalert-modal-icon.modalert-modal-error .modalert-modal-line.modalert-modal-left {
    transform: rotate(45deg);
    left: 17px;
  }

  .modalert-modal-icon.modalert-modal-error .modalert-modal-line.modalert-modal-right {
    transform: rotate(-45deg);
    right: 16px;
  }

  .modalert-modal-icon.modalert-modal-warning {
    border-color: #FF9800;
  }

  .modalert-modal-icon.modalert-modal-warning .modalert-modal-body {
    position: absolute;
    width: 5px;
    height: 47px;
    left: 50%;
    top: 10px;
    margin-left: -2px;
    border-radius: 2px;
    background-color: #FF9800;
  }

  .modalert-modal-icon.modalert-modal-warning .modalert-modal-dot {
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 7px;
    height: 7px;
    margin-left: -3px;
    border-radius: 50%;
    background-color: #FF9800;
  }

  .modalert-modal-icon.modalert-modal-info {
    border-color: #039BE5;
  }

  .modalert-modal-icon.modalert-modal-info::before {
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

  .modalert-modal-icon.modalert-modal-info::after {
    content: '';
    position: absolute;
    width: 7px;
    height: 7px;
    top: 19px;
    margin-left: -3px;
    border-radius: 50%;
    background-color: #039BE5;
  }

  .modalert-modal-icon.modalert-modal-success {
    border-color: #4CAF50;
  }

  .modalert-modal-icon.modalert-modal-success::before,
  .modalert-modal-icon.modalert-modal-success::after {
    content: '';
    position: absolute;
    border-radius: 40px;
    width: 60px;
    height: 120px;
    background: white;
    transform: rotate(45deg);
  }

  .modalert-modal-icon.modalert-modal-success::before {
    border-radius: 120px 0 0 120px;
    top: -7px;
    left: -33px;
    transform: rotate(-45deg);
    -webkit-transform-origin: 60px 60px;
    transform-origin: 60px 60px;
  }

  .modalert-modal-icon.modalert-modal-success::after {
    border-radius: 0 120px 120px 0;
    top: -11px;
    left: 30px;
    transform: rotate(-45deg);
    -webkit-transform-origin: 0px 60px;
    transform-origin: 0px 60px;
  }

  .modalert-modal-icon.modalert-modal-success .modalert-modal-placeholder {
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

  .modalert-modal-icon.modalert-modal-success .modalert-modal-fix {
    position: absolute;
    left: 28px;
    top: 8px;
    z-index: 1;
    width: 7px;
    height: 90px;
    background-color: white;
    transform: rotate(-45deg);
  }

  .modalert-modal-icon.modalert-modal-success .modalert-modal-line {
    display: block;
    position: absolute;
    z-index: 2;
    height: 5px;
    background-color: #4CAF50;
    border-radius: 2px;
  }

  .modalert-modal-icon.modalert-modal-success .modalert-modal-line.modalert-modal-tip {
    width: 25px;
    left: 14px;
    top: 46px;
    transform: rotate(45deg);
  }

  .modalert-modal-icon.modalert-modal-success .modalert-modal-line.modalert-modal-long {
    width: 47px;
    right: 8px;
    top: 38px;
    transform: rotate(-45deg);
  }

  .modalert-modal-icon.modalert-modal-custom {
    border-radius: 0;
    border: none;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .modalert-modal.theme-dark .modalert-modal-icon.modalert-modal-success::before,
  .modalert-modal.theme-dark .modalert-modal-icon.modalert-modal-success::after,
  .modalert-modal.theme-dark .modalert-modal-icon.modalert-modal-success .modalert-modal-fix {
    background-color: #182028;
  }

  .modalert-modal-overlay {
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

  .modalert-modal-overlay.theme-dark {
    background: rgba(24, 32, 40, 0.94);
  }

  .modalert-modal-overlay.is-visible {
    opacity: 1;
  }

  .modalert-modal {
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

  .modalert-modal .modalert-box-actions {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .modalert-modal .modalert-box-actions .modalert-action-close {
    display: inline-block;
    cursor: pointer;
    color: #222C38;
    text-align: center;
    width: 42px;
    height: 42px;
    line-height: 42px;
    border-radius: 50%;
  }

  .modalert-modal .modalert-box-actions .modalert-action-close svg {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-top: -2px;
  }

  .modalert-modal .modalert-box-actions .modalert-action-close svg path,
  .modalert-modal .modalert-box-actions .modalert-action-close svg polygon,
  .modalert-modal .modalert-box-actions .modalert-action-close svg rect,
  .modalert-modal .modalert-box-actions .modalert-action-close svg circle {
    fill: currentColor;
  }

  .modalert-modal .modalert-box-actions .modalert-action-close svg {
    fill: currentColor;
  }

  .modalert-modal .modalert-box-actions .modalert-action-close:hover {
    background: #039BE5;
    color: #fff;
  }

  .modalert-modal .modalert-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 64px;
    line-height: 64px;
    border-bottom: 1px solid #eaeaea;
    padding-left: 32px;
    padding-right: 64px;
  }

  .modalert-modal .modalert-title>h2 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0;
    font-weight: 500;
    font-size: 22px;
  }

  .modalert-modal ul.modalert-modal-tabs {
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

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab {
    display: block;
    height: 100%;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a {
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

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-title {
    display: block;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon {
    display: block;
    line-height: 1.0;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon svg,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon img {
    width: 16px;
    height: 16px;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon svg path,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon svg polygon,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon svg rect,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon svg circle,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon img path,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon img polygon,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon img rect,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon img circle {
    fill: currentColor;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon svg,
  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon img {
    fill: currentColor;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon+span.modalert-modal-tab-title {
    line-height: 1.0;
    margin-top: 8px;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab:first-child a {
    padding-left: 32px;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab.active a {
    font-weight: 600;
    color: #039BE5;
  }

  .modalert-modal ul.modalert-modal-tabs li.modalert-modal-tab.disabled a {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    cursor: default;
    pointer-events: none;
    color: #999;
  }

  .modalert-modal.has-tabs:not(.has-title) .modalert-title {
    height: 84px;
    line-height: 84px;
  }

  .modalert-modal.has-tabs.has-title ul.modalert-modal-tabs {
    width: 100%;
    height: 48px;
    margin: 0;
    border-bottom: 1px solid #eaeaea;
  }

  .modalert-modal.has-tabs.has-title ul.modalert-modal-tabs li.modalert-modal-tab a {
    margin-top: -4px;
  }

  .modalert-modal.has-tabs.has-title ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon {
    display: inline-block;
  }

  .modalert-modal.has-tabs.has-title ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon svg,
  .modalert-modal.has-tabs.has-title ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-icon img {
    vertical-align: middle;
    margin-top: -2px;
    margin-right: 8px;
  }

  .modalert-modal.has-tabs.has-title ul.modalert-modal-tabs li.modalert-modal-tab a span.modalert-modal-tab-title {
    display: inline-block;
  }

  .modalert-modal .modalert-content {
    display: flex;
    align-items: center;
    padding-left: 32px;
    padding-right: 32px;
    padding-top: 24px;
    padding-bottom: 24px;
    line-height: 1.5;
  }

  .modalert-modal .modalert-content .modalert-content-content {
    flex-grow: 1;
  }

  .modalert-modal .modalert-content .modalert-modal-tab:not(.active) {
    display: none;
  }

  .modalert-modal .modalert-content .modalert-modal-icon {
    margin-bottom: 36px;
  }

  .modalert-modal .modalert-buttons {
    text-align: right;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .modalert-modal .modalert-content+.modalert-buttons {
    border-top: 1px solid #eaeaea;
  }

  .modalert-modal.modalert-alert .modalert-content {
    display: block;
    text-align: center;
    font-size: 16px;
    padding-top: 64px;
    padding-bottom: 64px;
  }

  .modalert-modal.has-tabs.has-icon .modalert-content {
    padding-top: 32px;
    padding-bottom: 32px;
  }

  .modalert-modal.has-tabs.has-icon .modalert-content .modalert-content-content {
    padding-left: 32px;
  }

  .modalert-modal.has-tabs.has-icon .modalert-content .modalert-modal-icon {
    margin-bottom: 0;
  }

  .modalert-modal:not(.has-content) .modalert-modal-icon {
    margin-bottom: 0;
  }

  .modalert-modal.theme-dark {
    background: #182028;
    color: #fff;
  }

  .modalert-modal.theme-dark .modalert-box-actions .modalert-action-close {
    color: #fff;
  }

  .modalert-modal.theme-dark .modalert-title {
    border-bottom-color: #090c0f;
    box-shadow: 0px 1px 0px #273442;
  }

  .modalert-modal.theme-dark ul.modalert-modal-tabs li a {
    color: #fff;
  }

  .modalert-modal.theme-dark ul.modalert-modal-tabs li.active a {
    color: #039BE5;
  }

  .modalert-modal.theme-dark ul.modalert-modal-tabs li.disabled a {
    color: #3e5368;
  }

  .modalert-modal.theme-dark.has-tabs.has-title ul.modalert-modal-tabs {
    border-bottom-color: #090c0f;
    box-shadow: 0px 1px 0px #273442;
  }

  .modalert-modal.theme-dark .modalert-content+.modalert-buttons {
    border-top-color: #273442;
    box-shadow: 0px -1px 0px #090c0f;
  }

  .modalert-modal .modalert-buttons,
  .modalert-modal .modalert-content {
    opacity: 0;
    transition-property: transform, opacity;
    transition-duration: 0.3s;
    transition-delay: 0.09s;
    transition-timing-function: cubic-bezier(0.52, 0.02, 0.19, 1.02);
  }

  .modalert-modal .modalert-content {
    transform: translateY(-8px);
  }

  .modalert-modal .modalert-buttons {
    transform: translateY(16px);
  }

  .modalert-modal.is-visible {
    transform: translate(-50%, -50%);
    opacity: 1;
  }

  .modalert-modal.is-visible .modalert-buttons,
  .modalert-modal.is-visible .modalert-content {
    transform: none;
    opacity: 1;
  }

  .modalert-modal.bounce {
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
    .modalert-modal {
      width: 100%;
      height: 100vh;
      left: 0;
      top: 0;
      transform: scale(0.9);
    }
    .modalert-modal.is-visible {
      transform: none;
    }
    .modalert-modal .modalert-buttons {
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
</style>