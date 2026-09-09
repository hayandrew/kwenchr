import React from "react";
import Datepicker from "react-datepicker";
import dayjs from "dayjs";
import "./DatePick.css";

// Ref-forwarding Custom Input component for react-datepicker compatibility
const DateCustomInput = React.forwardRef(
  ({ onClick, weekday, month, day, year }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className="datepicker-input-display"
    >
      <div
        className="datepicker-weekday datepicker-output"
        suppressHydrationWarning
      >
        {weekday}
      </div>
      <div
        className="datepicker-month datepicker-output"
        suppressHydrationWarning
      >
        {month}
      </div>
      <div
        className="datepicker-date datepicker-output"
        suppressHydrationWarning
      >
        {day}
      </div>
      <div
        className="datepicker-year datepicker-output"
        suppressHydrationWarning
      >
        {year}
      </div>
      <div className="datepicker-button datepicker-button-down">
        <i className="datepicker-down icon icon-calendar-alt"></i>
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

  const formatted = currentDate
    ? {
        weekday: currentDate.format("ddd"),
        month: currentDate.format("MMM"),
        day: currentDate.date(),
        year: currentDate.year(),
      }
    : {
        weekday: "",
        month: "",
        day: "",
        year: "",
      };

  return (
    <div className="datepicker-container">
      <button
        onClick={changeDate}
        value="prev"
        className="datepicker-button datepicker-button-left"
        aria-label="Previous day"
      >
        <i className="datepicker-left icon icon-chevron-left"></i>
      </button>

      {startDate && (
        <Datepicker
          customInput={
            <DateCustomInput
              weekday={formatted.weekday}
              month={formatted.month}
              day={formatted.day}
              year={formatted.year}
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
      >
        <i className="datepicker-right icon icon-chevron-right"></i>
      </button>
    </div>
  );
}
