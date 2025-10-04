// MiniCart Cart Page - Shopping cart management
// Handles cart display, quantity updates, and item removal

class CartPage {
  constructor() {
    this.cart = null;
  }

  async init() {
    try {
      this.loadCart();
      this.setupEventListeners();
      this.renderCart();
    } catch (error) {
      console.error("Error initializing cart page:", error);
      uiManager.showToast("Failed to load cart", "error");
    }
  }

  loadCart() {
    this.cart = miniCartApp.getCart();
  }

  setupEventListeners() {
    // Quantity update buttons
    uiManager.qsa(".qty-update").forEach((btn) => {
      uiManager.on(btn, "click", (e) => {
        const itemId = e.target.dataset.itemId;
        const action = e.target.dataset.action;
        this.updateQuantity(itemId, action);
      });
    });

    // Quantity input changes
    uiManager.qsa(".qty-input").forEach((input) => {
      uiManager.on(
        input,
        "input",
        uiManager.debounce((e) => {
          const itemId = e.target.dataset.itemId;
          const qty = parseInt(e.target.value) || 1;
          this.setQuantity(itemId, qty);
        }, 300)
      );
    });

    // Remove item buttons
    uiManager.qsa(".remove-btn").forEach((btn) => {
      uiManager.on(btn, "click", (e) => {
        const itemId = e.target.dataset.itemId;
        this.removeItem(itemId);
      });
    });

    // Checkout button
    const checkoutBtn = uiManager.qs("#btnCheckout");
    if (checkoutBtn) {
      uiManager.on(checkoutBtn, "click", () => {
        this.proceedToCheckout();
      });
    }

    // Continue shopping button
    const continueBtn = uiManager.qs(".btn-outline");
    if (continueBtn && continueBtn.textContent.includes("Continue Shopping")) {
      uiManager.on(continueBtn, "click", () => {
        window.location.href = "index.html";
      });
    }
  }

  renderCart() {
    if (!this.cart?.items.length) {
      this.renderEmptyCart();
      return;
    }

    this.renderCartItems();
    this.renderCartSummary();
    this.updateCheckoutButton();
  }

  renderEmptyCart() {
    const cartList = uiManager.qs("#cartList");
    const emptyCart = uiManager.qs("#emptyCart");
    const cartSummary = uiManager.qs(".cart-summary");

    if (cartList) cartList.style.display = "none";
    if (emptyCart) emptyCart.style.display = "block";
    if (cartSummary) cartSummary.style.display = "none";
  }

  renderCartItems() {
    const cartList = uiManager.qs("#cartList");
    const emptyCart = uiManager.qs("#emptyCart");
    const cartSummary = uiManager.qs(".cart-summary");

    if (!cartList) return;

    // Show cart content
    cartList.style.display = "block";
    if (emptyCart) emptyCart.style.display = "none";
    if (cartSummary) cartSummary.style.display = "block";

    cartList.innerHTML = "";

    this.cart.items.forEach((item) => {
      const cartItem = this.createCartItem(item);
      cartList.appendChild(cartItem);
    });
  }

