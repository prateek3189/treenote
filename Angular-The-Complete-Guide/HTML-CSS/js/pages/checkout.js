// MiniCart Checkout Page - Multi-step checkout process
// Handles shipping, billing, payment, and confirmation steps

class CheckoutPage {
  constructor() {
    this.currentStep = "shipping";
    this.checkoutData = null;
    this.cart = null;
    this.orderId = null;
  }

  async init() {
    try {
      // Check if cart has items
      this.cart = miniCartApp.getCart();
      if (!this.cart || this.cart.items.length === 0) {
        uiManager.showToast("Your cart is empty", "error");
        setTimeout(() => (window.location.href = "index.html"), 2000);
        return;
      }

      // Load checkout data
      this.loadCheckoutData();

      // Handle hash navigation
      this.handleHashNavigation();

      // Setup event listeners
      this.setupEventListeners();

      // Render initial step
      this.showStep(this.currentStep);
    } catch (error) {
      console.error("Error initializing checkout page:", error);
      uiManager.showToast("Failed to load checkout", "error");
    }
  }

  loadCheckoutData() {
    this.checkoutData = miniCartApp.getCheckout();
    this.populateForms();
  }

  populateForms() {
    // Populate shipping form
    this.populateForm("shipping", this.checkoutData.shipping);

    // Populate billing form
    this.populateForm("billing", this.checkoutData.billing);

    // Populate payment form
    this.populateForm("payment", this.checkoutData.payment);
  }

  populateForm(step, data) {
    Object.keys(data).forEach((field) => {
      const element = uiManager.qs(
        `#${step}${field.charAt(0).toUpperCase() + field.slice(1)}`
      );
      if (element && data[field]) {
        element.value = data[field];
      }
    });
  }

  setupEventListeners() {
    // Hash change listener
    window.addEventListener("hashchange", () => this.handleHashNavigation());

    // Shipping form
    this.setupShippingListeners();

    // Billing form
    this.setupBillingListeners();

    // Payment form
    this.setupPaymentListeners();

    // Step navigation buttons
    this.setupStepNavigation();
  }

  setupShippingListeners() {
    const form = uiManager.qs("#shippingForm");
    if (!form) return;

    // Real-time validation
    const fields = uiManager.qsa("#shippingForm input, #shippingForm select");
    fields.forEach((field) => {
      uiManager.on(field, "blur", () => this.validateShippingField(field));
    });

    // Next button
    const nextBtn = uiManager.qs("#btnNextShipping");
    if (nextBtn) {
      uiManager.on(nextBtn, "click", () => this.nextStep("billing"));
    }
  }

  setupBillingListeners() {
    const form = uiManager.qs("#billingForm");
    if (!form) return;

    // Same as shipping checkbox
    const sameAsShipping = uiManager.qs("#sameAsShipping");
    if (sameAsShipping) {
      uiManager.on(sameAsShipping, "change", (e) => {
        this.toggleBillingFields(!e.target.checked);
      });

      // Initialize state
      this.toggleBillingFields(!sameAsShipping.checked);
    }

    // Back button
    const backBtn = uiManager.qs("#btnBackBilling");
    if (backBtn) {
      uiManager.on(backBtn, "click", () => this.previousStep("shipping"));
    }

    // Next button
    const nextBtn = uiManager.qs("#btnNextBilling");
    if (nextBtn) {
      uiManager.on(nextBtn, "click", () => this.nextStep("payment"));
    }

    // Real-time validation for billing fields
    const billingFields = uiManager.qsa(
      "#billingFields input, #billingFields select"
    );
    billingFields.forEach((field) => {
      uiManager.on(field, "blur", () => this.validateBillingField(field));
    });
  }

