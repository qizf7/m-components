const moment = require('moment');

const prefix = 'mc-calendar';

const calendars = $(`.${prefix}`);

const popHTML =
`<div class="mc-calendar-pop">
  <div class="mc-calendar-pop-header"></div>
  <div class="mc-calendar-pop-body">
    <div class="mc-calendar-pop-calendar">
      <div class="mc-calendar-pop-calendar-weeks">
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
        <span>日</span>
      </div>
      <div class="mc-calendar-pop-calendar-days"></div>
    </div>
    <div class="mc-calendar-pop-time"></div>
  </div>
  <div class="mc-calendar-pop-footer">
    <a>确定</a>
  </div>
</div>`;

class Calendar {
  constructor(calendar) {
    this.calendarDom = $(calendar);
    this.popDom = $(popHTML);
    this.calendarDom.append(this.popDom);
    this.calendarHeaderDom = this.popDom.find(`.${prefix}-pop-header`);
    this.calendarDaysDom = this.popDom.find(`.${prefix}-pop-calendar-days`);
    this.timeDom = this.popDom.find(`.${prefix}-pop-time`);

    this.now = new moment();
    this.month = new moment();

    this.selectedDate = '';
    this.selectedTime = new moment();

    this.renderMonth();
    this.renderDate();
    this.renderTime();

    this.addListeners();
  }

  handleToggle(e) {
    $(this.calendarDom).toggleClass('show');
    return false;
  }

  handleConfirm() {
    let value = `${this.selectedDate.format('YYYY-MM-DD')} ${this.selectedTime.format('HH:mm')}`
    this.calendarDom.find(`.${prefix}-text`).val(value);
    this.calendarDom.find(`.${prefix}-text`).trigger('change');
    $(this.calendarDom).removeClass('show');
    return false;
  }

  preMonth(e) {
    let context = e.data.context;
    context.month = context.month.subtract(1, 'month');
    context.renderMonth();
    context.renderDate();
  }

  nextMonth(e) {
    let context = e.data.context;
    context.month = context.month.add(1, 'month');
    context.renderMonth();
    context.renderDate();
  }

  preHour(e) {
    let context = e.data.context;
    context.selectedTime.subtract(1, 'hours')
    context.renderTime();
  }

  nextHour(e) {
    let context = e.data.context;
    context.selectedTime.add(1, 'hours');
    context.renderTime();
  }

  preMinute(e) {
    let context = e.data.context;
    context.selectedTime.subtract(1, 'minutes');
    context.renderTime();
  }

  nextMinute(e) {
    let context = e.data.context;
    context.selectedTime.add(1, 'minutes');
    context.renderTime();
  }

  handleSelectDate(e) {
    let context = e.data.context;
    if (!$(this).hasClass('disabled')) {
      context.selectedDate = new moment($(this).attr('data-date'));
      context.renderDate();
    }
  }

  addListeners() {
    this.calendarDom.on('click', `.${prefix}-text-container`, this.handleToggle.bind(this));
    this.popDom.on('click', `.${prefix}-pop-footer`, this.handleConfirm.bind(this));

    this.calendarDaysDom.on('click', 'span', {
      context: this
    },this.handleSelectDate);

    this.calendarHeaderDom.on('click', `.pre-btn`, {
      context: this
    }, this.preMonth);

    this.calendarHeaderDom.on('click', `.next-btn`, {
      context: this
    }, this.nextMonth);

    this.timeDom.on('click', `.${prefix}-pop-time-hour-left`, {
      context: this
    }, this.preHour);

    this.timeDom.on('click', `.${prefix}-pop-time-hour-right`, {
      context: this
    }, this.nextHour);

    this.timeDom.on('click', `.${prefix}-pop-time-minute-left`, {
      context: this
    }, this.preMinute);

    this.timeDom.on('click', `.${prefix}-pop-time-minute-right`, {
      context: this
    }, this.nextMinute);
  }

  renderMonth() {
    this.calendarHeaderDom.html(`
      <span class="pre-btn"></span>
      <span class="month">${this.month.format('YYYY年MM月')}</span>
      <span class="next-btn"></span>
    `)
  }

  renderDate() {
    let startDate = this.month.clone().startOf('month');
    let endDate = this.month.clone().endOf('month');
    let startWeekday = startDate.weekday();
    let endWeekday = endDate.weekday();
    let todayDate = this.now.date();

    let monthLen = endDate.date();

    let dateList = [];
    let tempStart = startDate.clone();
    let tempEnd = endDate.clone();
    let tempMonth = this.month.clone();

    if (startWeekday > 1) {
      for (let i = 0; i < startWeekday ;i++) {
        dateList.unshift(tempStart.subtract(1, 'days').format('YYYY-MM-DD'));
      }
    }

    for(let i = 1; i <= monthLen ;i++) {
      dateList.push(tempMonth.date(i).format('YYYY-MM-DD'));
    }

    if (endWeekday < 6) {
      for (let i = 1; i < 7 - endWeekday ;i++) {
        dateList.push(tempEnd.add(1, 'days').format('YYYY-MM-DD'));
      }
    }

    let html = dateList.map(item => {
      if (new moment(item).isBefore(startDate) || new moment(item).isAfter(endDate)) {
        return `<span class="disabled" data-date="${item}"><i>${new moment(item).date()}</i></span>`
      } else if (item === this.now.format('YYYY-MM-DD')) {
        return `<span class="today" data-date="${item}"><i>${new moment(item).date()}</i></span>`
      } else if (this.selectedDate && item === this.selectedDate.format('YYYY-MM-DD')) {
        return `<span class="selected" data-date="${item}"><i>${new moment(item).date()}</i></span>`
      } else {
        return `<span data-date="${item}"><i>${new moment(item).date()}</i></span>`
      }
    }).join('');

    this.calendarDaysDom.html(html)
  }

  renderTime() {
    this.timeDom.html(`
      时间
      <span class="mc-calendar-pop-time-hour-left"></span>
      ${this.selectedTime.format('HH')}
      <span class="mc-calendar-pop-time-hour-right"></span>
      :
      <span class="mc-calendar-pop-time-minute-left"></span>
      ${this.selectedTime.format('mm')}
      <span class="mc-calendar-pop-time-minute-right"></span>
    `)
  }
}


$.each(calendars, (index, calendar) => {
  new Calendar(calendar)
})
