// MiniCart App - Core Utilities
// Handles localStorage, cart operations, and common utilities

class MiniCartApp {
  constructor() {
    this.cartKey = "minicart_cart";
    this.checkoutKey = "minicart_checkout";
    this.wishlistKey = "minicart_wishlist";
    this.recentlyViewedKey = "minicart_recently_viewed";
    this.currency = "INR";
    this.shippingFee = 0;
    this.discount = 0;
  }

  // LocalStorage Helpers
  getCart() {
    try {
      const cart = localStorage.getItem(this.cartKey);
      return cart ? JSON.parse(cart) : this.getEmptyCart();
    } catch (error) {
      console.error("Error loading cart:", error);
      return this.getEmptyCart();
    }
  }

  saveCart(cart) {
    try {
      cart.updatedAt = Date.now();
      localStorage.setItem(this.cartKey, JSON.stringify(cart));
      this.updateCartCount();
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }

  clearCart() {
    try {
      localStorage.removeItem(this.cartKey);
      this.updateCartCount();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }

  getEmptyCart() {
    return {
      items: [],
      currency: this.currency,
      subtotal: 0,
      shippingFee: this.shippingFee,
      discount: this.discount,
      total: 0,
      updatedAt: Date.now(),
    };
  }

  // Cart Operations
  addItem(product, options = {}, qty = 1) {
    const cart = this.getCart();
    const itemId = this.generateItemId(product.id, options);

    // Check if item already exists
    const existingItem = cart.items.find((item) => item.id === itemId);

    if (existingItem) {
      // Update quantity
      existingItem.qty = Math.min(existingItem.qty + qty, product.stock);
    } else {
      // Add new item
      const cartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: Math.min(qty, product.stock),
        options: options,
        thumbnail: product.thumbnail,
        maxStock: product.stock,
      };
      cart.items.push(cartItem);
    }

    this.calculateTotals(cart);
    this.saveCart(cart);
    return cart;
  }

  updateQty(itemId, qty) {
    const cart = this.getCart();
    const item = cart.items.find((item) => item.id === itemId);

    if (item) {
      if (qty <= 0) {
        this.removeItem(itemId);
        return;
      }

      item.qty = Math.min(qty, item.maxStock);
      this.calculateTotals(cart);
      this.saveCart(cart);
    }

    return cart;
  }

  removeItem(itemId) {
    const cart = this.getCart();
    cart.items = cart.items.filter((item) => item.id !== itemId);
    this.calculateTotals(cart);
    this.saveCart(cart);
    return cart;
  }

  calculateTotals(cart) {
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    cart.total = cart.subtotal + cart.shippingFee - cart.discount;
    return cart;
  }

  generateItemId(productId, options) {
    const optionsStr = Object.keys(options)
      .sort()
      .map((key) => `${key}:${options[key]}`)
      .join("|");
    return `${productId}${optionsStr ? `_${optionsStr}` : ""}`;
  }

  // Checkout Data
  getCheckout() {
    try {
      const checkout = localStorage.getItem(this.checkoutKey);
      return checkout ? JSON.parse(checkout) : this.getEmptyCheckout();
    } catch (error) {
      console.error("Error loading checkout:", error);
      return this.getEmptyCheckout();
    }
  }

  saveCheckout(checkout) {
    try {
      localStorage.setItem(this.checkoutKey, JSON.stringify(checkout));
    } catch (error) {
      console.error("Error saving checkout:", error);
    }
  }

  getEmptyCheckout() {
    return {
      shipping: {
        fullName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "IN",
        phone: "",
      },
      billing: {
        sameAsShipping: true,
        fullName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "IN",
        phone: "",
      },
      payment: {
        method: "card",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
      },
      orderId: "",
    };
  }

  // Utility Functions
  formatCurrency(amount, currency = this.currency) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  generateOrderId() {
    const timestamp = Date.now();
    return `MINI-${timestamp}`;
  }

  // Update cart count in header
  updateCartCount() {
    const cart = this.getCart();
    const count = cart.items.reduce((sum, item) => sum + item.qty, 0);
    const countElements = document.querySelectorAll("#miniCartCount");
    countElements.forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? "block" : "none";
    });
  }

  // Recently Viewed Products
  addToRecentlyViewed(productId) {
    try {
      const recentlyViewed = this.getRecentlyViewed();
      const filtered = recentlyViewed.filter((id) => id !== productId);
      filtered.unshift(productId);
      const limited = filtered.slice(0, 10); // Keep only 10 items
      localStorage.setItem(this.recentlyViewedKey, JSON.stringify(limited));
    } catch (error) {
      console.error("Error updating recently viewed:", error);
    }
  }

  getRecentlyViewed() {
    try {
      const recentlyViewed = localStorage.getItem(this.recentlyViewedKey);
      return recentlyViewed ? JSON.parse(recentlyViewed) : [];
    } catch (error) {
      console.error("Error loading recently viewed:", error);
      return [];
    }
  }

  // Wishlist Operations
  addToWishlist(productId) {
    try {
      const wishlist = this.getWishlist();
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  }

  removeFromWishlist(productId) {
    try {
      const wishlist = this.getWishlist();
      const filtered = wishlist.filter((id) => id !== productId);
      localStorage.setItem(this.wishlistKey, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  }

  getWishlist() {
    try {
      const wishlist = localStorage.getItem(this.wishlistKey);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return [];
    }
  }

  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.includes(productId);
  }

  // Validation Helpers
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  }

  validatePostalCode(postalCode, country = "IN") {
    if (country === "IN") {
      return /^\d{6}$/.test(postalCode);
    }
    // Add more country validations as needed
    return /^\d{5,6}$/.test(postalCode);
  }

  validateCardNumber(cardNumber) {
    // Basic Luhn algorithm implementation
    const cleaned = cardNumber.replace(/\D/g, "");
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  validateExpiry(expiry) {
    const [month, year] = expiry.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2)
      return false;

    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();

    return expDate > now;
  }

  validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
  }

  // Debounce function for search
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize app
  init() {
    // Update cart count on page load
    this.updateCartCount();

    // Set current year in footer
    const currentYearElements = document.querySelectorAll("#currentYear");
    currentYearElements.forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }
}

// Create global app instance
window.miniCartApp = new MiniCartApp();

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.miniCartApp.init();
});
