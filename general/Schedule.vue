<template>
  <div id="calendar">
    <button @click="clickTestAddEvent" :disabled="alreadyAdded">Add Event on 22nd-23rd</button>
    <calendar-month
      class="holiday-us-traditional holiday-us-official"
      :show-date="showDate"
      @clickDay="onClickDay"
      @clickEvent="onClickEvent"
      @setShowDate="setShowDate"
      enable-drag-drop=true
      @dropEventOnDate="onDrop"
      :events="events">
    </calendar-month>
  </div>
</template>

<script>
  import CalendarMonth from '@/general/modules/calendarMonth.vue'
  import CalendarMath from '@/general/modules/calendarMath.js'

  export default {
    name: 'calendar',
    components: {
      CalendarMonth
    },
    data () {
      return {
        showDate: this.thisMonth(1),
        message: 'Click a date or event...',
        events: [
          { id: 'e1', startDate: this.thisMonth(15), endDate: this.thisMonth(15), title: 'Single-day event with a long title' },
          { id: 'e2', startDate: this.thisMonth(7), endDate: this.thisMonth(10), title: 'Multi-day event with a long title' },
          { id: 'e3', startDate: this.thisMonth(20), endDate: this.thisMonth(20), title: 'My Birthday!', classes: 'birthday', url: 'https://en.wikipedia.org/wiki/Birthday' },
          { id: 'e4', startDate: this.thisMonth(5), endDate: this.thisMonth(12), title: 'Multi-day event', classes: 'purple' },
          { id: 'e5', startDate: this.thisMonth(29), endDate: this.thisMonth(29), title: 'Same day 1' },
          { id: 'e6', startDate: this.thisMonth(29), endDate: this.thisMonth(29), title: 'Same day 2', classes: 'orange' },
          { id: 'e7', startDate: this.thisMonth(29), endDate: this.thisMonth(29), title: 'Same day 3' },
          { id: 'e8', startDate: this.thisMonth(29), endDate: this.thisMonth(29), title: 'Same day 4', classes: 'orange' },
          { id: 'e9', startDate: this.thisMonth(29), endDate: this.thisMonth(29), title: 'Same day 5' },
          { id: 'e10', startDate: this.thisMonth(29), endDate: this.thisMonth(29), title: 'Same day 6', classes: 'orange' },
          { id: 'e11', startDate: this.thisMonth(29), endDate: this.thisMonth(29), title: 'Same day 7' }
        ]
      }
    },
    methods: {
      thisMonth: (d) => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), d) },
      onClickDay (d) { this.message = `You clicked: ${d.toLocaleDateString()}` },
      onClickEvent (e) { this.message = `You clicked: ${e.title}` },
      setShowDate (d) {
        this.message = `Changing calendar view to ${d.toLocaleDateString()}`
        this.showDate = d
      },
      onDrop (event, date) {
        this.message = `You dropped ${event} on ${date.toLocaleDateString()}`
        const e = this.events.filter(ev => ev.id === event)[0]
        const eLength = CalendarMath.methods.dayDiff(e.startDate, e.endDate)
        e.startDate = date
        e.endDate = CalendarMath.methods.addDays(date, eLength)
      },
      clickTestAddEvent () {
        if (this.alreadyAdded) return
        this.alreadyAdded = true
        this.events.push({ id: 'e12', startDate: this.thisMonth(22), endDate: this.thisMonth(23), title: 'New Event' })
      }
    }
  }
</script>