  setupPaymentListeners() {
    const form = uiManager.qs("#paymentForm");
    if (!form) return;

    // Payment method change
    const paymentMethods = uiManager.qsa('input[name="paymentMethod"]');
    paymentMethods.forEach((radio) => {
      uiManager.on(radio, "change", (e) => {
        this.togglePaymentFields(e.target.value);
      });
    });

    // Back button
    const backBtn = uiManager.qs("#btnBackPayment");
    if (backBtn) {
      uiManager.on(backBtn, "click", () => this.previousStep("billing"));
    }

    // Place order button
    const placeOrderBtn = uiManager.qs("#btnPlaceOrder");
    if (placeOrderBtn) {
      uiManager.on(placeOrderBtn, "click", (e) => {
        e.preventDefault();
        this.placeOrder();
      });
    }

    // Real-time validation for payment fields
    const paymentFields = uiManager.qsa("#cardFields input");
    paymentFields.forEach((field) => {
      uiManager.on(field, "blur", () => this.validatePaymentField(field));
    });

    // Format card number
    const cardNumber = uiManager.qs("#cardNumber");
    if (cardNumber) {
      uiManager.on(cardNumber, "input", (e) => {
        this.formatCardNumber(e.target);
      });
    }

    // Format expiry
    const cardExpiry = uiManager.qs("#cardExpiry");
    if (cardExpiry) {
      uiManager.on(cardExpiry, "input", (e) => {
        this.formatExpiry(e.target);
      });
    }
  }

  setupStepNavigation() {
    // Handle step clicks in stepper
    const stepper = uiManager.qs("#stepper");
    if (stepper) {
      uiManager.on(stepper, "click", (e) => {
        const step = e.target.closest(".stepper-step");
        if (step) {
          const stepName = step.dataset.step;
          if (this.canNavigateToStep(stepName)) {
            this.showStep(stepName);
          }
        }
      });
    }
  }

  handleHashNavigation() {
    const hash = window.location.hash.substring(1);
    const validSteps = ["shipping", "billing", "payment", "confirmation"];

    if (validSteps.includes(hash)) {
      this.currentStep = hash;
    } else {
      this.currentStep = "shipping";
      window.location.hash = "#shipping";
    }

    this.showStep(this.currentStep);
  }

  showStep(stepName) {
    this.currentStep = stepName;
    window.location.hash = `#${stepName}`;

    uiManager.showStep(stepName);

    // Load step-specific data
    if (stepName === "confirmation" && this.orderId) {
      this.renderConfirmation();
    }
  }

