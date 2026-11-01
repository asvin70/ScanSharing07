
// ========================================
// SNAPGATHER DASHBOARD
// ========================================

// Get the currently logged-in user
const currentUser = JSON.parse(
    localStorage.getItem("snapGatherCurrentUser") || "null"
);

// Check login
if (!currentUser) {
    window.location.replace("index.php");
} else {
    document.getElementById("profileName").textContent =
        "Welcome, " + currentUser.name;

    document.getElementById("userName").textContent =
        currentUser.name;

    document.getElementById("userEmail").textContent =
        currentUser.email;
}


// ========================================
// LOGOUT
// ========================================


function logout() {

    // Remove only the active login session
    localStorage.removeItem("snapGatherCurrentUser");

    // Redirect to the home/login page
    window.location.href = "index.php";

}



// ========================================
// DARK / LIGHT THEME
// ========================================

function toggleTheme() {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("snapGatherTheme", theme);
}

if (localStorage.getItem("snapGatherTheme") === "dark") {
    document.body.classList.add("dark");
}


// ========================================
// SAFE LOCAL STORAGE
// ========================================

function getEvents() {
    try {
        const events = JSON.parse(
            localStorage.getItem("snapGatherEvents") || "[]"
        );

        return Array.isArray(events) ? events : [];
    } catch (error) {
        console.error("Could not read events:", error);
        return [];
    }
}

function getPhotos() {
    try {
        const photos = JSON.parse(
            localStorage.getItem("snapGatherPhotos") || "{}"
        );

        return photos && typeof photos === "object" &&
            !Array.isArray(photos) ? photos : {};
    } catch (error) {
        console.error("Could not read photos:", error);
        return {};
    }
}


// ========================================
// LOAD MY EVENTS
// ========================================

function loadEvents() {
    const eventList = document.getElementById("eventList");

    if (!currentUser || !eventList) return;

    const allEvents = getEvents();

    // Display only events belonging to this account
    const myEvents = allEvents.filter(event =>
        event.owner === currentUser.email
    );

    eventList.innerHTML = "";

    if (myEvents.length === 0) {
        eventList.innerHTML =
            '<p class="empty">No events created yet. Create your first event!</p>';
        return;
    }

    myEvents.forEach(event => {

        // Main event card
        const item = document.createElement("div");
        item.className = "event-item";

        // Event information
        const info = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = event.name || "Untitled Event";

        const date = document.createElement("p");
        date.textContent = event.date || "Date not set";

        info.appendChild(name);
        info.appendChild(date);

        // Action buttons
        const actions = document.createElement("div");

        actions.style.display = "flex";
        actions.style.alignItems = "center";
        actions.style.flexWrap = "wrap";
        actions.style.gap = "10px";

        // View gallery link
        const viewLink = document.createElement("a");

        viewLink.href =
            "gallery.html?id=" + encodeURIComponent(event.id);

        viewLink.textContent = "View Photos →";

        // Delete event button
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "🗑 Delete";

        deleteButton.style.background = "#fff0f0";
        deleteButton.style.color = "#d9364f";
        deleteButton.style.border = "1px solid #ffd1d8";
        deleteButton.style.padding = "9px 12px";
        deleteButton.style.borderRadius = "8px";
        deleteButton.style.fontWeight = "700";
        deleteButton.style.cursor = "pointer";

        deleteButton.addEventListener("click", () => {
            deleteEvent(event.id);
        });

        actions.appendChild(viewLink);
        actions.appendChild(deleteButton);

        item.appendChild(info);
        item.appendChild(actions);

        eventList.appendChild(item);
    });
}


// ========================================
// DELETE ONE EVENT
// ========================================

function deleteEvent(eventId) {

    if (!currentUser) return;

    // Find the selected event
    const allEvents = getEvents();

    const selectedEvent = allEvents.find(event =>
        event.id === eventId &&
        event.owner === currentUser.email
    );

    // Prevent deleting another user's event
    if (!selectedEvent) {
        alert("Event not found or you do not have permission to delete it.");
        return;
    }

    // Ask before permanent deletion
    const confirmDelete = confirm(
        'Are you sure you want to delete "' +
        (selectedEvent.name || "this event") +
        '"?\n\nThis will permanently delete this event and its uploaded photos.'
    );

    if (!confirmDelete) return;

    try {

        // Remove only the selected event
        const updatedEvents = allEvents.filter(event =>
            event.id !== eventId ||
            event.owner !== currentUser.email
        );

        // Remove only the selected event's photos
        const allPhotos = getPhotos();

        delete allPhotos[eventId];

        // Save updated data
        localStorage.setItem(
            "snapGatherEvents",
            JSON.stringify(updatedEvents)
        );

        localStorage.setItem(
            "snapGatherPhotos",
            JSON.stringify(allPhotos)
        );

        alert("Event and its photos deleted successfully!");

        // Refresh the event list
        loadEvents();

    } catch (error) {

        console.error("Event deletion failed:", error);

        alert(
            "Could not complete deletion. Please check your browser storage."
        );
    }
}


// ========================================
// START DASHBOARD
// ========================================

if (currentUser) {
    loadEvents();
}
