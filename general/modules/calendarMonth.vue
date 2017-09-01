<script>
  import mixinCalendarMath from '@/components/general/modules/calendarMath.js'

  export default {
    name: 'schedule',
    mixins: [mixinCalendarMath],
    props: {
      showDate: {
        type: Date
      },
      locale: {
        type: String
      },
      monthNameFormat: {
        type: String,
        default () {
          return 'long'
        }
      },
      weekdayNameFormat: {
        type: String,
        default () {
          return 'short'
        }
      },
      disablePast: {
        default () {
          return false
        }
      },
      disableFuture: {
        default () {
          return false
        }
      },
      enableDragDrop: {
        default () {
          return false
        }
      },
      events: {
        type: Array,
        default () {
          return []
        }
      }
    },
    computed: {
      displayLocale () {
        return this.locale || this.getDefaultBrowserLocale()
      },
      displayDate () {
        return this.showDate || this.today
      },
      monthNames () {
        return this.getFormattedMonthNames(this.displayLocale, this.monthNameFormat)
      },
      weekdayNames () {
        return this.getFormattedWeekdayNames(this.displayLocale, this.weekdayNameFormat)
      },
      allowLastYearClick () {
        return !this.disablePast || (this.aYearBefore(this.displayDate) >= this.today)
      },
      allowNextYearClick () {
        return !this.disableFuture || (this.aYearAfter(this.displayDate) <= this.today)
      },
      allowLastMonthClick () {
        return !this.disablePast || (this.beginningOfMonth(this.displayDate) > this.today)
      },
      allowNextMonthClick () {
        return !this.disableFuture || (this.displayDate < this.beginningOfMonth(this.today))
      }
    },
    methods: {
      onClickDay (day) {
        if (this.disablePast && this.isInPast(day)) return
        this.$emit('clickDay', day)
      },
      onClickEvent (e, day) {
        this.$emit('clickEvent', e.details, day)
      },
      onClickPreviousYear () {
        this.$emit('setShowDate', this.aYearBefore(this.displayDate))
      },
      onClickPreviousMonth () {
        this.$emit('setShowDate', this.monthBefore(this.displayDate))
      },
      onClickNextMonth () {
        this.$emit('setShowDate', this.monthAfter(this.displayDate))
      },
      onClickNextYear () {
        this.$emit('setShowDate', this.aYearAfter(this.displayDate))
      },
      onClickCurrentMonth () {
        this.$emit('setShowDate', this.beginningOfMonth(this.today))
      },
      onDragStart (calendarEvent, windowEvent) {
        if (!this.enableDragDrop) return false

        windowEvent.dataTransfer.setData('Text', calendarEvent.details.id)
        this.$emit('dragEventStart', calendarEvent.details.id, calendarEvent)
        return true
      },
      handleEvent (windowEvent, bubbleEventName, bubbleParam) {
        if (!this.enableDragDrop) return false

        const calendarEventId = windowEvent.dataTransfer.getData('Text')
        this.$emit(bubbleEventName, calendarEventId, bubbleParam)
        return true
      },
      onDragOver (day, windowEvent) {
        this.handleEvent(windowEvent, 'dragEventDragOverDate', day)
      },
      onDragEnter (day, windowEvent) {
        if (!this.handleEvent(windowEvent, 'dragEventEnterDate', day)) return
        windowEvent.target.classList.add('draghover')
      },
      onDragLeave (day, windowEvent) {
        if (!this.handleEvent(windowEvent, 'dragEventLeaveDate', day)) return
        windowEvent.target.classList.remove('draghover')
      },
      onDrop (day, windowEvent) {
        if (!this.handleEvent(windowEvent, 'dropEventOnDate', day)) return
        windowEvent.target.classList.remove('draghover')
      },
      findAndSortEventsInWeek (weekStart) {
        const events = this.events.filter(event =>
          event.startDate < this.addDays(weekStart, 7) && (!event.endDate || event.endDate >= weekStart)
          , this).sort((a, b) => {
            if (a.startDate < b.startDate) return -1
            if (b.startDate < a.startDate) return 1
            if (a.endDate > b.endDate) return -1
            if (b.endDate > a.endDate) return 1
            return a.id < b.id ? -1 : 1
          })
        return events
      },

      getWeekEvents (weekStart) {
        const events = this.findAndSortEventsInWeek(weekStart)
        const results = []
        const slots = [[], [], [], [], [], [], [], [], [], []]
        for (let i = 0; i < events.length; i++) {
          const e = {
            startDate: events[i].startDate,
            endDate: events[i].endDate || events[i].startDate,
            title: events[i].title || 'Untitled',
            id: events[i].id || ('e' + Math.random().toString(36).substr(2, 10)),
            url: events[i].url,
            classes: events[i].classes
          }
          const ep = { details: e, slot: 0 }
          const continued = e.startDate < weekStart
          const startOffset = continued ? 0 : this.dayDiff(weekStart, e.startDate)
          const toBeContinued = this.dayDiff(weekStart, e.endDate) > 7
          const span = Math.min(
            7 - startOffset,
            this.dayDiff(this.addDays(weekStart, startOffset), e.endDate) + 1)
          for (let d = 0; d < 7; d++) {
            if (d === startOffset) {
              for (let s = 0; s < 10; s++) {
                if (!slots[d][s]) {
                  ep.slot = s
                  slots[d][s] = true
                  break
                }
              }
            } else if (d < startOffset + span) {
              slots[d][ep.slot] = true
            }
          }
          ep.classes = [
            `offset${startOffset}`,
            `span${span}`,
            `slot${ep.slot + 1}`,
            {
              continued,
              toBeContinued,
              hasUrl: ep.details.url
            }
          ]
          if (e.classes) ep.classes = ep.classes.concat(e.classes)
          results.push(ep)
        }
        return results
      }
    }
  }
