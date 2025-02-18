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
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [inlineEditingEventId, setInlineEditingEventId] = useState(null);
  const [inlineEditingTitle, setInlineEditingTitle] = useState("");

  const [showOptions, setShowOptions] = useState(null);

  const eventBoxRef = useRef(null);

  const saveEvents = (updatedEvents) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEditEventModal(true);
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    if (editingEvent.startTime >= editingEvent.endTime) {
      alert("Start time must be earlier than end time.");
      return;
    }
    try {
      const response = await axios.put(
        "https://couplespace.onrender.com/api/v1/couples/edit-event",
        {
          eventId: editingEvent._id,
          title: editingEvent.title,
          description: editingEvent.description,
          date: editingEvent.date,
          startTime: editingEvent.startTime,
          endTime: editingEvent.endTime,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEventsArr((prevEvents) =>
          prevEvents.map((e) =>
            e._id === editingEvent._id ? response.data.updatedEvent : e
          )
        );
        setShowEditEventModal(false);
        setEditingEvent(null);
        // alert("Event Updated")
        window.location.reload();
        console.log('reloaded');
      }
      // if (response.status === 200) {
      //   setEventsArr((prev) => [...prev, response.data]);
      //   console.log("Event added:", response.data);
      // }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Please try again.");
    }
    // window.location.reload()
  };

  const handleInlineEdit = (event) => {
    setInlineEditingEventId(event._id);
    setInlineEditingTitle(event.title);
  };

  const handleInlineSave = async (event) => {
    try {
      const response = await axios.put(
        "https://couplespace.onrender.com/api/v1/couples/edit-event",
        {
          eventId: event._id,
          title: inlineEditingTitle,
          description: event.description,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEventsArr((prevEvents) =>
          prevEvents.map((e) =>
            e._id === event._id ? response.data.updatedEvent : e
          )
        );
        setInlineEditingEventId(null);
        setInlineEditingTitle("");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Please try again.");
    }
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://couplespace.onrender.com/api/v1/couples/get-events', { withCredentials: true });
        if (response.status === 200) {
          // Filter out invalid events
          const validEvents = response.data.data.filter(event => event?.date);
          setEventsArr(validEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
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
      description: "",
      date: date.toISOString(),
      startTime,
      endTime
    };

    try {
      const response = await axios.post(
        'https://couplespace.onrender.com/api/v1/couples/add-event',
        eventData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEventsArr((prev) => [...prev, response.data]);
        console.log("Event added:", response.data);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Please try again.");
    }
    window.location.reload()
  };

  const removeEvent = async (event) => {
    try {
      const eventData = {
        eventId: event._id
      };
      const response = await axios.post(
        'https://couplespace.onrender.com/api/v1/couples/delete-event',
        eventData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEventsArr((prevEvents) => prevEvents.filter((e) => e._id !== event._id));
        console.log("Event deleted:", event._id);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event. Please try again.");
    }
  };

  const eventsForActiveDay = eventsArr.filter(
    (event) =>
      event && // Check if event exists
      event.date && // Check if event.date exists
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
        event?.date && // Check if event and event.date exist
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

      {/* Edit Event Modal */}
      {showEditEventModal && editingEvent && (
        <div className="edit-event-modal">
          <div className="modal-content">
            <h3>Edit Event</h3>
            <form onSubmit={updateEvent}>
              <div className="form-group">
                <label htmlFor="editEventTitle">Event Title</label>
                <input
                  type="text"
                  id="editEventTitle"
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editEventDescription">Description</label>
                <textarea
                  id="editEventDescription"
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, description: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="editEventDate">Date</label>
                <input
                  type="date"
                  id="editEventDate"
                  value={editingEvent.date.split("T")[0]}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editEventStartTime">Start Time</label>
                <input
                  type="time"
                  id="editEventStartTime"
                  value={editingEvent.startTime}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, startTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editEventEndTime">End Time</label>
                <input
                  type="time"
                  id="editEventEndTime"
                  value={editingEvent.endTime}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, endTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn-calendar">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn-calendar"
                  onClick={() => setShowEditEventModal(false)}
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
                        {inlineEditingEventId === event._id ? (
                          <input
                            type="text"
                            value={inlineEditingTitle}
                            onChange={(e) => setInlineEditingTitle(e.target.value)}
                          />
                        ) : (
                          <h3 className="event-title">{event.title}</h3>
                        )}
                      </div>
                      <div className="event-time">{event.time}</div>
                    </div>
                    <div className="event-actions">
                      {inlineEditingEventId === event._id ? (
                        <button onClick={() => handleInlineSave(event)} className="save">
                          Save
                        </button>
                      ) : (
                        <button onClick={() => handleInlineEdit(event)} className="edit">
                          Edit
                        </button>
                      )}
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