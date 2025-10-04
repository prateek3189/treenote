// My Orders Page JavaScript

// Sample orders data - in a real app, this would come from an API
const sampleOrders = [
  {
    id: "ORD-001",
    orderNumber: "MINI-1234567890",
    date: "2024-01-15",
    status: "delivered",
    total: 3498,
    items: [
      {
        name: "Wireless Bluetooth Headphones",
        image: "/assets/placeholder.png",
        qty: 1,
        price: 2499,
      },
      {
        name: "Classic White Tee",
        image: "/assets/placeholder.png",
        qty: 2,
        price: 599,
      },
    ],
    shippingAddress: "123 Main St, Mumbai, Maharashtra 400001",
  },
  {
    id: "ORD-002",
    orderNumber: "MINI-1234567891",
    date: "2024-01-12",
    status: "shipped",
    total: 2198,
    items: [
      {
        name: "Denim Jacket",
        image: "/assets/placeholder.png",
        qty: 1,
        price: 1299,
      },
      {
        name: "Canvas Sneakers",
        image: "/assets/placeholder.png",
        qty: 1,
        price: 1599,
      },
    ],
    shippingAddress: "456 Park Ave, Delhi, Delhi 110001",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-003",
    orderNumber: "MINI-1234567892",
    date: "2024-01-10",
    status: "pending",
    total: 1298,
    items: [
      {
        name: "Organic Green Tea",
        image: "/assets/placeholder.png",
        qty: 2,
        price: 299,
      },
      {
        name: "Leather Wallet",
        image: "/assets/placeholder.png",
        qty: 1,
        price: 799,
      },
    ],
    shippingAddress: "789 Garden Rd, Bangalore, Karnataka 560001",
  },
  {
    id: "ORD-004",
    orderNumber: "MINI-1234567893",
    date: "2024-01-08",
    status: "delivered",
    total: 8999,
    items: [
      {
        name: "Smart Fitness Watch",
        image: "/assets/placeholder.png",
        qty: 1,
        price: 8999,
      },
    ],
    shippingAddress: "321 Tech Park, Pune, Maharashtra 411001",
  },
  {
    id: "ORD-005",
    orderNumber: "MINI-1234567894",
    date: "2024-01-05",
    status: "cancelled",
    total: 1798,
    items: [
      {
        name: "Artisan Coffee Beans",
        image: "/assets/placeholder.png",
        qty: 1,
        price: 899,
      },
      {
        name: "Ceramic Coffee Mug",
        image: "/assets/placeholder.png",
        qty: 1,
        price: 399,
      },
    ],
    shippingAddress: "654 Beach Rd, Goa, Goa 403001",
  },
];

let currentFilter = "all";
let currentSort = "newest";

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  initializeOrders();
  setupEventListeners();
  updateSummaryStats();
});

function initializeOrders() {
  displayOrders(sampleOrders);
}

function setupEventListeners() {
  // Filter tabs
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"));
      // Add active class to clicked tab
      this.classList.add("active");

      currentFilter = this.dataset.filter;
      filterAndDisplayOrders();
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById("sortOrders");
  sortSelect.addEventListener("change", function () {
    currentSort = this.value;
    filterAndDisplayOrders();
  });

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    filterAndDisplayOrders();
  });
}

function filterAndDisplayOrders() {
  let filteredOrders = [...sampleOrders];

  // Filter by status
  if (currentFilter !== "all") {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === currentFilter
    );
  }

  // Search filter
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm))
    );
  }

  // Sort orders
  filteredOrders.sort((a, b) => {
    switch (currentSort) {
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "amount-high":
        return b.total - a.total;
      case "amount-low":
        return a.total - b.total;
      default:
        return 0;
    }
  });

  displayOrders(filteredOrders);
}

function displayOrders(orders) {
  const ordersList = document.getElementById("ordersList");
  const emptyOrders = document.getElementById("emptyOrders");

  if (orders.length === 0) {
    ordersList.style.display = "none";
    emptyOrders.style.display = "block";
    return;
  }

  ordersList.style.display = "block";
  emptyOrders.style.display = "none";

  ordersList.innerHTML = orders.map((order) => createOrderCard(order)).join("");

  // Add event listeners to order action buttons
  addOrderActionListeners();
}

