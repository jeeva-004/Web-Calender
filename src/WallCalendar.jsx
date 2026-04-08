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
  // Format: "Month-Day": { name: "Event Name", isHoliday: boolean }
  "1-1": { name: "New Year's Day", isHoliday: true },
  "1-12": { name: "National Youth Day", isHoliday: false },
  "1-14": { name: "Pongal/Makar Sankranti", isHoliday: true },
  "1-15": { name: "Indian Army Day", isHoliday: false },
  "1-23": { name: "Netaji Jayanti", isHoliday: false },
  "1-24": { name: "National Girl Child Day", isHoliday: false },
  "1-25": { name: "National Voters Day", isHoliday: false },
  "2-14": { name: "Valentine's Day", isHoliday: false },
  "2-28": { name: "National Science Day", isHoliday: false },
  "3-4": { name: "Holi", isHoliday: true },
  "3-8": { name: "International Women's Day", isHoliday: false },
  "3-26": { name: "Rama Navami", isHoliday: true },
  "3-31": { name: "Mahavir Jayanti", isHoliday: true },
  "4-3": { name: "Good Friday", isHoliday: true },
  "4-7": { name: "World Health Day", isHoliday: false },
  "4-14": { name: "Ambedkar Jayanti", isHoliday: true },
  "5-1": { name: "Labour Day", isHoliday: true },
  "6-5": { name: "World Environment Day", isHoliday: false },
  "8-15": { name: "Independence Day", isHoliday: true },
  "9-14": { name: "Hindi Diwas", isHoliday: false },
  "10-2": { name: "Gandhi Jayanti", isHoliday: true },
  "11-14": { name: "Children's Day", isHoliday: false },
  "12-25": { name: "Christmas Day", isHoliday: true }
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

function getRangeKey(start, end) {
  if (!start && !end) return null;
  if (!end) return start;
  const [s, e] = start < end ? [start, end] : [end, start];
  return `${s}_${e}`;
}

