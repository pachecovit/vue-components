export default {
  computed: {
    today () {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      return d
    },
    supportsIntl () {
      return typeof Intl !== 'undefined'
    }
  },
  methods: {
    weeksOfMonth (d) {
      const firstDate = this.beginningOfCalendar(d)
      const lastDate = this.endOfCalendar(d)
      const numWeeks = Math.floor(this.dayDiff(firstDate, lastDate) / 7)
      return Array(numWeeks).fill().map((_, i) => this.addDays(firstDate, i * 7))
    },
    daysOfWeek (weekStart) {
      return Array(7).fill().map((_, i) => this.addDays(weekStart, i))
    },
    addDays (d, days) {
      const d2 = new Date(d)
      d2.setDate(d.getDate() + days)
      return d2
    },
    endOfMonth (d) {
      return new Date(d.getFullYear(), d.getMonth() + 1, 0)
    },
    endOfPreviousMonth (d) {
      return new Date(d.getFullYear(), d.getMonth(), 0)
    },
    aYearBefore (d) {
      return new Date(d.getFullYear() - 1, d.getMonth(), 1)
    },
    aYearAfter (d) {
      return new Date(d.getFullYear() + 1, d.getMonth(), 1)
    },
    monthBefore (d) {
      return new Date(d.getFullYear(), d.getMonth() - 1, 1)
    },
    monthAfter (d) {
      return new Date(d.getFullYear(), d.getMonth() + 1, 1)
    },
    beginningOfWeek (d) {
      return this.addDays(d, 0 - d.getDay())
    },
    endOfWeek (d) {
      return this.addDays(d, 7 - d.getDay())
    },
    beginningOfCalendar (d) {
      return this.beginningOfWeek(this.beginningOfMonth(d))
    },
    endOfCalendar (d) {
      return this.endOfWeek(this.endOfMonth(d))
    },
    beginningOfMonth (d) {
      return new Date(d.getFullYear(), d.getMonth(), 1)
    },
    instanceOfMonth (d) {
      return Math.ceil(d.getDate() / 7)
    },
    paddedMonth (d) {
      return ('0' + String(d.getMonth() + 1)).slice(-2)
    },
    paddedDay (d) {
      return ('0' + String(d.getDate())).slice(-2)
    },
    isoYearMonth (d) {
      return d.getFullYear() + '-' + this.paddedMonth(d)
    },
    isoYearMonthDay (d) {
      return this.isoYearMonth(d) + '-' + this.paddedDay(d)
    },
    isoMonthDay (d) {
      return this.paddedMonth(d) + '-' + this.paddedDay(d)
    },
    dayDiff (d1, d2) {
      return (d2 - d1) / 86400000
    },
    isSameDate (d1, d2) {
      return d1.getTime() === d2.getTime()
    },
    isSameMonth (d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
    },
    isPastMonth (d) {
      return this.beginningOfMonth(this.today) < this.beginningOfMonth(d)
    },
    isFutureMonth (d) {
      return this.beginningOfMonth(this.today) > this.beginningOfMonth(d)
    },
    isInFuture (d) {
      return d > this.today
    },
    isInPast (d) {
      return d < this.today
    },
    isLastInstanceOfMonth (d) {
      return d.getMonth() !== this.addDays(d, 7).getMonth()
    },
    isLastDayOfMonth (d) {
      return d.getMonth() !== this.addDays(d, 1).getMonth()
    },
    languageCode (l) {
      return l.substring(0, 2)
    },
    getFormattedMonthNames (locale, format) {
      if (!this.supportsIntl) return Array(12).fill('')
      const formatter = new Intl.DateTimeFormat(locale, { month: format })

      return Array(12).fill().map((_, i) => formatter.format(new Date(2017, i, 1)))
    },
    getFormattedWeekdayNames (locale, format) {
      if (!this.supportsIntl) return Array(7).fill('')
      const formatter = new Intl.DateTimeFormat(locale, { weekday: format })
      return Array(7).fill().map((_, i) => formatter.format(new Date(2017, 0, i + 1)))
    },
    getDefaultBrowserLocale () {
      if (typeof navigator === 'undefined') return 'unk'
      return (
        (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language || navigator.browserLanguage
      ).toLowerCase()
    }
  }
}