function createOrderCard(order) {
  const statusText = {
    pending: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const statusIcon = {
    pending: "⏳",
    shipped: "🚚",
    delivered: "✅",
    cancelled: "❌",
  };

  const itemsHtml = order.items
    .map(
      (item) => `
    <div class="order-item">
      <img src="${item.image}" alt="${item.name}" class="order-item-image" />
      <div class="order-item-name">${item.name}</div>
      <div class="order-item-qty">Qty: ${item.qty}</div>
    </div>
  `
    )
    .join("");

  const actionsHtml = getOrderActions(order);

  return `
    <div class="order-card" data-order-id="${order.id}">
      <div class="order-header">
        <div class="order-info">
          <h3>${order.orderNumber}</h3>
          <div class="order-meta">
            <span>Ordered on ${formatDate(order.date)}</span>
            <span>${order.items.length} item${
    order.items.length > 1 ? "s" : ""
  }</span>
          </div>
        </div>
        <div class="order-status ${order.status}">
          <span>${statusIcon[order.status]}</span>
          <span>${statusText[order.status]}</span>
        </div>
      </div>
      
      <div class="order-details">
        <div class="order-items">
          ${itemsHtml}
        </div>
        <div class="order-summary-info">
          <div class="order-total">₹${order.total.toLocaleString()}</div>
          <div class="order-shipping">${order.shippingAddress}</div>
        </div>
      </div>
      
      <div class="order-actions">
        ${actionsHtml}
      </div>
    </div>
  `;
}

function getOrderActions(order) {
  let actions = `
    <button class="btn btn-view-details" data-action="view" data-order-id="${order.id}">
      View Details
    </button>
  `;

  if (order.status === "shipped") {
    actions += `
      <button class="btn btn-track" data-action="track" data-order-id="${order.id}">
        Track Package
      </button>
    `;
  }

  if (order.status === "delivered") {
    actions += `
      <button class="btn btn-reorder" data-action="reorder" data-order-id="${order.id}">
        Reorder
      </button>
    `;
  }

  return actions;
}

function addOrderActionListeners() {
  const actionButtons = document.querySelectorAll("[data-action]");
  actionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const action = this.dataset.action;
      const orderId = this.dataset.orderId;
      const order = sampleOrders.find((o) => o.id === orderId);

      handleOrderAction(action, order);
    });
  });
}

function handleOrderAction(action, order) {
  switch (action) {
    case "view":
      showOrderDetails(order);
      break;
    case "track":
      trackOrder(order);
      break;
    case "reorder":
      reorderItems(order);
      break;
  }
}

function showOrderDetails(order) {
  // In a real app, this would open a modal or navigate to order details page
  showToast(`Order details for ${order.orderNumber}`, "info");
}

function trackOrder(order) {
  // In a real app, this would open tracking page or modal
  showToast(
    `Tracking ${order.orderNumber} - Tracking number: ${order.trackingNumber}`,
    "success"
  );
}

function reorderItems(order) {
  // In a real app, this would add items to cart
  showToast(
    `Added ${order.items.length} item${
      order.items.length > 1 ? "s" : ""
    } to cart`,
    "success"
  );

  // Update cart count (simulate adding to cart)
  const cartCount = document.getElementById("miniCartCount");
  const currentCount = parseInt(cartCount.textContent) || 0;
  cartCount.textContent = currentCount + order.items.length;
}

function updateSummaryStats() {
  const totalOrders = sampleOrders.length;
  const pendingOrders = sampleOrders.filter(
    (order) => order.status === "pending"
  ).length;
  const completedOrders = sampleOrders.filter(
    (order) => order.status === "delivered"
  ).length;

  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("pendingOrders").textContent = pendingOrders;
  document.getElementById("completedOrders").textContent = completedOrders;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