<style scoped>
  .calendar-month {
    width: 100%;
    max-width: 1200px;
    font-family: "Open Sans", sans-serif;
    margin: 100px auto;
  }

  .calendar-month .month,
  .calendar-month .header,
  .calendar-month .week,
  .calendar-month .dayList {
    width: 100%;
    display: inline-block;
  }

  .calendar-month .header .thisMonth {
    font-size: 1.2em;
    text-transform: uppercase;
  }

  .calendar-month .month {
    overflow: hidden;
  }

  .calendar-month .week {
    position: relative;
    width: 100%;
  }

  .calendar-month .day {
    position: relative;
    width: 14.285714%;
    background-color: #fff;
  }

  .calendar-month .week .day:before {
    content: "";
    display: block;
    padding-top: 85%;
  }

  .calendar-month .day .content {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }

  .calendar-month .date {
    float: right;
    clear: both;
  }

  .calendar-month .event {
    position: absolute;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .calendar-month,
  .calendar-month div,
  .calendar-month button {
    box-sizing: border-box;
    line-height: 1.1em;
    font-size: 1.1em;
  }

  .calendar-month .header>div,
  .calendar-month .dayList div,
  .calendar-month .header .monthLabel,
  .calendar-month .date,
  .calendar-month .event {
    display: inline-block;
    padding: 0.2em;
  }

  .calendar-month .header button,
  .calendar-month .header .monthLabel {
    padding: 0.4em 0.6em;
  }

  .calendar-month .month {
    border-style: solid;
    border-width: 0 0 0.05em 0.05em;
  }

  .calendar-month .header {
    border-style: solid;
    border-width: 0.05em 0.05em 0 0.05em;
  }

  .calendar-month .dayList {
    border-style: solid;
    border-width: 0 0 0 0.05em;
  }

  .calendar-month .day {
    border-style: solid;
    border-width: 0.05em 0.05em 0 0;
  }

  .calendar-month .header button,
  .calendar-month .event {
    border-style: solid;
    border-width: 0.05em;
  }

  .calendar-month .week1 {
    z-index: 2;
  }

  .calendar-month .week2 {
    z-index: 4;
  }

  .calendar-month .week3 {
    z-index: 6;
  }

  .calendar-month .week4 {
    z-index: 8;
  }

  .calendar-month .week5 {
    z-index: 10;
  }

  .calendar-month .week6 {
    z-index: 12;
  }

  .calendar-month .week1 .event {
    z-index: 3;
  }

  .calendar-month .week2 .event {
    z-index: 5;
  }

  .calendar-month .week2 .event {
    z-index: 5;
  }

  .calendar-month .week3 .event {
    z-index: 7;
  }

  .calendar-month .week4 .event {
    z-index: 9;
  }

  .calendar-month .week5 .event {
    z-index: 11;
  }

  .calendar-month .week6 .event {
    z-index: 13;
  }

  .calendar-month .event.slot1 {
    top: 1.4em;
  }

  .calendar-month .event.slot2 {
    top: calc(2 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot3 {
    top: calc(3 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot4 {
    top: calc(4 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot5 {
    top: calc(5 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot6 {
    top: calc(6 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot7 {
    top: calc(7 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot8 {
    top: calc(8 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot9 {
    top: calc(9 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot10 {
    top: calc(10 * 1.4em + 0.1em);
  }

  .calendar-month .event.slot0 {
    display: none;
  }

  .calendar-month .event.offset0 {
    left: calc(.05em);
  }

  .calendar-month .event.offset1 {
    left: calc(14.28571429% + .05em);
  }

  .calendar-month .event.offset2 {
    left: calc(14.28571429% * 2 + .05em);
  }

  .calendar-month .event.offset3 {
    left: calc(14.28571429% * 3 + .05em);
  }

  .calendar-month .event.offset4 {
    left: calc(14.28571429% * 4 + .05em);
  }

  .calendar-month .event.offset5 {
    left: calc(14.28571429% * 5 + .05em);
  }

  .calendar-month .event.offset6 {
    left: calc(14.28571429% * 6 + .05em);
  }

  .calendar-month .event.span1 {
    width: calc(14.28571429% - .05em);
  }

  .calendar-month .event.span2 {
    width: calc(14.28571429% * 2 - .05em);
  }

  .calendar-month .event.span3 {
    width: calc(14.28571429% * 3 - .05em);
    text-align: center;
  }

  .calendar-month .event.span4 {
    width: calc(14.28571429% * 4 - .05em);
    text-align: center;
  }

  .calendar-month .event.span5 {
    width: calc(14.28571429% * 5 - .05em);
    text-align: center;
  }

  .calendar-month .event.span6 {
    width: calc(14.28571429% * 6 - .05em);
    text-align: center;
  }

  .calendar-month .event.span7 {
    width: calc(14.28571429% * 7 - .05em);
    text-align: center;
  }

  .calendar-month .dayList .day {
    text-align: center;
  }

  .calendar-month .event.hasUrl:hover {
    text-decoration: underline;
  }

  .calendar-month .event.continued {
    border-left-style: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .calendar-month .day.today {
    background-color: #ffe;
  }

  .calendar-month .day.past {
    background-color: #fafafa;
  }

  .calendar-month .day.outsideOfMonth {
    background-color: #f0f0f0;
  }

  .calendar-month .event.purple {
    background-color: #f0e0ff;
    border-color: #e7d7f7;
  }

  .calendar-month .event.orange {
    background-color: #ffe7d0;
    border-color: #f7e0c7;
  }

  .calendar-month .day .date::before {
    margin-right: 0.5em;
  }

  .calendar-month .month,
  .calendar-month .header,
  .calendar-month .week,
  .calendar-month .dayList {
    border-color: #DDD;
  }

  .calendar-month .header button {
    background-color: transparent;
    border-color: #e7e7e7;
    color: #808080;
    cursor: pointer;
  }

  .calendar-month .day {
    border-color: #DDD;
    display: inline-block;
  }

  .calendar-month .day .content.draghover {
    border: 0.2em solid yellow;
  }

  .calendar-month .event {
    border-color: #e0e0f0;
    border-radius: 0.5em;
    background-color: #e7e7ff;
  }

  .calendar-month .event.continued::before,
  .calendar-month .event.toBeContinued::after {
    content: " \21e2 ";
    color: #999;
  }

  .calendar-month .event.toBeContinued {
    border-right-style: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .calendar-month .header .previousMonth button::after {
    content: "\25C0";
  }

  .calendar-month .header .nextMonth button::after {
    content: "\25B6";
  }

  .calendar-month .header .previousYear button::after {
    content: "\25C0\25C0";
  }

  .calendar-month .header .nextYear button::after {
    content: "\25B6\25B6";
  }

  .calendar-month.past .header .currentMonth button::after {
    content: '\21BA';
  }

  .calendar-month.future .header .currentMonth button::after {
    content: '\21BB';
  }
</style>
