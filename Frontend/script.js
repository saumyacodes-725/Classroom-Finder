const API_URL = "http://localhost:5000/records";

// Load all records when page opens
document.addEventListener("DOMContentLoaded", loadRecords);

async function loadRecords() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const tbody = document.getElementById("records-body");
  tbody.innerHTML = "";

  data.forEach(record => {
    const row = `
      <tr>
        <td>${record.id}</td>
        <td>${record.name}</td>
        <td>${record.role}</td>
        <td>${record.email}</td>
        <td><button class="delete-btn" onclick="deleteRecord(${record.id})">Delete</button></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

async function addRecord() {
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role, email })
  });

  if (res.ok) {
    loadRecords();
    document.getElementById("name").value = "";
    document.getElementById("role").value = "";
    document.getElementById("email").value = "";
  }
}

async function deleteRecord(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadRecords();
}
