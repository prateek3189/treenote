var CONTACTS = [
  {
    id: 1,
    name: "John Doe",
    phone: "9876543212",
  },
  {
    id: 2,
    name: "John Rambo",
    phone: "8765432123",
  },
  {
    id: 3,
    name: "Rocky Balboa",
    phone: "7654321123",
  },
  {
    id: 4,
    name: "Burney Ross",
    phone: "6543211234",
  },
];

function renderTable(contacts) {
  const tableEl = document.getElementById("contact-table");
  tableEl.querySelectorAll("tr").forEach((row, index) => {
    if (index > 0) {
      row.remove();
    }
  });

  if (contacts.length > 0) {
    for (const contact of contacts) {
      const editEl = document.createElement("a");
      editEl.innerHTML =
        '<i class="fa-solid fa-pen" style="color: #7f56fb;"></i>';
      const deleteEl = document.createElement("a");
      deleteEl.innerHTML =
        '<i class="fa-solid fa-trash" style="color: #7f56fb;"></i>';
      const row = tableEl.insertRow();
      const nameCol = row.insertCell();
      nameCol.textContent = contact.name;
      const phoneCol = row.insertCell();
      phoneCol.textContent = contact.phone;
      const actionCol = row.insertCell();
      editEl.setAttribute("href", `./edit-contact.html?id=${contact.id}`);
      actionCol.append(editEl);
      actionCol.append(deleteEl);

      deleteEl.addEventListener("click", () => {
        if (confirm("Are you sure want to delete this record?")) {
          const updatedContacts = contacts.filter((c) => {
            return c.id !== contact.id;
          });

          renderTable(updatedContacts);
        }
      });
    }
  } else {
    const row = tableEl.insertRow();
    const noRecordCol = row.insertCell();
    noRecordCol.setAttribute("colspan", 3);
    noRecordCol.textContent = "No Record Found";
  }
}

renderTable(CONTACTS);

const searchElement = document.getElementById("search");
searchElement.addEventListener("keyup", (e) => {
  const val = e.target.value.trim();
  if (val !== "") {
    const updatedContacts = CONTACTS.filter((c) => {
      return (
        c.name.toLowerCase().includes(val.toLowerCase()) ||
        c.phone.includes(val)
      );
    });
    renderTable(updatedContacts);
  } else {
    renderTable(CONTACTS);
  }
});
