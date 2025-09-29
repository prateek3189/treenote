// Mobile menu toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const sidebar = document.getElementById("sidebar");
  let backdrop = null;

  // Collapsible list functionality
  function initCollapsibleLists() {
    const listItems = document.querySelectorAll(".item-content");

    listItems.forEach((item) => {
      const parentLi = item.closest("li");
      const childUl = parentLi.querySelector("ul");

      if (childUl) {
        // Add collapsed class by default
        childUl.classList.add("collapsed");

        // Add click handler to the item content
        item.addEventListener("click", function (e) {
          // Don't trigger if clicking on checkbox or add button
          if (
            e.target.type === "checkbox" ||
            e.target.classList.contains("add-button")
          ) {
            return;
          }

          e.preventDefault();
          childUl.classList.toggle("collapsed");

          // Update the parent li and item content to show expanded state
          parentLi.classList.toggle("expanded");
          item.classList.toggle("expanded");
        });

        // Add visual indicator for expandable items
        item.classList.add("expandable");
      }
    });
  }

  // Initialize collapsible lists
  initCollapsibleLists();

  // Drag and drop functionality
  function initDragAndDrop() {
    const itemContainers = document.querySelectorAll(".item-content");

    itemContainers.forEach((item) => {
      item.draggable = true;

      // Add drag handle visual indicator
      item.classList.add("draggable");

      // Drag start
      item.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", "");
        e.dataTransfer.effectAllowed = "move";
        item.classList.add("dragging");

        // Store the dragged element
        e.dataTransfer.setData("text/html", item.outerHTML);
        e.dataTransfer.setData("text/plain", item.textContent.trim());
      });

      // Drag end
      item.addEventListener("dragend", function (e) {
        item.classList.remove("dragging");
        // Remove all drag over classes
        document.querySelectorAll(".drag-over").forEach((el) => {
          el.classList.remove("drag-over");
        });
      });

      // Drag over
      item.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        item.classList.add("drag-over");
      });

      // Drag leave
      item.addEventListener("dragleave", function (e) {
        item.classList.remove("drag-over");
      });

      // Drop
      item.addEventListener("drop", function (e) {
        e.preventDefault();
        item.classList.remove("drag-over");

        const draggedElement = document.querySelector(".dragging");
        if (draggedElement && draggedElement !== item) {
          const parentLi = item.closest("li");
          const draggedLi = draggedElement.closest("li");

          // Check if we're dropping on a different level
          const draggedParent = draggedLi.parentNode;
          const targetParent = parentLi.parentNode;

          // Only allow reordering within the same level
          if (draggedParent === targetParent) {
            // Insert the dragged element before the current element
            targetParent.insertBefore(draggedLi, parentLi);
          }
        }
      });
    });
  }

  // Initialize drag and drop
  initDragAndDrop();

  // Function to reinitialize drag and drop for new items
  function reinitDragAndDrop() {
    // Remove existing drag listeners
    document.querySelectorAll(".item-content").forEach((item) => {
      item.draggable = false;
      item.classList.remove("draggable", "dragging", "drag-over");
    });

    // Reinitialize
    initDragAndDrop();
  }

  // Make reinitDragAndDrop available globally for future use
  window.reinitDragAndDrop = reinitDragAndDrop;

  function createBackdrop() {
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      document.body.appendChild(backdrop);

      // Add click listener to backdrop
      backdrop.addEventListener("click", function () {
        closeSidebar();
      });
    }
    backdrop.classList.add("active");
    return backdrop;
  }

  function removeBackdrop() {
    if (backdrop) {
      backdrop.classList.remove("active");
      // Remove backdrop after transition
      setTimeout(() => {
        if (backdrop && !backdrop.classList.contains("active")) {
          backdrop.remove();
          backdrop = null;
        }
      }, 300);
    }
  }

  function openSidebar() {
    sidebar.classList.add("mobile-open");
    mobileMenuToggle.classList.add("active");
    document.body.classList.add("sidebar-open");
    createBackdrop();
  }

  function closeSidebar() {
    sidebar.classList.remove("mobile-open");
    mobileMenuToggle.classList.remove("active");
    document.body.classList.remove("sidebar-open");
    removeBackdrop();
  }

  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (sidebar.classList.contains("mobile-open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    // Close sidebar when clicking outside on mobile (excluding backdrop which has its own handler)
    document.addEventListener("click", function (event) {
      if (window.innerWidth <= 767) {
        if (
          !sidebar.contains(event.target) &&
          !mobileMenuToggle.contains(event.target) &&
          !backdrop?.contains(event.target)
        ) {
          closeSidebar();
        }
      }
    });

    // Handle window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 767) {
        closeSidebar();
      }
    });
  }
});
