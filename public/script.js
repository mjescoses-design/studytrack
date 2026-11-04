const form = document.getElementById("session-form");
const list = document.getElementById("session-list");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

let editingId = null; // null means "adding", an id means "editing"

function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} hr`;
    return `${h} hr ${m} min`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
    });
}

function makeEl(tag, text, className) {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    return el;
}

// Dashboard: calculate totals from the sessions list
function updateDashboard(sessions) {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    document.getElementById("total-sessions").textContent = sessions.length;
    document.getElementById("total-time").textContent = formatDuration(totalMinutes);

    const bySubject = {};
    sessions.forEach((s) => {
        bySubject[s.subject] = (bySubject[s.subject] || 0) + s.duration;
    });

    let top = "-";
    let max = 0;
    for (const subject in bySubject) {
        if (bySubject[subject] > max) {
            max = bySubject[subject];
            top = subject;
        }
    }
    document.getElementById("top-subject").textContent = top;
}

// READ: fetch all sessions and show them
async function loadSessions() {
    const res = await fetch("/api/sessions");
    const sessions = await res.json();
    updateDashboard(sessions);
    list.innerHTML = "";

    if (sessions.length === 0) {
        list.appendChild(makeEl("p", "No study sessions yet."));
        return;
    }

    sessions.forEach((s) => {
        const div = document.createElement("div");
        div.className = "session";

        div.appendChild(makeEl("h3", `${s.subject} - ${s.topic}`));
        div.appendChild(makeEl("p", `${formatDuration(s.duration)} | ${formatDate(s.date)}`));
        if (s.notes) div.appendChild(makeEl("p", s.notes));

        const editBtn = makeEl("button", "Edit");
        editBtn.addEventListener("click", () => startEdit(s));

        const deleteBtn = makeEl("button", "Delete", "delete");
        deleteBtn.addEventListener("click", () => deleteSession(s._id));

        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        list.appendChild(div);
    });
}

// Put a session's values into the form so it can be edited
function startEdit(s) {
    editingId = s._id;
    document.getElementById("subject").value = s.subject;
    document.getElementById("topic").value = s.topic;
    document.getElementById("duration").value = s.duration;
    document.getElementById("date").value = s.date.slice(0, 10);
    document.getElementById("notes").value = s.notes || "";
    formTitle.textContent = "Edit Study Session";
    submitBtn.textContent = "Update Session";
    cancelBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
    editingId = null;
    form.reset();
    formTitle.textContent = "Add Study Session";
    submitBtn.textContent = "Add Session";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

// CREATE or UPDATE: runs when the form is submitted
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        subject: document.getElementById("subject").value,
        topic: document.getElementById("topic").value,
        duration: Number(document.getElementById("duration").value),
        date: document.getElementById("date").value,
        notes: document.getElementById("notes").value
    };

    const url = editingId ? `/api/sessions/${editingId}` : "/api/sessions";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        alert("Something went wrong. Please check your inputs.");
        return;
    }

    resetForm();
    loadSessions();
});

// DELETE: remove one session
async function deleteSession(id) {
    if (!confirm("Delete this study session?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    loadSessions();
}

loadSessions();