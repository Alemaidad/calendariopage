let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    const calendarDays = document.getElementById("calendarDays");
    const monthDisplay = document.getElementById("monthDisplay");

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });
    monthDisplay.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${currentYear}`;
    calendarDays.innerHTML = '';

    const startPaddingDays = (firstDayOfMonth.getDay() + 6) % 7; // Para que lunes sea el primer día
    const totalBoxes = 42; // 6 semanas

    for (let i = 0; i < totalBoxes; i++) {
        const daySquare = document.createElement("div");
        daySquare.classList.add("calendar-day");

        const dayNumber = i - startPaddingDays + 1;

        if (i >= startPaddingDays && dayNumber <= daysInMonth) {
            daySquare.textContent = dayNumber;
        }

        calendarDays.appendChild(daySquare);
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

renderCalendar();


function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// Guardar evento en localStorage
function saveEvent(e) {
  e.preventDefault();
  const form = document.getElementById("eventForm");
  const dateKey = form.dataset.dateKey;

  const newEvent = {
    nombre: document.getElementById("nombre").value,
    fechaEntrada: document.getElementById("fechaEntrada").value,
    horaEntrada: document.getElementById("horaEntrada").value,
    fechaSalida: document.getElementById("fechaSalida").value,
    horaSalida: document.getElementById("horaSalida").value,
    tipo: document.querySelector('input[name="tipo"]:checked').value,
    equipo: document.querySelector('input[name="equipo"]:checked').value
  };

  const events = JSON.parse(localStorage.getItem(dateKey)) || [];
  events.push(newEvent);
  localStorage.setItem(dateKey, JSON.stringify(events));

  alert("Evento guardado exitosamente");
  closeModal("eventFormModal");
  renderCalendar();
  openEventListModal(dateKey); // Actualiza la lista después de guardar
}

// Mostrar eventos en el modal de lista
function openEventListModal(dateKey) {
  const eventList = document.getElementById("eventList");
  const form = document.getElementById("eventForm");
  form.reset();
  form.dataset.dateKey = dateKey;

  const storedEvents = JSON.parse(localStorage.getItem(dateKey)) || [];

  eventList.innerHTML = "";

  if (storedEvents.length > 0) {
    storedEvents.forEach(event => {
      const item = document.createElement("div");
      item.className = "event-list-item";
      item.innerHTML = `
        <strong>${event.nombre}</strong>
        <span>${event.fechaEntrada} - ${event.fechaSalida}</span>
        <span>${event.horaEntrada} - ${event.horaSalida}</span>
      `;
      eventList.appendChild(item);
    });
  } else {
    eventList.innerHTML = "<p>No hay eventos para esta fecha.</p>";
  }

  openModal("eventListModal");
}

// Clic en día del calendario
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("calendar-day") && e.target.textContent.trim() !== "") {
    const selectedDate = new Date(currentYear, currentMonth, parseInt(e.target.textContent));
    const dateKey = selectedDate.toISOString().split("T")[0];
    openEventListModal(dateKey);
  }
});
