"use client";
import React, { useState, useEffect } from "react";
import Datepicker from "react-datepicker";
import moment from "moment";

// Ref-forwarding Custom Input component for react-datepicker compatibility
const DateCustomInput = React.forwardRef(
  ({ onClick, weekday, month, day, year }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      style={{ cursor: "pointer", textAlign: "center", outline: "none" }}
    >
      <div className="datepicker-weekday datepicker-output">{weekday}</div>
      <div className="datepicker-month datepicker-output">{month}</div>
      <div className="datepicker-date datepicker-output">{day}</div>
      <div className="datepicker-year datepicker-output">{year}</div>
      <div
        className="datepicker-button datepicker-button-down"
        style={{ pointerEvents: "none", margin: "6px auto 0" }}
      >
        <i className="datepicker-down icon icon-calendar-alt"></i>
      </div>
    </div>
  ),
);
DateCustomInput.displayName = "DateCustomInput";

export default function DatePick({ currentDate, updateDate }) {
  const [startDate, setStartDate] = useState(() => {
    if (currentDate) {
      return currentDate.toDate ? currentDate.toDate() : new Date(currentDate);
    }
    return null;
  });

  useEffect(() => {
    if (currentDate) {
      const nextDate = currentDate.toDate
        ? currentDate.toDate()
        : new Date(currentDate);
      if (!startDate || startDate.getTime() !== nextDate.getTime()) {
        setStartDate(nextDate);
      }
    }
  }, [currentDate, startDate]);

  const handleChange = (date) => {
    const momentDate = moment(date);
    setStartDate(date);
    updateDate(momentDate);
  };

  const changeDate = (event) => {
    event.preventDefault();
    const type = event.currentTarget.value;
    let newDate;
    const currentMoment = moment(currentDate);
    if (type === "next") {
      newDate = currentMoment.add(1, "days");
    } else if (type === "prev") {
      newDate = currentMoment.add(-1, "days");
    }
    handleChange(newDate.toDate());
  };

  const formatted = currentDate
    ? {
        weekday: currentDate.format("dddd"),
        month: currentDate.format("MMMM"),
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
