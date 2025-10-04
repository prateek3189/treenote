// MiniCart Home Page - Product listing and filtering
// Handles product grid, search, filters, and sorting

class HomePage {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentFilters = {
      search: "",
      categories: [],
      priceMin: null,
      priceMax: null,
      sortBy: "popularity",
    };
    this.debouncedSearch = uiManager.debounce(
      this.handleSearch.bind(this),
      300
    );
  }

  async init() {
    try {
      await this.loadProducts();
      this.setupEventListeners();
      this.renderProducts();
      this.updateResultsCount();
    } catch (error) {
      console.error("Error initializing home page:", error);
      uiManager.showToast("Failed to load products", "error");
    }
  }

  async loadProducts() {
    this.products = await productManager.getAllProducts();
    this.filteredProducts = [...this.products];
  }

  setupEventListeners() {
    // Search input
    const searchInput = uiManager.qs("#searchInput");
    if (searchInput) {
      uiManager.on(searchInput, "input", (e) => {
        this.currentFilters.search = e.target.value;
        this.debouncedSearch();
      });
    }

    // Category filters
    this.setupCategoryFilters();

    // Price filters
    const priceMin = uiManager.qs("#priceMin");
    const priceMax = uiManager.qs("#priceMax");

    if (priceMin) {
      uiManager.on(
        priceMin,
        "input",
        uiManager.debounce((e) => {
          this.currentFilters.priceMin = e.target.value
            ? parseInt(e.target.value)
            : null;
          this.applyFilters();
        }, 500)
      );
    }

    if (priceMax) {
      uiManager.on(
        priceMax,
        "input",
        uiManager.debounce((e) => {
          this.currentFilters.priceMax = e.target.value
            ? parseInt(e.target.value)
            : null;
          this.applyFilters();
        }, 500)
      );
    }

    // Sort select
    const sortSelect = uiManager.qs("#sortSelect");
    if (sortSelect) {
      uiManager.on(sortSelect, "change", (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Product grid clicks
    const productGrid = uiManager.qs("#productGrid");
    if (productGrid) {
      uiManager.on(productGrid, "click", (e) => {
        const productCard = e.target.closest(".product-card");
        if (productCard) {
          const productId = productCard.dataset.productId;
          if (productId) {
            this.navigateToProduct(productId);
          }
        }
      });
    }

    // View Details buttons
    uiManager.qsa(".btn-view-details").forEach((btn) => {
      uiManager.on(btn, "click", (e) => {
        e.stopPropagation();
        const productId = e.target.closest(".product-card").dataset.productId;
        this.navigateToProduct(productId);
      });
    });
  }

  async setupCategoryFilters() {
    const categories = await productManager.getCategories();
    const categoryContainer = uiManager.qs("#categoryFilters");

    if (!categoryContainer) return;

    categoryContainer.innerHTML = "";

    categories.forEach((category) => {
      const option = uiManager.createEl("div", "filter-option");
      const checkbox = uiManager.createEl("input");
      checkbox.type = "checkbox";
      checkbox.value = category;
      checkbox.id = `category-${category}`;

      const label = uiManager.createEl("label", "", category);
      label.setAttribute("for", `category-${category}`);

      option.appendChild(checkbox);
      option.appendChild(label);
      categoryContainer.appendChild(option);

      // Add change listener
      uiManager.on(checkbox, "change", (e) => {
        if (e.target.checked) {
          this.currentFilters.categories.push(category);
        } else {
          this.currentFilters.categories =
            this.currentFilters.categories.filter((c) => c !== category);
        }
        this.applyFilters();
      });
    });
  }

  handleSearch() {
    this.applyFilters();
  }

  async applyFilters() {
    try {
      // Apply search filter
      if (this.currentFilters.search) {
        this.filteredProducts = await productManager.searchProducts(
          this.currentFilters.search
        );
      } else {
        this.filteredProducts = [...this.products];
      }

      // Apply category filter
      if (this.currentFilters.categories.length > 0) {
        this.filteredProducts = this.filteredProducts.filter((product) =>
          this.currentFilters.categories.includes(product.category)
        );
      }

      // Apply price filter
      if (this.currentFilters.priceMin !== null) {
        this.filteredProducts = this.filteredProducts.filter(
          (product) => product.price >= this.currentFilters.priceMin
        );
      }

      if (this.currentFilters.priceMax !== null) {
        this.filteredProducts = this.filteredProducts.filter(
          (product) => product.price <= this.currentFilters.priceMax
        );
      }

      // Apply sorting
      this.filteredProducts = productManager.sortProducts(
        this.filteredProducts,
        this.currentFilters.sortBy
      );

      this.renderProducts();
      this.updateResultsCount();
    } catch (error) {
      console.error("Error applying filters:", error);
      uiManager.showToast("Error filtering products", "error");
    }
  }

  renderProducts() {
    const productGrid = uiManager.qs("#productGrid");
    const emptyState = uiManager.qs("#emptyState");

    if (!productGrid) return;

    if (this.filteredProducts.length === 0) {
      productGrid.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    productGrid.style.display = "grid";
    if (emptyState) emptyState.style.display = "none";

    productGrid.innerHTML = "";

    this.filteredProducts.forEach((product) => {
      const productCard = this.createProductCard(product);
      productGrid.appendChild(productCard);
    });
  }

  createProductCard(product) {
    const card = uiManager.createEl("div", "product-card");
    card.dataset.productId = product.id;

    const image = uiManager.createEl("img", "product-card-image");
    image.src = productManager.getMainImage(product);
    image.alt = product.name;
    image.loading = "lazy";

    const content = uiManager.createEl("div", "product-card-content");

    const title = uiManager.createEl("h3", "product-card-title", product.name);

    const meta = uiManager.createEl("div", "product-card-meta");

    const price = uiManager.createEl("div", "product-card-price");
    price.textContent = miniCartApp.formatCurrency(product.price);

    const rating = uiManager.createEl("div", "product-card-rating");
    rating.innerHTML = `
      ${productManager.generateStarRating(product.rating || 0)}
      <span>(${product.reviewsCount || 0})</span>
    `;

    meta.appendChild(price);
    meta.appendChild(rating);

    const actions = uiManager.createEl("div", "product-card-actions");

    if (productManager.isInStock(product)) {
      const viewBtn = uiManager.createEl(
        "button",
        "btn btn-primary btn-view-details"
      );
      viewBtn.textContent = "View Details";
      actions.appendChild(viewBtn);
    } else {
      const outOfStockBtn = uiManager.createEl(
        "button",
        "btn btn-outline",
        "Out of Stock"
      );
      outOfStockBtn.disabled = true;
      actions.appendChild(outOfStockBtn);
    }

    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(actions);

    card.appendChild(image);
    card.appendChild(content);

    return card;
  }

  updateResultsCount() {
    const resultsCount = uiManager.qs("#resultsCount");
    if (resultsCount) {
      const count = this.filteredProducts.length;
      const total = this.products.length;

      if (count === total) {
        resultsCount.textContent = `${total} products`;
      } else {
        resultsCount.textContent = `${count} of ${total} products`;
      }
    }
  }

  navigateToProduct(productId) {
    // Add to recently viewed
    miniCartApp.addToRecentlyViewed(productId);

    // Navigate to product page
    window.location.href = `product.html?id=${productId}`;
  }

  // Public methods for external access
  async refreshProducts() {
    await this.loadProducts();
    this.applyFilters();
  }

  clearFilters() {
    this.currentFilters = {
      search: "",
      categories: [],
      priceMin: null,
      priceMax: null,
      sortBy: "popularity",
    };

    // Reset UI elements
    const searchInput = uiManager.qs("#searchInput");
    if (searchInput) searchInput.value = "";

    const priceMin = uiManager.qs("#priceMin");
    const priceMax = uiManager.qs("#priceMax");
    if (priceMin) priceMin.value = "";
    if (priceMax) priceMax.value = "";

    const sortSelect = uiManager.qs("#sortSelect");
    if (sortSelect) sortSelect.value = "popularity";

    // Uncheck all category checkboxes
    uiManager
      .qsa('#categoryFilters input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    this.applyFilters();
  }

  getCurrentFilters() {
    return { ...this.currentFilters };
  }

  setFilters(filters) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.applyFilters();
  }
}

// Initialize home page when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if we're on the home page
  if (
    document.body.classList.contains("home-page") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("index.html")
  ) {
    window.homePage = new HomePage();
    window.homePage.init();
  }
});