export default function WallCalendar() {
  const notesRef = useRef(null);
  const calendarRef = useRef(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [modalConfig, setModalConfig] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const [savedNotesDict, setSavedNotesDict] = useState(() => {
    const saved = localStorage.getItem("calendarNotesDict");
    return saved ? JSON.parse(saved) : {};
  });

  const [notes, setNotes] = useState(Array(6).fill(""));
  const [flippingClass, setFlippingClass] = useState("");

  const currentKey = getRangeKey(rangeStart, rangeEnd);

  useEffect(() => {
    if (currentKey) {
      setNotes(savedNotesDict[currentKey] || Array(6).fill(""));
    } else {
      setNotes(Array(6).fill(""));
    }
  }, [currentKey]);

  useEffect(() => {
    localStorage.setItem("calendarNotesDict", JSON.stringify(savedNotesDict));
  }, [savedNotesDict]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNoteCountForDay = (dayStr) => {
    if (!savedNotesDict) return 0;
    let count = 0;
    for (const key in savedNotesDict) {
      const notesArr = savedNotesDict[key];
      if (!Array.isArray(notesArr)) continue;
      const validNotes = notesArr.filter(n => typeof n === 'string' && n.trim() !== "").length;
      if (validNotes === 0) continue;

      if (key === dayStr) {
        count += validNotes;
      } else if (key.includes("_")) {
        const [start, end] = key.split("_");
        if (dayStr >= start && dayStr <= end) {
          count += validNotes;
        }
      }
    }
    return count;
  };
  
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

  const handleNoteFocus = (e) => {
    if (!rangeStart) {
      e.target.blur();
      setModalConfig({
        title: "Select a Date First",
        message: "First of all, click the date or range when you want to take your notes actually!"
      });
    }
  };

  const handleSaveNotes = () => {
    const isEmpty = notes.every(n => n.trim() === "");
    if (isEmpty) {
      setModalConfig({
        title: "Notes Empty",
        message: "The input field can't be empty! Please write some notes before saving."
      });
      return;
    }

    if (currentKey) {
      setSavedNotesDict(prev => ({
        ...prev,
        [currentKey]: notes
      }));
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    }
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
            
            <button 
              className="mobile-scroll-btn" 
              onClick={() => calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              Add Notes
            </button>
          </div>

          <div className="cal-body">
            
            <div className="notes-section" ref={notesRef}>
              <h3 className="notes-heading">Notes</h3>
              <div className="notes-lines">
                 {notes.map((note, i) => (
                   <input 
                     key={i} 
                     type="text" 
                     className="note-line" 
                     value={note}
                     placeholder={rangeStart ? "Type here..." : "Click a date first..."}
                     onChange={(e) => updateNote(i, e.target.value)}
                     onFocus={handleNoteFocus}
                   />
                 ))}
                 <div className="range-indicator">
                    {currentKey && (
                      <div className="note-actions">
                        <button onClick={handleSaveNotes} className="clear-btn save-btn">Save Notes</button>
                        <button onClick={() => {setRangeStart(null); setRangeEnd(null)}} className="clear-btn clear-btn-secondary">Clear Selection</button>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            <div className="grid-section" ref={calendarRef}>
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

                    const holidayKey = isCurrent ? `${viewMonth + 1}-${cell.day}` : null;
                    const holiday = holidayKey ? HOLIDAYS[holidayKey] : null;

                    const noteCount = isCurrent ? getNoteCountForDay(dayStr) : 0;

                    return (
                      <div 
                        key={idx} 
                        className={classes.join(" ")}
                        onMouseEnter={() => isCurrent && setHoverDate(dayStr)}
                        onMouseLeave={() => isCurrent && setHoverDate(null)}
                        onClick={() => isCurrent && handleDayClick(cell.day)}
                        data-holiday={holiday ? holiday.name : null}
                      >
                        <div className="day-number">{cell.day}</div>
                        {holiday && (
                          <div className={`holiday-dot ${holiday.isHoliday ? 'public' : 'important'}`} title={holiday.name}></div>
                        )}
                        {noteCount > 0 && (
                          <div className="note-badge">{noteCount}</div>
                        )}
                      </div>
                    )
                 })}
               </div>
            </div>

          </div>
        </div>
      </div>

      <div className="monthly-summary">
        <div className="summary-header">
          <h3>Notes Summary: {MONTHS[viewMonth]} {viewYear}</h3>
        </div>
        <div className="summary-content">
          {(() => {
            const monthNotes = [];
            Object.keys(savedNotesDict).forEach(dateKey => {
              const notesArr = savedNotesDict[dateKey];
              const validNotes = notesArr.filter(n => n?.trim() !== "");
              if (validNotes.length === 0) return;

              // Handle single date key (YYYY-MM-DD)
              if (!dateKey.includes("_")) {
                const [y, m, d] = dateKey.split("-").map(Number);
                if (y === viewYear && m === viewMonth + 1) {
                  monthNotes.push({ date: `Day ${d}`, notes: validNotes, sortKey: d });
                }
              } else {
                // Handle range key (YYYY-MM-DD_YYYY-MM-DD)
                const [start, end] = dateKey.split("_");
                const [sy, sm, sd] = start.split("-").map(Number);
                const [ey, em, ed] = end.split("-").map(Number);
                
                // Show if range overlaps current month
                const startM = sy * 12 + sm;
                const endM = ey * 12 + em;
                const currentM = viewYear * 12 + (viewMonth + 1);
                
                if (currentM >= startM && currentM <= endM) {
                   monthNotes.push({ 
                     date: `${sd}/${sm} - ${ed}/${em}`, 
                     notes: validNotes,
                     sortKey: sd // Sort by start day
                   });
                }
              }
            });

            if (monthNotes.length === 0) {
              return <p className="no-summary">No notes recorded for this month.</p>;
            }

            return monthNotes.sort((a,b) => a.sortKey - b.sortKey).map((item, idx) => (
              <div key={idx} className="summary-item">
                <div className="summary-date">{item.date}</div>
                <div className="summary-text">
                  {item.notes.map((n, i) => <div key={i} className="summary-text-line">• {n}</div>)}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {modalConfig && (
        <div className="modal-overlay" onClick={() => setModalConfig(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h4>{modalConfig.title}</h4>
            <p>{modalConfig.message}</p>
            <button onClick={() => setModalConfig(null)} className="modal-close-btn">Got it</button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="success-icon">✓</div>
            <h4>Success!</h4>
            <p>Your notes have been securely saved to this date.</p>
            <button onClick={() => setShowSuccessModal(false)} className="modal-close-btn success-btn">Awesome</button>
          </div>
        </div>
      )}

      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`} 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
      </button>

    </div>
  );
}
