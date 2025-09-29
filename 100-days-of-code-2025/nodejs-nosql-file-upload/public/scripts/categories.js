var CATEGORIES = [
  {
    id: 1,
    name: "Family",
  },
  {
    id: 2,
    name: "Friends",
  },
  {
    id: 3,
    name: "Office",
  },
];

function renderTable(categories) {
  const tableEl = document.getElementById("categories-table");
  tableEl.querySelectorAll("tr").forEach((row, index) => {
    if (index > 0) {
      row.remove();
    }
  });

  if (categories.length > 0) {
    for (const category of categories) {
      const editEl = document.createElement("a");
      editEl.innerHTML =
        '<i class="fa-solid fa-pen" style="color: #7f56fb;"></i>';
      const deleteEl = document.createElement("a");
      deleteEl.innerHTML =
        '<i class="fa-solid fa-trash" style="color: #7f56fb;"></i>';
      const row = tableEl.insertRow();
      const nameCol = row.insertCell();
      nameCol.textContent = category.name;
      const actionCol = row.insertCell();
      editEl.setAttribute("href", `/categories/edit`);
      actionCol.append(editEl);
      actionCol.append(deleteEl);

      deleteEl.addEventListener("click", () => {
        if (confirm("Are you sure want to delete this record?")) {
          const updatedContacts = categories.filter((c) => {
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

renderTable(CATEGORIES);

const searchElement = document.getElementById("search");
searchElement.addEventListener("keyup", (e) => {
  const val = e.target.value.trim();
  if (val !== "") {
    const updatedCategories = CATEGORIES.filter((c) => {
      return (
        c.name.toLowerCase().includes(val.toLowerCase()) ||
        c.phone.includes(val)
      );
    });
    renderTable(updatedCategories);
  } else {
    renderTable(CATEGORIES);
  }
});
