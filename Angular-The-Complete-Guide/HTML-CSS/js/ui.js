// MiniCart UI - DOM helpers and UI components
// Handles DOM manipulation, toasts, modals, and form validation

class UIManager {
  constructor() {
    this.toastTimeout = null;
    this.modalStack = [];
  }

  // DOM Helpers
  qs(selector, parent = document) {
    return parent.querySelector(selector);
  }

  qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  createEl(tag, className = "", content = "") {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
  }

  on(element, event, handler, options = {}) {
    if (typeof element === "string") {
      element = this.qs(element);
    }
    if (element) {
      element.addEventListener(event, handler, options);
    }
  }

  off(element, event, handler) {
    if (typeof element === "string") {
      element = this.qs(element);
    }
    if (element) {
      element.removeEventListener(event, handler);
    }
  }

  // Toast Notifications
  showToast(message, type = "success", duration = 3000) {
    const toast = this.qs("#toast");
    if (!toast) return;

    // Clear existing timeout
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Set message and type
    toast.textContent = message;
    toast.className = `toast ${type}`;

    // Show toast
    toast.classList.add("show");

    // Hide after duration
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  hideToast() {
    const toast = this.qs("#toast");
    if (toast) {
      toast.classList.remove("show");
    }
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  // Form Validation
  validateField(field, rules = {}) {
    const value = field.value.trim();
    const errors = [];

    // Required validation
    if (rules.required && !value) {
      errors.push("This field is required");
    }

    // Email validation
    if (rules.email && value && !this.isValidEmail(value)) {
      errors.push("Please enter a valid email address");
    }

    // Phone validation
    if (rules.phone && value && !this.isValidPhone(value)) {
      errors.push("Please enter a valid phone number");
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters`);
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must be no more than ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors.push(rules.message || "Invalid format");
    }

    // Custom validation
    if (rules.custom && value) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return errors;
  }

  setFieldError(field, errors) {
    this.clearFieldError(field);

    if (errors.length === 0) return;

    const errorElement = this.createEl(
      "div",
      "error-message show",
      errors.join(", ")
    );
    field.setAttribute("aria-invalid", "true");
    field.classList.add("error");

    // Insert error message after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }

  clearFieldError(field) {
    const errorElement = field.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
    field.removeAttribute("aria-invalid");
    field.classList.remove("error");
  }

  validateForm(form, rules) {
    let isValid = true;
    const errors = {};

    // Validate each field
    Object.keys(rules).forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const fieldErrors = this.validateField(field, rules[fieldName]);
        if (fieldErrors.length > 0) {
          this.setFieldError(field, fieldErrors);
          errors[fieldName] = fieldErrors;
          isValid = false;
        } else {
          this.clearFieldError(field);
        }
      }
    });

    return { isValid, errors };
  }

  // Validation Helpers
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  }

  isValidPostalCode(postalCode, country = "IN") {
    if (country === "IN") {
      return /^\d{6}$/.test(postalCode);
    }
    return /^\d{5,6}$/.test(postalCode);
  }

  isValidCardNumber(cardNumber) {
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

  isValidExpiry(expiry) {
    const [month, year] = expiry.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2)
      return false;

    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();

    return expDate > now;
  }

  isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
  }

  // Stepper Component
  updateStepper(currentStep) {
    const stepper = this.qs("#stepper");
    if (!stepper) return;

    const steps = this.qsa(".stepper-step", stepper);
    const stepNames = ["shipping", "billing", "payment", "confirmation"];

    steps.forEach((step, index) => {
      step.classList.remove("completed", "active");

      const stepName = stepNames[index];
      const stepIndex = stepNames.indexOf(currentStep);

      if (index < stepIndex) {
        step.classList.add("completed");
      } else if (index === stepIndex) {
        step.classList.add("active");
      }
    });
  }

  showStep(stepName) {
    // Hide all steps
    const steps = this.qsa(".checkout-step");
    steps.forEach((step) => step.classList.remove("active"));

    // Show current step
    const currentStep = this.qs(
      `#step${stepName.charAt(0).toUpperCase() + stepName.slice(1)}`
    );
    if (currentStep) {
      currentStep.classList.add("active");
    }

    // Update stepper
    this.updateStepper(stepName);
  }

  // Modal Component
  showModal(content, options = {}) {
    const modal = this.createModal(content, options);
    document.body.appendChild(modal);
    this.modalStack.push(modal);

    // Focus trap
    this.trapFocus(modal);

    return modal;
  }

  hideModal() {
    const modal = this.modalStack.pop();
    if (modal) {
      modal.remove();
    }
  }

  hideAllModals() {
    while (this.modalStack.length > 0) {
      this.hideModal();
    }
  }

  createModal(content, options = {}) {
    const modal = this.createEl("div", "modal-overlay");
    const modalContent = this.createEl("div", "modal-content");

    if (options.title) {
      const title = this.createEl("h2", "modal-title", options.title);
      modalContent.appendChild(title);
    }

    modalContent.appendChild(content);

    if (options.closeable !== false) {
      const closeBtn = this.createEl("button", "modal-close", "×");
      closeBtn.setAttribute("aria-label", "Close modal");
      closeBtn.onclick = () => this.hideModal();
      modalContent.appendChild(closeBtn);
    }

    modal.appendChild(modalContent);

    // Close on overlay click
    modal.onclick = (e) => {
      if (e.target === modal) {
        this.hideModal();
      }
    };

    // Close on Escape key
    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        this.hideModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);

    return modal;
  }

  // Focus Management
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });

    if (firstElement) {
      firstElement.focus();
    }
  }

  // Loading States
  showLoading(element, text = "Loading...") {
    if (typeof element === "string") {
      element = this.qs(element);
    }

    if (element) {
      element.classList.add("loading");
      element.setAttribute("data-loading-text", text);
    }
  }

  hideLoading(element) {
    if (typeof element === "string") {
      element = this.qs(element);
    }

    if (element) {
      element.classList.remove("loading");
    }
  }

  // Animation Helpers
  fadeIn(element, duration = 300) {
    if (typeof element === "string") {
      element = this.qs(element);
    }

    if (element) {
      element.style.opacity = "0";
      element.style.display = "block";

      const start = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        element.style.opacity = progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }

  fadeOut(element, duration = 300) {
    if (typeof element === "string") {
      element = this.qs(element);
    }

    if (element) {
      const start = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        element.style.opacity = 1 - progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = "none";
        }
      };

      requestAnimationFrame(animate);
    }
  }

  // Confetti Animation
  createConfetti() {
    const confetti = this.createEl("div", "confetti");

    for (let i = 0; i < 50; i++) {
      const piece = this.createEl("div", "confetti-piece");
      piece.style.left = Math.random() * 100 + "%";
      piece.style.animationDelay = Math.random() * 3 + "s";
      confetti.appendChild(piece);
    }

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }

  // Scroll Helpers
  scrollToElement(element, offset = 0) {
    if (typeof element === "string") {
      element = this.qs(element);
    }

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - offset;

      window.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  }

  // Format Helpers
  formatPrice(amount, currency = "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  }

  // URL Helpers
  updateURL(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.pushState({}, "", url);
  }

  getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};

    for (const [key, value] of params) {
      result[key] = value;
    }

    return result;
  }

  // Event Helpers
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

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Create global UI manager instance
window.uiManager = new UIManager();
