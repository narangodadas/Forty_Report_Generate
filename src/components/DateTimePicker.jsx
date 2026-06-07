import { useRef, useEffect, useState } from "react";
import { Calendar, X } from "lucide-react";

export default function DateTimePicker({ label, value, onChange, required, placeholder, defaultHour, defaultMinute, defaultPeriod }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState(value || "");
  const [tempDate, setTempDate] = useState({ date: "", hour: defaultHour || "12", minute: defaultMinute || "00", period: defaultPeriod || "AM" });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDayClick = (day) => {
    const d = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setTempDate((p) => ({ ...p, date: d }));
  };

  const handleConfirm = () => {
    if (!tempDate.date) return;
    let h = parseInt(tempDate.hour);
    if (tempDate.period === "PM" && h !== 12) h += 12;
    if (tempDate.period === "AM" && h === 12) h = 0;
    const formatted = `${tempDate.date} ${String(h).padStart(2, "0")}:${tempDate.minute}`;
    const display = `${tempDate.date} ${tempDate.hour}:${tempDate.minute} ${tempDate.period}`;
    setInputVal(display);
    onChange(formatted);
    setIsOpen(false);
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const selectedDateStr = tempDate.date;
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const clear = (e) => {
    e.stopPropagation();
    setInputVal("");
    setTempDate({ date: "", hour: "12", minute: "00", period: "AM" });
    onChange("");
  };

  return (
    <div className="field-group" ref={containerRef} style={{ position: "relative" }}>
      <label className="field-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <div className="dt-input-wrapper" onClick={() => setIsOpen(true)}>
        <Calendar size={16} className="dt-icon" />
        <input
          type="text"
          readOnly
          value={inputVal}
          placeholder={placeholder || "Select date & time"}
          className="dt-input"
        />
        {inputVal && (
          <button type="button" onClick={clear} className="dt-clear">
            <X size={13} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="dt-popup">
          {/* Calendar Header */}
          <div className="dt-cal-header">
            <button type="button" onClick={() => {
              if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
              else setCalMonth(m => m - 1);
            }} className="dt-nav-btn">‹</button>
            <span className="dt-month-label">{months[calMonth]} {calYear}</span>
            <button type="button" onClick={() => {
              if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
              else setCalMonth(m => m + 1);
            }} className="dt-nav-btn">›</button>
          </div>

          {/* Day Headers */}
          <div className="dt-day-headers">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="dt-day-header">{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="dt-days-grid">
            {days.map((day, i) => {
              if (!day) return <span key={`e-${i}`} />;
              const dStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = dStr === selectedDateStr;
              const isToday = day === currentDay && calMonth === currentMonth && calYear === currentYear;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`dt-day ${isSelected ? "dt-day-selected" : ""} ${isToday && !isSelected ? "dt-day-today" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time Row */}
          <div className="dt-time-row">
            <span className="dt-time-label">Time</span>
            <div className="dt-time-selects">
              <select
                value={tempDate.hour}
                onChange={(e) => setTempDate((p) => ({ ...p, hour: e.target.value }))}
                className="dt-time-select"
              >
                {hours.map((h) => <option key={h}>{h}</option>)}
              </select>
              <span className="dt-colon">:</span>
              <select
                value={tempDate.minute}
                onChange={(e) => setTempDate((p) => ({ ...p, minute: e.target.value }))}
                className="dt-time-select"
              >
                {minutes.map((m) => <option key={m}>{m}</option>)}
              </select>
              <div className="dt-period-toggle">
                {["AM", "PM"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTempDate((prev) => ({ ...prev, period: p }))}
                    className={`dt-period-btn ${tempDate.period === p ? "active" : ""}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dt-footer">
            <button type="button" onClick={() => setIsOpen(false)} className="dt-cancel-btn">Cancel</button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!tempDate.date}
              className="dt-confirm-btn"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
