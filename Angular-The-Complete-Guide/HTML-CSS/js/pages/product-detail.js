// MiniCart Product Detail Page - Product information and add to cart
// Handles product display, options selection, and cart addition

class ProductDetailPage {
  constructor() {
    this.product = null;
    this.selectedOptions = {};
    this.currentQuantity = 1;
    this.currentImageIndex = 0;
  }

  async init() {
    try {
      const productId = miniCartApp.getQueryParam("id");
      if (!productId) {
        uiManager.showToast("Product not found", "error");
        setTimeout(() => (window.location.href = "index.html"), 2000);
        return;
      }

      await this.loadProduct(productId);
      this.setupEventListeners();
      this.renderProduct();
    } catch (error) {
      console.error("Error initializing product detail page:", error);
      uiManager.showToast("Failed to load product", "error");
      setTimeout(() => (window.location.href = "index.html"), 2000);
    }
  }

  async loadProduct(productId) {
    this.product = await productManager.getProductById(productId);

    if (!this.product) {
      throw new Error("Product not found");
    }

    // Add to recently viewed
    miniCartApp.addToRecentlyViewed(productId);
  }

  setupEventListeners() {
    // Quantity controls
    const qtyMinus = uiManager.qs("#qtyMinus");
    const qtyPlus = uiManager.qs("#qtyPlus");
    const qtyInput = uiManager.qs("#qty");

    if (qtyMinus) {
      uiManager.on(qtyMinus, "click", () =>
        this.updateQuantity(this.currentQuantity - 1)
      );
    }

    if (qtyPlus) {
      uiManager.on(qtyPlus, "click", () =>
        this.updateQuantity(this.currentQuantity + 1)
      );
    }

    if (qtyInput) {
      uiManager.on(qtyInput, "input", (e) => {
        const value = parseInt(e.target.value) || 1;
        this.updateQuantity(value);
      });
    }

    // Add to cart form
    const productForm = uiManager.qs("#productForm");
    if (productForm) {
      uiManager.on(productForm, "submit", (e) => {
        e.preventDefault();
        this.addToCart();
      });
    }

    // Toggle description
    const toggleDesc = uiManager.qs("#toggleDescription");
    if (toggleDesc) {
      uiManager.on(toggleDesc, "click", () => this.toggleDescription());
    }

    // Gallery thumbnails
    this.setupGalleryListeners();
  }

  setupGalleryListeners() {
    const galleryThumbs = uiManager.qs("#galleryThumbs");
    if (!galleryThumbs) return;

    uiManager.on(galleryThumbs, "click", (e) => {
      const thumb = e.target.closest(".thumb-image");
      if (thumb) {
        const index = parseInt(thumb.dataset.index);
        this.switchImage(index);
      }
    });
  }

  renderProduct() {
    if (!this.product) return;

    this.renderBasicInfo();
    this.renderImages();
    this.renderOptions();
    this.renderBadges();
    this.updateAddToCartButton();
  }

  renderBasicInfo() {
    // Title
    const title = uiManager.qs("#productTitle");
    if (title) title.textContent = this.product.name;

    // Price
    const price = uiManager.qs("#price");
    if (price)
      price.textContent = miniCartApp.formatCurrency(this.product.price);

    // Rating and reviews
    const rating = uiManager.qs("#productRating");
    if (rating) {
      rating.textContent = productManager.generateStarRating(
        this.product.rating || 0
      );
    }

    const reviewsCount = uiManager.qs("#reviewsCount");
    if (reviewsCount) {
      reviewsCount.textContent = `(${this.product.reviewsCount || 0} reviews)`;
    }

    // Stock status
    const stockStatus = uiManager.qs("#stockStatus");
    if (stockStatus) {
      const statusText = productManager.getStockStatus(this.product);
      const statusClass = productManager.getStockStatusClass(this.product);
      stockStatus.textContent = statusText;
      stockStatus.className = `stock-text ${statusClass}`;
    }

    // Descriptions
    const shortDesc = uiManager.qs("#shortDesc");
    if (shortDesc) shortDesc.textContent = this.product.shortDesc;

    const longDesc = uiManager.qs("#longDesc");
    if (longDesc && this.product.longDesc) {
      longDesc.innerHTML = this.product.longDesc;
    }

    // Breadcrumbs
    this.renderBreadcrumbs();

    // Update quantity limits
    const qtyInput = uiManager.qs("#qty");
    if (qtyInput) {
      qtyInput.max = this.product.stock;
      qtyInput.value = Math.min(this.currentQuantity, this.product.stock);
    }
  }

  renderImages() {
    const images = productManager.getProductImages(this.product);
    const galleryMain = uiManager.qs("#galleryMain");
    const galleryThumbs = uiManager.qs("#galleryThumbs");

    if (galleryMain && images.length > 0) {
      galleryMain.src = images[0];
      galleryMain.alt = this.product.name;
    }

    if (galleryThumbs) {
      galleryThumbs.innerHTML = "";

      images.forEach((image, index) => {
        const thumb = uiManager.createEl("img", "thumb-image");
        thumb.src = image;
        thumb.alt = `${this.product.name} - Image ${index + 1}`;
        thumb.dataset.index = index;

        if (index === 0) {
          thumb.classList.add("active");
        }

        galleryThumbs.appendChild(thumb);
      });
    }
  }

