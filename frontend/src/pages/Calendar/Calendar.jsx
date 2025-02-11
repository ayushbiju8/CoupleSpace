import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Calendar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from 'axios';

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [activeDay, setActiveDay] = useState(today.getDate());
  const [eventsArr, setEventsArr] = useState([]);
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

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/couples/get-events', { withCredentials: true });
        if (response.status === 200) {
          setEventsArr(response.data.data); // Update state with the events from the backend
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
    fetchEvents();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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

  const addEvent = async (title, startTime, endTime) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), activeDay);
    const eventData = {
      title,
      description: "", // Add a description field if you need one, or leave it empty
      date: date.toISOString(), // Convert the date to ISO string
      startTime,
      endTime
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/couples/add-event', 
        eventData,
        { withCredentials: true }
      );
      
      // Assuming the backend returns the newly added event or a success message
      if (response.status === 200) {
        setEventsArr((prev) => [...prev, response.data]); // Update eventsArr with the new event
        console.log("Event added:", response.data);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Please try again.");
    }
  };

  const removeEvent = async (event) => {
    try {
      const response = await axios.delete('http://localhost:8000/api/v1/couples/delete-event', {
        data: { eventId: event._id }, // Send eventId in the request body
        withCredentials: true,
      });
  
      if (response.status === 200) {
        setEventsArr((prevEvents) => prevEvents.filter((e) => e._id !== event._id)); // Remove event from state
        console.log("Event deleted:", event._id);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event. Please try again.");
    }
  };
  

  const eventsForActiveDay = eventsArr.filter(
    (event) =>
      new Date(event.date).getDate() === activeDay &&
      new Date(event.date).getMonth() === currentDate.getMonth()
  );

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
        new Date(event.date).getDate() === i &&
        new Date(event.date).getMonth() === currentDate.getMonth()
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
      {/* Add Event Modal */}
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
