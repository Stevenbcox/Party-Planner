// A user enters the website and finds a list of the names, dates, times, locations, and descriptions of all the parties 
// that are happening. Next to each party in the list is a delete button. The user clicks the delete button for one of the
// parties. That party is then removed from the list. There is also a form that allows the user to enter information
// about a new party that they want to schedule. After filling out the form and submitting it, the user observes their 
// party added to the list of parties.

const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-ftb-et-pt';
const state = { events: [] };

const getEvents = async () => {
    try {
        const response = await fetch(`${API_URL}/events`);
        const events = await response.json();
        return events.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const addEvent = async (eventData) => {
    try {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
        });
        const json = await response.json();
        if (json.error) throw new Error(json.error.message);
    } catch (e) {
        console.error(e);
    }
}; // sends a new event's data to the API to create it and handles any potential errors.

const deleteEvents = async (id) => {
    try {
        await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
        renderPage();
    } catch (e) {
        console.error(e);
    }
};

const createEventsItem = (event) => {
    const eventsRow = document.createElement('tr');
    eventsRow.classList.add('events_item');

    const eventsName = document.createElement('td');
    eventsName.textContent = event.name;

    const eventsDate = document.createElement('td');
    eventsDate.textContent = new Date(event.date).toLocaleDateString();

    const eventsTime = document.createElement('td');
    eventsTime.textContent = new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // extracts the time portion of the date and makes it readable

    const eventsLocation = document.createElement('td');
    eventsLocation.textContent = event.location;

    const eventsDescription = document.createElement('td');
    eventsDescription.textContent = event.description;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete event';
    deleteButton.addEventListener('click', () => deleteEvents(event.id));

    eventsRow.append(eventsName, eventsDate, eventsTime, eventsLocation, eventsDescription, deleteButton);
    return eventsRow;
};

const renderPage = async () => {
    const eventsContainer = document.getElementById('events-container');
    while (eventsContainer.firstChild) {
        eventsContainer.removeChild(eventsContainer.firstChild);
    }
    const events = await getEvents();
    state.events = events;
    state.events.forEach((event) => eventsContainer.appendChild(createEventsItem(event)));
};

const form = document.getElementById('party-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const dateTime = new Date(`${date}T${time}:00`).toISOString(); // Adding the T between the two it will separate the date from the time

    const newEvent = {
        name: document.getElementById('name').value,
        date: dateTime,
        location: document.getElementById('location').value,
        description: document.getElementById('desc').value,
    };

    if (Object.values(newEvent).some((value) => !value.trim())) {
        alert('All fields are required!'); // If any of the fields are empty, it will show an alert
        return;
    }

    await addEvent(newEvent);
    renderPage();
});

renderPage();