  renderOptions() {
    if (!this.product.options) return;

    const options = productManager.formatProductOptions(this.product);

    Object.keys(options).forEach((optionKey) => {
      const option = options[optionKey];
      const optionGroup = uiManager.qs(`#${optionKey}Group`);
      const optionContainer = uiManager.qs(
        `#option${optionKey.charAt(0).toUpperCase() + optionKey.slice(1)}`
      );

      if (optionGroup && optionContainer) {
        optionGroup.style.display = "block";
        optionContainer.innerHTML = "";

        option.values.forEach((value) => {
          const btn = uiManager.createEl("button", "option-btn", value);
          btn.type = "button";
          btn.dataset.value = value;

          uiManager.on(btn, "click", (e) => {
            this.selectOption(optionKey, value);
          });

          optionContainer.appendChild(btn);
        });
      }
    });
  }

  renderBadges() {
    const badgesContainer = uiManager.qs("#productBadges");
    if (!badgesContainer || !this.product.badges) return;

    badgesContainer.innerHTML = "";

    this.product.badges.forEach((badge) => {
      const badgeEl = uiManager.createEl(
        "span",
        `badge ${badge.toLowerCase().replace(/\s+/g, "-")}`
      );
      badgeEl.textContent = badge;
      badgesContainer.appendChild(badgeEl);
    });
  }

  renderBreadcrumbs() {
    const breadcrumbCategory = uiManager.qs("#breadcrumbCategory");
    const breadcrumbProduct = uiManager.qs("#breadcrumbProduct");

    if (breadcrumbCategory) {
      breadcrumbCategory.textContent = this.product.category;
    }

    if (breadcrumbProduct) {
      breadcrumbProduct.textContent = this.product.name;
    }
  }

  selectOption(optionKey, value) {
    // Update selected options
    this.selectedOptions[optionKey] = value;

    // Update button states
    const optionContainer = uiManager.qs(
      `#option${optionKey.charAt(0).toUpperCase() + optionKey.slice(1)}`
    );
    if (optionContainer) {
      const buttons = uiManager.qsa(".option-btn", optionContainer);
      buttons.forEach((btn) => {
        btn.classList.remove("selected");
        if (btn.dataset.value === value) {
          btn.classList.add("selected");
        }
      });
    }

    // Clear any error for this option
    const errorElement = uiManager.qs(`#${optionKey}Error`);
    if (errorElement) {
      errorElement.classList.remove("show");
    }

    this.updateAddToCartButton();
  }

  updateQuantity(qty) {
    if (!this.product) return;

    qty = Math.max(1, Math.min(qty, this.product.stock));
    this.currentQuantity = qty;

    const qtyInput = uiManager.qs("#qty");
    const qtyMinus = uiManager.qs("#qtyMinus");
    const qtyPlus = uiManager.qs("#qtyPlus");

    if (qtyInput) qtyInput.value = qty;
    if (qtyMinus) qtyMinus.disabled = qty <= 1;
    if (qtyPlus) qtyPlus.disabled = qty >= this.product.stock;
  }

  switchImage(index) {
    const images = productManager.getProductImages(this.product);
    if (index < 0 || index >= images.length) return;

    this.currentImageIndex = index;

    const galleryMain = uiManager.qs("#galleryMain");
    const thumbs = uiManager.qsa(".thumb-image");

    if (galleryMain) {
      galleryMain.src = images[index];
    }

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  toggleDescription() {
    const longDesc = uiManager.qs("#longDesc");
    const toggleBtn = uiManager.qs("#toggleDescription");

    if (!longDesc || !toggleBtn) return;

    const isVisible = longDesc.style.display !== "none";

    if (isVisible) {
      longDesc.style.display = "none";
      toggleBtn.textContent = "Show more";
    } else {
      longDesc.style.display = "block";
      toggleBtn.textContent = "Show less";
    }
  }

  validateOptions() {
    if (!this.product.options) return true;

    const options = productManager.formatProductOptions(this.product);
    const requiredOptions = Object.keys(options);

    for (const optionKey of requiredOptions) {
      if (!this.selectedOptions[optionKey]) {
        const errorElement = uiManager.qs(`#${optionKey}Error`);
        if (errorElement) {
          errorElement.textContent = `Please select a ${optionKey}`;
          errorElement.classList.add("show");
        }
        return false;
      }
    }

    return true;
  }

  updateAddToCartButton() {
    const btnAddToCart = uiManager.qs("#btnAddToCart");
    if (!btnAddToCart) return;

    const isValid =
      this.validateOptions() && productManager.isInStock(this.product);

    btnAddToCart.disabled = !isValid;

    if (productManager.isInStock(this.product)) {
      btnAddToCart.textContent = "Add to Cart";
    } else {
      btnAddToCart.textContent = "Out of Stock";
    }
  }

  async addToCart() {
    try {
      // Validate options
      if (!this.validateOptions()) {
        uiManager.showToast("Please select all required options", "error");
        return;
      }

      // Check stock
      if (!productManager.isInStock(this.product)) {
        uiManager.showToast("Product is out of stock", "error");
        return;
      }

      // Add to cart
      miniCartApp.addItem(
        this.product,
        this.selectedOptions,
        this.currentQuantity
      );

      // Show success message
      uiManager.showToast(`${this.product.name} added to cart!`, "success");

      // Navigate to cart after a short delay
      setTimeout(() => {
        window.location.href = "trip-cart.html";
      }, 1500);
    } catch (error) {
      console.error("Error adding to cart:", error);
      uiManager.showToast("Failed to add product to cart", "error");
    }
  }

  // Public methods
  getProduct() {
    return this.product;
  }

  getSelectedOptions() {
    return { ...this.selectedOptions };
  }

  getQuantity() {
    return this.currentQuantity;
  }
}

// Initialize product detail page when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if we're on the product detail page
  if (window.location.pathname.includes("product.html")) {
    window.productDetailPage = new ProductDetailPage();
    window.productDetailPage.init();
  }
});
