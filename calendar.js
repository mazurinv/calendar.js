/**
 * two months calendar widget for avia ticket sellers
 * @author mazurinv@gmail.com
 */

var Calendar = function(settings) {
    this.monthNames = calendarLocalisation.monthNames;
    this.monthNamesRod = calendarLocalisation.monthNamesRod;
    this.weekDayNames = calendarLocalisation.weekDayNames;
    this.weekEnds = calendarLocalisation.weekEnds;

    var defaultSettings = {
        months: {month1: 0, month2: 1},
        el: '#twoMonthsCalendar',
        oneWay: false,
        date1Input: '#date1',
        date2Input: '#date2',
        curMonths: {
            month1: 0,
            month2: 1
        }
    };
    this.settings = {};
    for (var i in defaultSettings) {
        this.settings[i] = settings !== undefined && settings[i] !== undefined ? settings[i] : defaultSettings[i];
    }

    this.today = new Date();
    this.curDate = this.today.getDate();
    this.curMonth = this.today.getMonth();
    this.curYear = this.today.getFullYear();

    this.oneWay = this.settings.oneWay
    this.dates = {
        date1: false,
        date2: false
    }
    this.dateRemoved = false;
    this.dateChoosed = false;
    this.monthClicked = {month: this.curMonth - 1, year: this.curYear};

    this.setOneWay = function(value) {
        this.oneWay = value;
        this.dates.date2 = false;
        this.drawMonths(false);
    };

    this.isNullDate = function(date) {
        if (false === date) {
            return true
        }
        return new Date(date).getFullYear() === 1970
    }

    this.getMaxDate = function(monthId) {
        var monthsList = this.getMonthList()
        var month = monthsList[monthId]
        var m = month.month-1
        var y = month.year
        if (m === 1) {
            return y%4 || (!(y%100) && y%400 ) ? 28 : 29;
        };
        return m===3 || m===5 || m===8 || m===10 ? 30 : 31;
    }

    this.isDateInMonth = function(date, month, year) {
        if (this.isNullDate(date)) {
            return false
        }
        if (date.getMonth() + 1 === month && date.getFullYear() === year) {
            return date.getDate()
        }
        return false
    }

    this.getDateMonthId = function(date) {
        if (this.isNullDate(date)) {
            return false
        }
        var months = this.getMonthList()
        for (var i in months) {
            if (months[i]['month'] === date.getMonth() + 1 && months[i]['year'] === date.getFullYear()) {
                return parseInt(i)
            }
        }
        return false
    }

    this.getMonthList = function() {
        var months = []
        var date = new Date()
        var n = date.getMonth()
        var year = date.getFullYear()
        var monthNames = this.monthNames
        for (var i=n; i<12; i++) {
            months.push({year: year, month: i+1, name: monthNames[i]})
        }
        for (var i=0; i<n; i++) {
            months.push({year: year+1, month: i+1, name: monthNames[i]})
        }
        return months
    }

    this.drawStruct = function () {
        var html = ''
        html += '<div class="month">'
        html += '<div class="month-c"></div>'
        html += '</div>'
        html += '<div class="data">'
        html += '<div class="data-c">'
        html += '<div class="data-r"></div>'
        html += '<div class="data-l"></div>'
        html += '<div style="clear:both;"></div>'
        html += '</div>'
        html += '</div>'
        $(this.settings.el).addClass('calendar')
        $(this.settings.el).html(html)
        this.applyNewDates()
        var months = this.drawMonths();
        var that = this
        $(this.settings.el + ' .month-c').on('click', 'a', function() {
            that.monthClicked = {month: $(this).attr('data-month'), year: $(this).attr('data-year')};
            that.dates.date2 = false;
            that.drawMonths();
        })

        var dateEvent = 'click'
        if (/iPad|iPhone|iPod/.test(navigator.platform)) {
            dateEvent = 'touchstart'
        }
        $(this.settings.el + '.calendar').on(dateEvent, '.date-active', function(){
            var dateClicked = $(this).attr('data-date');
            that.dateChoosed = new Date(dateClicked);
            that.applyNewDates();
            that.drawMonths(false);
        })
    }

    this.applyNewDates = function() {
        var ret = this.calculateChoosedDates()

        // flip dates if they are not in correct order
        if (!this.isNullDate(ret.date2)) {
            var first = ret.date1.getTime()
            var second = ret.date2.getTime()
            if (first > second) {
                ret = {date1:ret.date2, date2:ret.date1}
            }
        }
        if (!this.isNullDate(ret.date1)) {
            ret.date1.setHours(0)
        }
        if (!this.isNullDate(ret.date2)) {
            ret.date2.setHours(0)
        }
        this.dates = ret

        $(this.settings.date1Input).val(this.outputDate(ret.date1))
        $(this.settings.date2Input).val(this.outputDate(ret.date2))
    }

    this.outputDate = function (date) {
        if (date === false) {
            return '';
        }
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
    }

    this.calculateChoosedDates = function () {
        var date1 = this.dates.date1
        var date2 = this.dates.date2
        var dateClicked = this.dateChoosed
        var dateRemoved = this.dateRemoved
        var monthClicked = this.monthClicked

        // 1 if we do not any action with dates
        if (this.isNullDate(dateClicked)) {
            // if any month choosed - we should always clear date2
            if (monthClicked) {
                date2 = false
            }
            return {date1: date1, date2:date2}
        }

        // 2 drag n drop action
        if (!this.isNullDate(dateRemoved)) {
            if (dateRemoved.getTime() == date1.getTime()) {
                date1 = dateClicked
            }
            if (dateRemoved.getTime() == date2.getTime()) {
                date2 = dateClicked
            }
            return {date1: date1, date2:date2}
        }

        // 3 clicking action
        if (this.oneWay) {
            return {date1:dateClicked, date2:false}
        }
        if (!this.isNullDate(date2)) {
            return {date1: dateClicked, date2:false}
        }
        if (!this.isNullDate(date1) && this.isNullDate(date2)) {
            return {date1: date1, date2:dateClicked}
        }

        return {date1:dateClicked, date2:false}
    }

    this.calculateChoosedMonths = function() {
        var months = this.getMonthList();
        var monthClicked = this.monthClicked ? new Date(this.monthClicked.year, this.monthClicked.month -1, 1) : false;
        monthClicked = this.getDateMonthId(monthClicked);
        var month1 = this.getDateMonthId(this.dates.date1);
        var month2 = this.getDateMonthId(this.dates.date2);

        // month choosing click
        if (monthClicked !== false) {
            if (month1 !== false && month1 !== monthClicked) {
                if (monthClicked > month1) {
                    return {month1: month1, month2: monthClicked}
                }
                return {month1: monthClicked, month2: month1}
            }

            if (monthClicked + 1 == months.length) {
                return {month1: monthClicked - 1, month2: monthClicked}
            }
            return {month1: monthClicked, month2: monthClicked + 1}
        }
        /*
        if (curMonths && !forced) {
            return curMonths
        }*/
        // date choosing action
        if (month1 === false) {
            return {month1: 0, month2: 1}
        }
        if (month2 === false || month1 === month2) {
            if (month1 + 1 == months.length) {
                return {month1: month1 - 1, month2: month1}
            }
            return {month1: month1, month2: month1 + 1}
        }
        return {month1: month1, month2: month2}
    }

    this.draw = function (monthId) {
        var months = this.getMonthList()
        var month = months[monthId]
        html = ''
        // draw weekDayNames
        html += '<div class="data-week">'
        for (i = 0; i < this.weekDayNames.length; i++) {
            var cl = ""
            for (var k=0;k<this.weekEnds.length;k++) {
                if (this.weekEnds[k] == i) {
                    cl = "weekend"
                }
            }
            html += '<span class="weekDay '+cl+'">' + this.weekDayNames[i] + '</span>'
        }
        html += '</div>'

        // draw days
        var firstMonthDay = new Date(month.year, month.month-1, 1)
        var firstWeekDay = firstMonthDay.getDay() == 0 ? 7 : firstMonthDay.getDay()

        html += '<div class="data-day">'
        for (i=1;i<firstWeekDay;i++) {
            html += '<a class="empty"></a>'
        }

        var activeFrom = this.isDateInMonth(this.dates.date1, month.month, month.year)
        var activeTo = this.isDateInMonth(this.dates.date2, month.month, month.year)
        var activeFromTo = activeTo == activeFrom ? activeTo : false

        for (i = 1; i <= this.getMaxDate(monthId); i++) {
            var classes = []
            if (
                this.isDateInMonth(this.today, month.month, month.year)
                && i < this.today.getDate()
            ) {
                classes.push('date-disabled')
            } else {
                classes.push('date-active')
            }

            // different hover state conditions
            var curDate = new Date(month.year, month.month - 1, i)

            // no hover state for just clicked dates
            if (!this.isNullDate(this.dateChoosed) && this.dateChoosed.getTime() == curDate.getTime()) {
                classes.push('hovered-disabled')
            }
            if (
                !this.isNullDate(this.dates.date1)
                && this.isNullDate(this.dates.date2)
                && curDate.getTime() > this.dates.date1.getTime()
                && !this.oneWay
            ) {
                classes.push('hovered-dateBack')
            } else if (
                !this.isNullDate(this.dates.date1)
                && this.isNullDate(this.dates.date2)
                && curDate.getTime() == this.dates.date1.getTime()
                && !this.oneWay
            ) {
                classes.push('hovered-dateBoth')
            } else {
                classes.push('hovered-dateTo')
            }

            if (activeFromTo == i) {
                classes.push('active-from-to')
            } else if (activeTo == i) {
                classes.push('active-to')
            } else if (activeFrom == i) {
                classes.push('active-from')
            }
            var monthString = month.month.toString().length == 2 ? month.month : '0' + month.month
            var day = i.toString().length == 2 ? i : '0' + i
            var dateStr = month.year + '/' + monthString + '/' + day
            html += '<a class="'+classes.join(' ')+'" data-date="'+dateStr+'">'+i
            if (i == 1 || i == activeTo || i== activeFromTo || i == activeFrom) {
                html += '<span>'+ this.monthNamesRod[month.month - 1] +'</span>'
            } else {
                html += '<span class="not-active">'+ this.monthNamesRod[month.month - 1] +'</span>'
            }
            html += '</a>'
        }
        html += '</div>'
        return html
    }

    this.drawMonths = function(reselectMonth) {
        var months = this.getMonthList()
        if (reselectMonth !== false) {
            this.settings.curMonths = this.calculateChoosedMonths()
        }
        var html=''
        for (var i in months) {
            var iMonth = parseInt(months[i]['month'])
            var iYear = parseInt(months[i]['year'])
            var activeFrom = this.isDateInMonth(this.dates.date1, iMonth, iYear)
            var activeTo = this.isDateInMonth(this.dates.date2, iMonth, iYear)
            var isActive = ""
            if (i == this.settings.curMonths.month1 || i == this.settings.curMonths.month2) {
                isActive = "active"
            }
            html += '<a class="'+isActive+'" data-month="' + iMonth + '" data-year="' + iYear + '">'
            html += months[i]['name']
            html += '<div class="date-month">'
            if (activeFrom) {
                html += '<div class="date-month-from">'+activeFrom+'</div>'
            }
            if (activeTo) {
                html += '<div class="date-month-to">'+activeTo+'</div>'
            }
            html += '</div>'
            if (iMonth === 1) {
                html += '<div class="firstMonthYear">'+iYear+'</div>'
            }
            html += '</a>'
        }
        var isNeighbours = (Math.abs(this.settings.curMonths.month2 - this.settings.curMonths.month1) === 1)

        $(this.settings.el + ' .month-c').html(html)
        $(this.settings.el + '.calendar .data .data-r').removeClass('calendarClear')
        if (isNeighbours) {
            $(this.settings.el + '.calendar .data .data-r').addClass('calendarClear')
        }
        if (this.settings.curMonths.month1 != this.settings.curMonths.month1) {
            $(this.settings.el + '.calendar .data .data-l').fadeOut(100).fadeIn(200)
        }
        if (this.settings.curMonths.month2 != this.settings.curMonths.month2) {
            $(this.settings.el + '.calendar .data .data-r').fadeOut(100).fadeIn(200)
        }

        $(this.settings.el + '.calendar .data .data-l').html(this.draw(this.settings.curMonths.month1))
        $(this.settings.el + '.calendar .data .data-r').html(this.draw(this.settings.curMonths.month2))
    }

    this.drawStruct();
}
