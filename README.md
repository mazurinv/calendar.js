## Overview
Calendar looks like this:

![calendar](http://mazurinv.ru/demo/calendar/calendar.png)

You can also see the **[DEMO PAGE](http://mazurinv.ru/demo/calendar/)**


## Instructions

### Adding required scripts

You must include jquery to make calendar work properly.

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>

Also you need to include fontAwesome

<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

### Initialising script

To init calendar on element with id #myCalendar and with availability to select only one date

cal = new Calendar({el: "#myCalendar", oneWay: true});

If you need to select period (two dates) - you should write:

cal = new Calendar({el: "#myCalendar"});

You can also switch between two modes of dates choosing by method **setOneWay**

cal = new Calendar({el: "#myCalendar", oneWay: false});

cal.setOneWay(true);

To track selected dates you can pass selectors of input elements linked to this dates in your form to constructor like this:

cal = new Calendar({
el: "#myCalendar",
oneWay: false,
date1Input: "#firstDate",
date2Input: "#secondDate"
});


You can see example in _example.html_