  createCartItem(item) {
    const cartItem = uiManager.createEl("div", "cart-item");
    cartItem.dataset.itemId = item.id;

    // Product image
    const image = uiManager.createEl("img", "cart-item-image");
    image.src = item.thumbnail;
    image.alt = item.name;
    image.loading = "lazy";

    // Product info
    const info = uiManager.createEl("div", "cart-item-info");

    const title = uiManager.createEl("h3", "", item.name);

    const options = uiManager.createEl("div", "cart-item-options");
    if (item.options && Object.keys(item.options).length > 0) {
      const optionsText = Object.entries(item.options)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      options.textContent = optionsText;
    } else {
      options.textContent = "Standard";
    }

    const price = uiManager.createEl("div", "cart-item-price");
    price.textContent = miniCartApp.formatCurrency(item.price);

    info.appendChild(title);
    info.appendChild(options);
    info.appendChild(price);

    // Quantity controls
    const qtyContainer = uiManager.createEl("div", "cart-item-qty");

    const qtyMinus = uiManager.createEl("button", "qty-btn qty-update", "-");
    qtyMinus.dataset.itemId = item.id;
    qtyMinus.dataset.action = "decrease";
    qtyMinus.disabled = item.qty <= 1;

    const qtyInput = uiManager.createEl("input", "qty-input");
    qtyInput.type = "number";
    qtyInput.value = item.qty;
    qtyInput.min = 1;
    qtyInput.max = item.maxStock;
    qtyInput.dataset.itemId = item.id;

    const qtyPlus = uiManager.createEl("button", "qty-btn qty-update", "+");
    qtyPlus.dataset.itemId = item.id;
    qtyPlus.dataset.action = "increase";
    qtyPlus.disabled = item.qty >= item.maxStock;

    qtyContainer.appendChild(qtyMinus);
    qtyContainer.appendChild(qtyInput);
    qtyContainer.appendChild(qtyPlus);

    // Actions
    const actions = uiManager.createEl("div", "cart-item-actions");

    const total = uiManager.createEl("div", "cart-item-total");
    total.textContent = miniCartApp.formatCurrency(item.price * item.qty);

    const removeBtn = uiManager.createEl("button", "remove-btn", "Remove");
    removeBtn.dataset.itemId = item.id;

    actions.appendChild(total);
    actions.appendChild(removeBtn);

    cartItem.appendChild(image);
    cartItem.appendChild(info);
    cartItem.appendChild(qtyContainer);
    cartItem.appendChild(actions);

    return cartItem;
  }

  renderCartSummary() {
    const subtotal = uiManager.qs("#cartSubtotal");
    const shipping = uiManager.qs("#cartShipping");
    const discount = uiManager.qs("#cartDiscount");
    const total = uiManager.qs("#cartTotal");
    const discountRow = uiManager.qs("#discountRow");

    if (subtotal) {
      subtotal.textContent = miniCartApp.formatCurrency(this.cart.subtotal);
    }

    if (shipping) {
      shipping.textContent = miniCartApp.formatCurrency(this.cart.shippingFee);
    }

    if (discount) {
      discount.textContent = miniCartApp.formatCurrency(this.cart.discount);
    }

    if (total) {
      total.textContent = miniCartApp.formatCurrency(this.cart.total);
    }

    if (discountRow) {
      discountRow.style.display = this.cart.discount > 0 ? "flex" : "none";
    }
  }

  updateQuantity(itemId, action) {
    const item = this.cart.items.find((item) => item.id === itemId);
    if (!item) return;

    let newQty = item.qty;

    if (action === "increase") {
      newQty = Math.min(item.qty + 1, item.maxStock);
    } else if (action === "decrease") {
      newQty = Math.max(item.qty - 1, 1);
    }

    this.setQuantity(itemId, newQty);
  }

  setQuantity(itemId, qty) {
    const cart = miniCartApp.updateQty(itemId, qty);
    if (cart) {
      this.cart = cart;
      this.renderCart();
      uiManager.showToast("Cart updated", "success");
    }
  }

  removeItem(itemId) {
    const item = this.cart.items.find((item) => item.id === itemId);
    if (!item) return;

    // Show confirmation dialog
    const confirmMsg = `Remove "${item.name}" from cart?`;
    if (confirm(confirmMsg)) {
      const cart = miniCartApp.removeItem(itemId);
      if (cart) {
        this.cart = cart;
        this.renderCart();
        uiManager.showToast("Item removed from cart", "success");
      }
    }
  }

  updateCheckoutButton() {
    const checkoutBtn = uiManager.qs("#btnCheckout");
    if (!checkoutBtn) return;

    const hasItems = this.cart && this.cart.items.length > 0;
    checkoutBtn.disabled = !hasItems;

    if (hasItems) {
      checkoutBtn.textContent = "Proceed to Checkout";
    } else {
      checkoutBtn.textContent = "Cart is Empty";
    }
  }

  proceedToCheckout() {
    if (!this.cart || this.cart.items.length === 0) {
      uiManager.showToast("Your cart is empty", "error");
      return;
    }

    window.location.href = "checkout.html#shipping";
  }

  // Public methods
  getCart() {
    return this.cart;
  }

  async refreshCart() {
    this.loadCart();
    this.renderCart();
  }

  clearCart() {
    miniCartApp.clearCart();
    this.loadCart();
    this.renderCart();
  }
}

// Initialize cart page when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if we're on the cart page
  if (window.location.pathname.includes("trip-cart.html")) {
    window.cartPage = new CartPage();
    window.cartPage.init();
  }
});
