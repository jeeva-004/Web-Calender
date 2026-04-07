import { useState, useEffect, useRef } from "react";
import "./WallCalendar.css";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const DAYS = ["MON","TUE","WED","THU","FRI","SAT", "SUN"];

const MONTH_IMAGES = [
  { img: "https://images.unsplash.com/photo-1517298257259-f72ccd2db392?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
  { img: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
];

const HOLIDAYS = {
  "1-1": "New Year", "2-14": "Valentine's", "12-25": "Christmas"
};

// calculte days
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isBetween(date, start, end) {
  if (!start || !end) return false;
  const [s, e] = start < end ? [start, end] : [end, start];
  return date > s && date < e;
}

export default function WallCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("calendarNotes");
    return saved ? JSON.parse(saved) : Array(6).fill("");
  });
  const [flippingClass, setFlippingClass] = useState("");

  useEffect(() => {
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
  }, [notes]);
  
  const monthImg = MONTH_IMAGES[viewMonth];
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInPrevMonth = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);

  // filping triger
  const triggerFlip = (directionCallback) => {
    if (flippingClass) return;
    setFlippingClass("flip-start");
    
    setTimeout(() => {
      directionCallback();
      setFlippingClass("flip-middle");
      
      setTimeout(() => {
        setFlippingClass("");
      }, 50); 
    }, 400); 
  };

  const prevMonth = () => {
    triggerFlip(() => {
      setViewMonth(m => {
        if (m === 0) { setViewYear(y => y - 1); return 11; }
        return m - 1;
      });
    });
  };

  const nextMonth = () => {
    triggerFlip(() => {
      setViewMonth(m => {
        if (m === 11) { setViewYear(y => y + 1); return 0; }
        return m + 1;
      });
    });
  };

  // set slected date 
  const handleDayClick = (day) => {
    const date = formatDate(viewYear, viewMonth, day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      if (date === rangeStart) { setRangeStart(null); return; }
      setRangeEnd(date);
    }
  };

  const updateNote = (idx, val) => {
    const newNotes = [...notes];
    newNotes[idx] = val;
    setNotes(newNotes);
  };

  const cells = [];
  
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrevMonth - firstDay + i + 1, currentMonth: false });
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  
  const remainingCells = 42 - cells.length; 
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({ day: i, currentMonth: false });
  }

  return (
    <div className="cal-root">
      
      <div className="cal-controls">
        <button className="nav-btn prev" onClick={prevMonth}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button className="nav-btn today" onClick={() => triggerFlip(() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); })}>TODAY</button>
        <button className="nav-btn next" onClick={nextMonth}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div className="calendar-perspective-wrapper">
         
        <div className="spiral-container">
          {Array.from({length: 24}).map((_, i) => (
             <div className="spiral-loop" key={i}>
                <div className="spiral-hole"></div>
                <div className="spiral-wire"></div>
             </div>
          ))}
        </div>

        <div className={`calendar-card ${flippingClass}`}>
          
          <div className="hero">
            <div className="hero-img-wrap">
               <img className="hero-img" src={monthImg.img} alt="Month hero" />
            </div>
            
            <div className="hero-geometric">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="geometric-poly">
                 <polygon points="0,50 35,100 100,50 100,100 0,100" />
              </svg>
              <div className="hero-titles">
                 <div className="hero-year">{viewYear}</div>
                 <div className="hero-month">{MONTHS[viewMonth].toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div className="cal-body">
            
            <div className="notes-section">
              <h3 className="notes-heading">Notes</h3>
              <div className="notes-lines">
                 {notes.map((note, i) => (
                   <input 
                     key={i} 
                     type="text" 
                     className="note-line" 
                     value={note}
                     placeholder=""
                     onChange={(e) => updateNote(i, e.target.value)}
                   />
                 ))}
                 <div className="range-indicator">
                    {(rangeStart || rangeEnd) ? (
                      <button onClick={() => {setRangeStart(null); setRangeEnd(null)}} className="clear-btn">Clear Selection</button>
                    ) : null}
                 </div>
              </div>
            </div>

            <div className="grid-section">
               <div className="day-names">
                 {DAYS.map((d, i) => (
                   <div key={d} className={`day-name ${i >= 5 ? 'weekend' : ''}`}>{d}</div>
                 ))}
               </div>
               
               <div className="days-grid">
                 {cells.map((cell, idx) => {
                    const isCurrent = cell.currentMonth;
                    const dayStr = isCurrent ? formatDate(viewYear, viewMonth, cell.day) : null;
                    const isToday = isCurrent && dayStr === formatDate(today.getFullYear(), today.getMonth(), today.getDate());
                    
                    const isStart = isCurrent && dayStr === rangeStart;
                    const isEnd = isCurrent && dayStr === rangeEnd;
                    const inRange = isCurrent && isBetween(dayStr, rangeStart, rangeEnd);
                    const inHover = isCurrent && !rangeEnd && rangeStart && hoverDate && isBetween(dayStr, rangeStart, hoverDate);
                    
                    const colIndex = idx % 7;
                    const isWeekendCol = colIndex >= 5;

                    let classes = ["day-cell"];
                    if (!isCurrent) classes.push("other-month");
                    if (isToday) classes.push("today");
                    if (isStart) classes.push("range-start");
                    if (isEnd) classes.push("range-end");
                    if (inRange) classes.push("in-range");
                    if (inHover) classes.push("in-range-hover");
                    if (isWeekendCol) classes.push("weekend-day");

                    return (
                      <div 
                        key={idx} 
                        className={classes.join(" ")}
                        onMouseEnter={() => isCurrent && setHoverDate(dayStr)}
                        onMouseLeave={() => isCurrent && setHoverDate(null)}
                        onClick={() => isCurrent && handleDayClick(cell.day)}
                      >
                        <div className="day-number">{cell.day}</div>
                      </div>
                    )
                 })}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
