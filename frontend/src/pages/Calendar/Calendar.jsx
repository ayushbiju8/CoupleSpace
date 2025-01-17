import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Calendar.css"; 
import "@fortawesome/fontawesome-free/css/all.min.css";
const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [activeDay, setActiveDay] = useState(today.getDate());
  const [eventsArr, setEventsArr] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState("");
  const [newEventEndTime, setNewEventEndTime] = useState("");
  const [showOptions, setShowOptions] = useState(null);

  const eventBoxRef = useRef(null);

  const saveEvents = (updatedEvents) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleGoToDate = (selectedDate) => {
    setCurrentDate(selectedDate);
  };

  const handleToday = () => {
    setCurrentDate(today);
    setActiveDay(today.getDate());
  };

  const toggleOptions = (index) => {
    setShowOptions((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventBoxRef.current && !eventBoxRef.current.contains(event.target)) {
        setShowOptions(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

 

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  const daysInPrevMonth = prevLastDay.getDate();
  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();
  const nextDays = 7 - lastDayOfMonth.getDay() - 1;

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (day, isPrev, isNext) => {
    if (isPrev) {
      handlePrevMonth();
    } else if (isNext) {
      handleNextMonth();
    } else {
      setActiveDay(day);
    }
  };

  const [editingEvent, setEditingEvent] = useState(null); // Track the event being edited

  const handleEditEvent = (event) => {
    setEditingEvent(event); // Set the event being edited
    setNewEventTitle(event.title);
    const [startTime, endTime] = event.time.split(" - ");
    setNewEventStartTime(startTime);
    setNewEventEndTime(endTime);
    setShowAddEventModal(true); // Open the modal
  };
  
  const handleSaveEvent = (e) => {
    e.preventDefault();
  
    if (newEventStartTime >= newEventEndTime) {
      alert("Start time must be earlier than end time.");
      return;
    }
  
    if (editingEvent) {
      // Edit the existing event
      setEventsArr((prev) => {
        const updatedEvents = prev.map((dayEvent) => {
          if (
            dayEvent.day === activeDay &&
            dayEvent.month === currentDate.getMonth() + 1 &&
            dayEvent.year === currentDate.getFullYear()
          ) {
            return {
              ...dayEvent,
              events: dayEvent.events.map((event) =>
                event === editingEvent
                  ? { ...event, title: newEventTitle, time: `${newEventStartTime} - ${newEventEndTime}` }
                  : event
              ),
            };
          }
          return dayEvent;
        });
  
        saveEvents(updatedEvents);
        return updatedEvents;
      });
    } else {
      // Add a new event
      addEvent(newEventTitle, newEventStartTime, newEventEndTime);
    }
  
    // Reset the form and close the modal
    setShowAddEventModal(false);
    setEditingEvent(null);
    setNewEventTitle("");
    setNewEventStartTime("");
    setNewEventEndTime("");
  };
  
  const handleCancelEdit = () => {
    setEditingEvent(null); // Reset editing state
    setShowAddEventModal(false); // Close the modal
    setNewEventTitle("");
    setNewEventStartTime("");
    setNewEventEndTime("");
  };
  
   const addEvent = (title, from, to) => {
    const timeRange = `${from} - ${to}`;
    const newEvent = { title, time: timeRange };

    setEventsArr((prev) => {
      const updatedEvents = [...prev];
      const existingDayIndex = updatedEvents.findIndex(
        (event) =>
          event.day === activeDay &&
          event.month === currentDate.getMonth() + 1 &&
          event.year === currentDate.getFullYear()
      );

      if (existingDayIndex >= 0) {
        const dayEvents = updatedEvents[existingDayIndex].events;
        const isEventAlreadyAdded = dayEvents.some(
          (event) => event.title === newEvent.title && event.time === newEvent.time
        );

        if (!isEventAlreadyAdded) {
          dayEvents.push(newEvent);
        }
      } else {
        updatedEvents.push({
          day: activeDay,
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          events: [newEvent],
        });
      }

      saveEvents(updatedEvents);
      return updatedEvents;
    });
  };

  const removeEvent = (eventToRemove) => {
    setEventsArr((prev) => {
      const updatedEvents = prev.map((dayEvent) => {
        if (
          dayEvent.day === activeDay &&
          dayEvent.month === currentDate.getMonth() + 1 &&
          dayEvent.year === currentDate.getFullYear()
        ) {
          const filteredEvents = dayEvent.events.filter((event) => event !== eventToRemove);
          if (filteredEvents.length === 0) {
            // Ensure there are no remaining events on the day
            return null; // We will remove this day if there are no events left
          }
          return {
            ...dayEvent,
            events: filteredEvents,
          };
        }
        return dayEvent;
      }).filter(dayEvent => dayEvent !== null); // Remove day with no events left
  
      saveEvents(updatedEvents);
      return updatedEvents;
    });
  };
  

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEventStartTime >= newEventEndTime) {
      alert("Start time must be earlier than end time.");
      return;
    }
    addEvent(newEventTitle, newEventStartTime, newEventEndTime);
    setShowAddEventModal(false);
    setNewEventTitle("");
    setNewEventStartTime("");
    setNewEventEndTime("");
  };

  const eventsForActiveDay =
    eventsArr.find(
      (event) =>
        event.day === activeDay &&
        event.month === currentDate.getMonth() + 1 &&
        event.year === currentDate.getFullYear()
    )?.events || [];

  const days = [];
  for (let i = startDay; i > 0; i--) {
    days.push(
      <div key={`prev-${i}`} className="day prev-date">
        {daysInPrevMonth - i + 1}
      </div>
    );
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const isActive = i === activeDay;
    const hasEvent = eventsArr.some(
      (event) =>
        event.day === i &&
        event.month === currentDate.getMonth() + 1 &&
        event.year === currentDate.getFullYear()
    );

    days.push(
      <div
        key={`current-${i}`}
        className={`day ${isActive ? "active" : ""} ${hasEvent ? "event" : ""}`}
        onClick={() => handleDayClick(i, false, false)}
      >
        {i}
      </div>
    );
  }

  for (let i = 1; i <= nextDays; i++) {
    days.push(
      <div key={`next-${i}`} className="day next-date">
        {i}
      </div>
    );
  }
    return (
    <div className="calendar-container">
      {showAddEventModal && (
        <div className="add-event-modal">
          <div className="modal-content">
            <h3>Add New Event</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label htmlFor="eventTitle">Event Title</label>
                <input
                  type="text"
                  id="eventTitle"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventStartTime">Start Time</label>
                <input
                  type="time"
                  id="eventStartTime"
                  value={newEventStartTime}
                  onChange={(e) => setNewEventStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventEndTime">End Time</label>
                <input
                  type="time"
                  id="eventEndTime"
                  value={newEventEndTime}
                  onChange={(e) => setNewEventEndTime(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn-calendar">
                  Save Event
                </button>
                <button
                  type="button"
                  className="cancel-btn-calendar"
                  onClick={() => setShowAddEventModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="containerofcalendar">
        <div className="leftofcalendar">
          <div className="maincentralcalendar">
            <div className="monthofcalendar">
              <i className="fas fa-angle-left prev" onClick={handlePrevMonth}></i>
              <div className="dateofcalendar">
                {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
              </div>
              <i className="fas fa-angle-right next" onClick={handleNextMonth}></i>
            </div>
            <div className="weekdays">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="days">{days}</div>
            <div className="goto-today">
              <button className="today-btn" onClick={handleToday}>
                Today
              </button>
            </div>
            <div className="goto-date">
              <div className="go-to-btn">Go to Date</div>
              <DatePicker
                selected={currentDate}
                onChange={handleGoToDate}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
              />
            </div>
          </div>
        </div>

        <div className="rightofmaincalendar">
          <div className="add-event-icon" onClick={() => setShowAddEventModal(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="add-event-svg"
            >
              <path
                fillRule="evenodd"
                d="M12 4.5a.75.75 0 01.75.75V11.25H19.5a.75.75 0 010 1.5H12.75V19.5a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V5.25A.75.75 0 0112 4.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="today-date">
            <div className="event-day">
              {new Date(currentDate.getFullYear(), currentDate.getMonth(), activeDay)
                .toDateString()
                .split(" ")[0]}
            </div>
            <div className="event-date">
              {activeDay} {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
            </div>
          </div>

          <div className="events">
            {eventsForActiveDay.length > 0 ? (
              <div className="events-list">
                {eventsForActiveDay.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-details">
                      <div className="title">
                        <i className="fas fa-circle"></i>
                        <h3 className="event-title">{event.title}</h3>
                      </div>
                      <div className="event-time">{event.time}</div>
                    </div>
                    <div className="event-actions">
                      <button onClick={() => handleEditEvent(event)} className="edit">
                        Edit
                      </button>
                      <button onClick={() => removeEvent(event)} className="remove">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-event">
                <h3>No Events</h3>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Calendar;