  canNavigateToStep(targetStep) {
    const stepOrder = ["shipping", "billing", "payment", "confirmation"];
    const currentIndex = stepOrder.indexOf(this.currentStep);
    const targetIndex = stepOrder.indexOf(targetStep);

    // Can only go forward if previous steps are valid
    if (targetIndex > currentIndex) {
      return this.validateCurrentStep();
    }

    return true; // Can always go backward
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case "shipping":
        return this.validateShippingForm();
      case "billing":
        return this.validateBillingForm();
      case "payment":
        return this.validatePaymentForm();
      default:
        return true;
    }
  }

  nextStep(targetStep) {
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData();
      this.showStep(targetStep);
    }
  }

  previousStep(targetStep) {
    this.saveCurrentStepData();
    this.showStep(targetStep);
  }

  saveCurrentStepData() {
    switch (this.currentStep) {
      case "shipping":
        this.saveShippingData();
        break;
      case "billing":
        this.saveBillingData();
        break;
      case "payment":
        this.savePaymentData();
        break;
    }

    miniCartApp.saveCheckout(this.checkoutData);
  }

  // Shipping validation and data handling
  validateShippingForm() {
    const rules = {
      fullName: { required: true, minLength: 2 },
      address1: { required: true, minLength: 5 },
      city: { required: true, minLength: 2 },
      state: { required: true, minLength: 2 },
      postalCode: {
        required: true,
        pattern: /^\d{6}$/,
        message: "Please enter a valid 6-digit postal code",
      },
      phone: {
        required: true,
        pattern: /^\d{10}$/,
        message: "Please enter a valid 10-digit phone number",
      },
    };

    const form = uiManager.qs("#shippingForm");
    const validation = uiManager.validateForm(form, rules);

    return validation.isValid;
  }

  validateShippingField(field) {
    const rules = {
      fullName: { required: true, minLength: 2 },
      address1: { required: true, minLength: 5 },
      city: { required: true, minLength: 2 },
      state: { required: true, minLength: 2 },
      postalCode: {
        required: true,
        pattern: /^\d{6}$/,
        message: "Please enter a valid 6-digit postal code",
      },
      phone: {
        required: true,
        pattern: /^\d{10}$/,
        message: "Please enter a valid 10-digit phone number",
      },
    };

    const fieldName = field.name;
    if (rules[fieldName]) {
      const errors = uiManager.validateField(field, rules[fieldName]);
      uiManager.setFieldError(field, errors);
    }
  }

  saveShippingData() {
    const form = uiManager.qs("#shippingForm");
    const formData = new FormData(form);

    Object.keys(this.checkoutData.shipping).forEach((key) => {
      this.checkoutData.shipping[key] = formData.get(key) || "";
    });
  }

  // Billing validation and data handling
  validateBillingForm() {
    const sameAsShipping = uiManager.qs("#sameAsShipping").checked;

    if (sameAsShipping) {
      return true;
    }

    const rules = {
      fullName: { required: true, minLength: 2 },
      address1: { required: true, minLength: 5 },
      city: { required: true, minLength: 2 },
      state: { required: true, minLength: 2 },
      postalCode: {
        required: true,
        pattern: /^\d{6}$/,
        message: "Please enter a valid 6-digit postal code",
      },
      phone: {
        required: true,
        pattern: /^\d{10}$/,
        message: "Please enter a valid 10-digit phone number",
      },
    };

    const form = uiManager.qs("#billingForm");
    const validation = uiManager.validateForm(form, rules);

    return validation.isValid;
  }

  validateBillingField(field) {
    const sameAsShipping = uiManager.qs("#sameAsShipping").checked;
    if (sameAsShipping) return;

    const rules = {
      fullName: { required: true, minLength: 2 },
      address1: { required: true, minLength: 5 },
      city: { required: true, minLength: 2 },
      state: { required: true, minLength: 2 },
      postalCode: {
        required: true,
        pattern: /^\d{6}$/,
        message: "Please enter a valid 6-digit postal code",
      },
      phone: {
        required: true,
        pattern: /^\d{10}$/,
        message: "Please enter a valid 10-digit phone number",
      },
    };

    const fieldName = field.name;
    if (rules[fieldName]) {
      const errors = uiManager.validateField(field, rules[fieldName]);
      uiManager.setFieldError(field, errors);
    }
  }

  saveBillingData() {
    const sameAsShipping = uiManager.qs("#sameAsShipping").checked;

    if (sameAsShipping) {
      // Copy shipping data to billing
      this.checkoutData.billing = { ...this.checkoutData.shipping };
      this.checkoutData.billing.sameAsShipping = true;
    } else {
      // Save billing form data
      const form = uiManager.qs("#billingForm");
      const formData = new FormData(form);

      Object.keys(this.checkoutData.billing).forEach((key) => {
        if (key !== "sameAsShipping") {
          this.checkoutData.billing[key] = formData.get(key) || "";
        }
      });
      this.checkoutData.billing.sameAsShipping = false;
    }
  }

  toggleBillingFields(show) {
    const billingFields = uiManager.qs("#billingFields");
    if (billingFields) {
      billingFields.style.display = show ? "block" : "none";

      // Clear validation errors when hiding
      if (!show) {
        const fields = uiManager.qsa(
          "#billingFields input, #billingFields select"
        );
        fields.forEach((field) => uiManager.clearFieldError(field));
      }
    }
  }

  // Payment validation and data handling
  validatePaymentForm() {
    const paymentMethod = uiManager.qs(
      'input[name="paymentMethod"]:checked'
    ).value;

    if (paymentMethod === "card") {
      const rules = {
        cardName: { required: true, minLength: 2 },
        cardNumber: {
          required: true,
          custom: (value) =>
            uiManager.isValidCardNumber(value) ? null : "Invalid card number",
        },
        expiry: {
          required: true,
          custom: (value) =>
            uiManager.isValidExpiry(value) ? null : "Invalid expiry date",
        },
        cvv: {
          required: true,
          custom: (value) =>
            uiManager.isValidCVV(value) ? null : "Invalid CVV",
        },
      };

      const form = uiManager.qs("#paymentForm");
      const validation = uiManager.validateForm(form, rules);

      return validation.isValid;
    }

    return true; // UPI and COD don't require additional validation
  }

  validatePaymentField(field) {
    const paymentMethod = uiManager.qs(
      'input[name="paymentMethod"]:checked'
    ).value;

    if (paymentMethod !== "card") return;

    const rules = {
      cardName: { required: true, minLength: 2 },
      cardNumber: {
        required: true,
        custom: (value) =>
          uiManager.isValidCardNumber(value) ? null : "Invalid card number",
      },
      expiry: {
        required: true,
        custom: (value) =>
          uiManager.isValidExpiry(value) ? null : "Invalid expiry date",
      },
      cvv: {
        required: true,
        custom: (value) => (uiManager.isValidCVV(value) ? null : "Invalid CVV"),
      },
    };

    const fieldName = field.name;
    if (rules[fieldName]) {
      const errors = uiManager.validateField(field, rules[fieldName]);
      uiManager.setFieldError(field, errors);
    }
  }

  savePaymentData() {
    const paymentMethod = uiManager.qs(
      'input[name="paymentMethod"]:checked'
    ).value;
    this.checkoutData.payment.method = paymentMethod;

    if (paymentMethod === "card") {
      const form = uiManager.qs("#paymentForm");
      const formData = new FormData(form);

      this.checkoutData.payment.cardName = formData.get("cardName") || "";
      this.checkoutData.payment.cardNumber = formData.get("cardNumber") || "";
      this.checkoutData.payment.expiry = formData.get("cardExpiry") || "";
      this.checkoutData.payment.cvv = formData.get("cardCvv") || "";
    } else {
      // Clear card data for non-card payments
      this.checkoutData.payment.cardName = "";
      this.checkoutData.payment.cardNumber = "";
      this.checkoutData.payment.expiry = "";
      this.checkoutData.payment.cvv = "";
    }
  }

  togglePaymentFields(paymentMethod) {
    const cardFields = uiManager.qs("#cardFields");
    if (cardFields) {
      cardFields.style.display = paymentMethod === "card" ? "block" : "none";

      // Clear validation errors when hiding card fields
      if (paymentMethod !== "card") {
        const fields = uiManager.qsa("#cardFields input");
        fields.forEach((field) => uiManager.clearFieldError(field));
      }
    }
  }

  formatCardNumber(input) {
    let value = input.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    input.value = value;
  }

  formatExpiry(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    input.value = value;
  }

  // Order placement
  async placeOrder() {
    try {
      if (!this.validatePaymentForm()) {
        uiManager.showToast("Please fix payment errors", "error");
        return;
      }

      // Save payment data
      this.savePaymentData();

      // Generate order ID
      this.orderId = miniCartApp.generateOrderId();
      this.checkoutData.orderId = this.orderId;

      // Save order data
      miniCartApp.saveCheckout(this.checkoutData);

      // Clear cart
      miniCartApp.clearCart();

      // Show confirmation
      this.showStep("confirmation");

      // Show success animation
      uiManager.createConfetti();
    } catch (error) {
      console.error("Error placing order:", error);
      uiManager.showToast("Failed to place order", "error");
    }
  }

  renderConfirmation() {
    const orderId = uiManager.qs("#orderId");
    const confirmationItems = uiManager.qs("#confirmationItems");
    const confirmationTotal = uiManager.qs("#confirmationTotal");

    if (orderId) {
      orderId.textContent = this.orderId;
    }

    if (confirmationItems && this.cart) {
      confirmationItems.innerHTML = "";

      this.cart.items.forEach((item) => {
        const itemEl = uiManager.createEl("div", "confirmation-item");

        const name = uiManager.createEl(
          "span",
          "confirmation-item-name",
          item.name
        );
        const qty = uiManager.createEl(
          "span",
          "confirmation-item-qty",
          `x${item.qty}`
        );
        const price = uiManager.createEl("span", "confirmation-item-price");
        price.textContent = miniCartApp.formatCurrency(item.price * item.qty);

        itemEl.appendChild(name);
        itemEl.appendChild(qty);
        itemEl.appendChild(price);

        confirmationItems.appendChild(itemEl);
      });
    }

    if (confirmationTotal && this.cart) {
      confirmationTotal.textContent = miniCartApp.formatCurrency(
        this.cart.total
      );
    }
  }

  // Public methods
  getCurrentStep() {
    return this.currentStep;
  }

  getCheckoutData() {
    return this.checkoutData;
  }

  getOrderId() {
    return this.orderId;
  }
}

// Initialize checkout page when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if we're on the checkout page
  if (window.location.pathname.includes("checkout.html")) {
    window.checkoutPage = new CheckoutPage();
    window.checkoutPage.init();
  }
});