</script>

<template>
  <div class="calendar-month" :class="[
      'locale-' + languageCode(displayLocale),
      'locale-' + displayLocale,
      'y' + displayDate.getFullYear(),
      'm' + paddedMonth(displayDate),
      {
        past:   isPastMonth(displayDate),
        future:   isFutureMonth(displayDate),
        noIntl:   !supportsIntl,
      }]">
    <div class="header">
      <div class="previousMonth">
        <button @click="onClickPreviousMonth" :disabled="!allowLastMonthClick"></button>
      </div>
      <div class="nextMonth">
        <button @click="onClickNextMonth" :disabled="!allowNextMonthClick"></button>
      </div>
      <div class="thisMonth">
        <div class="monthLabel">
          <span class="monthName">{{ monthNames[displayDate.getMonth()] }}</span>
          <span class="yearNumber">{{ displayDate.getFullYear() }}</span>
        </div>
        <div v-if="!isSameMonth(today, displayDate)" class="currentMonth">
          <button @click="onClickCurrentMonth"></button>
        </div>
      </div>
      <div class="previousYear">
        <button @click="onClickPreviousYear" :disabled="!allowLastYearClick"></button>
      </div>
      <div class="nextYear">
        <button @click="onClickNextYear" :disabled="!allowNextYearClick"></button>
      </div>
    </div>
    <div class="dayList">
      <div v-for="(w, index) in weekdayNames" class="day" :key="index" :class="'dow'+index">{{ w }}</div>
    </div>
    <div class="month">
      <div v-for="(weekStart, weekIndex) in weeksOfMonth(displayDate)" class="week" :key="weekIndex" :class="['week' + (weekIndex+1), 'ws' + isoYearMonthDay(weekStart)]">
        <div v-for="day in daysOfWeek(weekStart)" class="day" :key="day.id" :class="[
              'dow' + day.getDay(),
              'd' + isoYearMonthDay(day),
              'd' + isoMonthDay(day),
              'd' + paddedDay(day),
              'instance' + instanceOfMonth(day),
              {
                outsideOfMonth  : day.getMonth() != displayDate.getMonth(),
                today     : isSameDate(day, today),
                past      : isInPast(day),
                future      : isInFuture(day),
                last      : isLastDayOfMonth(day),
                lastInstance  : isLastInstanceOfMonth(day),
              }
            ]" @click="onClickDay(day)" @drop.prevent="onDrop(day, $event)" @dragover.prevent="onDragOver(day, $event)" @dragenter.prevent="onDragEnter(day, $event)" @dragleave.prevent="onDragLeave(day, $event)">
          <div class="content">
            <div class="date">{{ day.getDate() }}</div>
          </div>
        </div>
        <div v-for="e in getWeekEvents(weekStart)" class="event" :key="e.id" :draggable="enableDragDrop" :class="e.classes" :title="e.details.title" @dragstart="onDragStart(e, $event)" @click.stop="onClickEvent(e)" v-html="e.details.title"></div>
      </div>
    </div>
  </div>
</template>

<style src="../../../assets/themes/default/Schedule.css"></style>