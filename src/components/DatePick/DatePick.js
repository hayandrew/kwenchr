import React from "react";
import Datepicker from "react-datepicker";
import dayjs from "dayjs";
import "./DatePick.css";

// Ref-forwarding Custom Input component for react-datepicker compatibility
const DateCustomInput = React.forwardRef(
  (
    {
      onClick,
      onKeyDown,
      weekday,
      weekdayFull,
      month,
      monthFull,
      day,
      dayPadded,
      year,
      relativeLabel,
      className,
      ...props
    },
    ref,
  ) => (
    <div
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
      tabIndex={0}
      role="button"
      aria-label={`Selected date: ${weekdayFull || weekday} ${monthFull || month} ${dayPadded || day}, ${year}. Click to change date`}
      className={`datepicker-input-display ${className || ""}`.trim()}
      suppressHydrationWarning
      {...props}
    >
      {/* Mobile inline view: compact horizontal bar (e.g. "Wed, Sep 9, 2026") */}
      <div className="datepicker-mobile-view" suppressHydrationWarning>
        <span className="datepicker-mobile-weekday">{weekday},</span>
        <span className="datepicker-mobile-month">{month}</span>
        <span className="datepicker-mobile-date">{day},</span>
        <span className="datepicker-mobile-year">{year}</span>
        <i className="datepicker-mobile-icon icon icon-calendar-alt" aria-hidden="true"></i>
      </div>

      {/* Desktop tear-away calendar page view (matching reference photo) */}
      <div className="datepicker-desktop-view">
        {/* Tear-away perforation line on desktop */}
        <div className="datepicker-perforation-strip" aria-hidden="true">
          <span className="perforation-notch left"></span>
          <div className="perforation-line"></div>
          <span className="perforation-notch right"></span>
        </div>

        {/* MONTH (Top on desktop) */}
        <div
          className="datepicker-month datepicker-output"
          suppressHydrationWarning
        >
          {monthFull}
        </div>

        {/* DATE NUMBER (Giant Center on desktop) */}
        <div
          className="datepicker-date datepicker-output"
          suppressHydrationWarning
        >
          {dayPadded}
        </div>

        {/* WEEKDAY (Below number on desktop) */}
        <div
          className="datepicker-weekday datepicker-output"
          suppressHydrationWarning
        >
          {weekdayFull}
        </div>

        {/* SUBTEXT / YEAR / RELATIVE */}
        <div
          className="datepicker-subtext datepicker-output"
          suppressHydrationWarning
        >
          {relativeLabel ? (
            <span className="datepicker-badge">{relativeLabel}</span>
          ) : null}
          <span className="datepicker-year-text">{year}</span>
        </div>

        {/* ACTION CUE / ICON */}
        <div className="datepicker-button-down" aria-hidden="true">
          <i className="datepicker-down icon icon-calendar-alt"></i>
          <span className="datepicker-hint-text">Select Date</span>
        </div>
      </div>
    </div>
  ),
);
DateCustomInput.displayName = "DateCustomInput";

export default function DatePick({ currentDate, updateDate }) {
  const startDate = currentDate
    ? currentDate.toDate
      ? currentDate.toDate()
      : new Date(currentDate)
    : null;

  const handleChange = (date) => {
    const dayjsDate = dayjs(date);
    updateDate(dayjsDate);
  };

  const changeDate = (event) => {
    event.preventDefault();
    const type = event.currentTarget.value;
    let newDate;
    const currentDay = dayjs(currentDate);
    if (type === "next") {
      newDate = currentDay.add(1, "day");
    } else if (type === "prev") {
      newDate = currentDay.add(-1, "day");
    }
    handleChange(newDate.toDate());
  };

  const isToday = currentDate ? currentDate.isSame(dayjs(), "day") : false;
  const isTomorrow = currentDate
    ? currentDate.isSame(dayjs().add(1, "day"), "day")
    : false;

  let relativeLabel = "";
  if (isToday) {
    relativeLabel = "Today";
  } else if (isTomorrow) {
    relativeLabel = "Tomorrow";
  }

  const formatted = currentDate
    ? {
        weekday: currentDate.format("ddd"),
        weekdayFull: currentDate.format("dddd"),
        month: currentDate.format("MMM"),
        monthFull: currentDate.format("MMMM"),
        day: currentDate.date(),
        dayPadded: currentDate.format("DD"),
        year: currentDate.year(),
        relativeLabel,
      }
    : {
        weekday: "",
        weekdayFull: "",
        month: "",
        monthFull: "",
        day: "",
        dayPadded: "",
        year: "",
        relativeLabel: "",
      };

  return (
    <div className="datepicker-container tear-away-calendar">
      <button
        onClick={changeDate}
        value="prev"
        className="datepicker-button datepicker-button-left"
        aria-label="Previous day"
        title="Previous day"
      >
        <i className="datepicker-left icon icon-chevron-left"></i>
      </button>

      {startDate && (
        <Datepicker
          customInput={
            <DateCustomInput
              weekday={formatted.weekday}
              weekdayFull={formatted.weekdayFull}
              month={formatted.month}
              monthFull={formatted.monthFull}
              day={formatted.day}
              dayPadded={formatted.dayPadded}
              year={formatted.year}
              relativeLabel={formatted.relativeLabel}
            />
          }
          selected={startDate}
          minDate={new Date()}
          onChange={handleChange}
          showDisabledMonthNavigation
          todayButton="Today"
          popperPlacement="bottom"
        />
      )}

      <button
        onClick={changeDate}
        value="next"
        className="datepicker-button datepicker-button-right"
        aria-label="Next day"
        title="Next day"
      >
        <i className="datepicker-right icon icon-chevron-right"></i>
      </button>
    </div>
  );
}
