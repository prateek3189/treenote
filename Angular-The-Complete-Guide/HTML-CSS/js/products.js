// MiniCart Products - Product data management
// Handles fetching, filtering, and searching products

class ProductManager {
  constructor() {
    this.products = [];
    this.categories = new Set();
    this.brands = new Set();
    this.isLoaded = false;
  }

  // Fetch products from JSON file
  async loadProducts() {
    if (this.isLoaded) return this.products;

    try {
      const response = await fetch("./data/products.json");
      console.log("Fetching products:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.products = await response.json();

      // Extract categories and brands
      this.products.forEach((product) => {
        if (product.category) this.categories.add(product.category);
        if (product.brand) this.brands.add(product.brand);
      });

      this.isLoaded = true;
      return this.products;
    } catch (error) {
      console.error("Error loading products:", error);
      this.products = [];
      return [];
    }
  }

  // Get all products
  async getAllProducts() {
    await this.loadProducts();
    return this.products;
  }

  // Get product by ID
  async getProductById(id) {
    await this.loadProducts();
    return this.products.find((product) => product.id === id);
  }

  // Search products by text
  async searchProducts(query) {
    await this.loadProducts();
    if (!query || query.trim() === "") return this.products;

    const searchTerm = query.toLowerCase().trim();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.shortDesc.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
  }

  // Filter products by criteria
  async filterProducts(filters = {}) {
    await this.loadProducts();
    let filtered = [...this.products];

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Price range filter
    if (filters.priceMin !== undefined && filters.priceMin !== null) {
      filtered = filtered.filter(
        (product) => product.price >= filters.priceMin
      );
    }
    if (filters.priceMax !== undefined && filters.priceMax !== null) {
      filtered = filtered.filter(
        (product) => product.price <= filters.priceMax
      );
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    return filtered;
  }

  // Sort products
  sortProducts(products, sortBy = "popularity") {
    const sorted = [...products];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      case "popularity":
      default:
        // Sort by rating and reviews count
        return sorted.sort((a, b) => {
          const aScore = (a.rating || 0) * (a.reviewsCount || 0);
          const bScore = (b.rating || 0) * (b.reviewsCount || 0);
          return bScore - aScore;
        });
    }
  }

  // Get unique categories
  async getCategories() {
    await this.loadProducts();
    return Array.from(this.categories).sort();
  }

  // Get unique brands
  async getBrands() {
    await this.loadProducts();
    return Array.from(this.brands).sort();
  }

  // Get products by category
  async getProductsByCategory(category) {
    await this.loadProducts();
    return this.products.filter((product) => product.category === category);
  }

  // Get related products (same category, excluding current product)
  async getRelatedProducts(productId, limit = 4) {
    await this.loadProducts();
    const currentProduct = await this.getProductById(productId);
    if (!currentProduct) return [];

    const related = this.products.filter(
      (product) =>
        product.id !== productId && product.category === currentProduct.category
    );

    return this.sortProducts(related, "popularity").slice(0, limit);
  }

  // Get featured products (products with badges)
  async getFeaturedProducts(limit = 6) {
    await this.loadProducts();
    const featured = this.products.filter(
      (product) => product.badges && product.badges.length > 0
    );
    return this.sortProducts(featured, "popularity").slice(0, limit);
  }

  // Get new arrivals (products with 'new' badge)
  async getNewArrivals(limit = 6) {
    await this.loadProducts();
    const newArrivals = this.products.filter((product) =>
      product.badges?.some((badge) => badge.toLowerCase().includes("new"))
    );
    return this.sortProducts(newArrivals, "newest").slice(0, limit);
  }

  // Get bestsellers
  async getBestsellers(limit = 6) {
    await this.loadProducts();
    const bestsellers = this.products.filter((product) =>
      product.badges?.some((badge) =>
        badge.toLowerCase().includes("bestseller")
      )
    );
    return this.sortProducts(bestsellers, "popularity").slice(0, limit);
  }

  // Get price range for all products
  async getPriceRange() {
    await this.loadProducts();
    if (this.products.length === 0) return { min: 0, max: 0 };

    const prices = this.products.map((product) => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  // Check if product is in stock
  isInStock(product) {
    return product.stock > 0;
  }

  // Get stock status text
  getStockStatus(product) {
    if (product.stock === 0) return "Out of Stock";
    if (product.stock <= 10) return "Low Stock";
    return "In Stock";
  }

  // Get stock status class
  getStockStatusClass(product) {
    if (product.stock === 0) return "out-of-stock";
    if (product.stock <= 10) return "low-stock";
    return "in-stock";
  }

  // Format product options for display
  formatProductOptions(product) {
    if (!product.options) return {};

    const formatted = {};
    Object.keys(product.options).forEach((key) => {
      const values = product.options[key];
      formatted[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        values: Array.isArray(values) ? values : [values],
      };
    });

    return formatted;
  }

  // Get product URL
  getProductUrl(product) {
    return `product.html?id=${product.id}`;
  }

  // Generate product breadcrumbs
  generateBreadcrumbs(product) {
    return [
      { label: "Home", url: "index.html" },
      {
        label: product.category,
        url: `index.html?category=${encodeURIComponent(product.category)}`,
      },
      { label: product.name, url: null },
    ];
  }

  // Calculate average rating
  calculateAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  // Generate star rating HTML
  generateStarRating(rating, maxStars = 5) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    let stars = "";

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars += "★";
    }

    // Half star
    if (hasHalfStar) {
      stars += "☆";
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars += "☆";
    }

    return stars;
  }

  // Get product images (with fallback)
  getProductImages(product) {
    if (!product.images && product.images.length > 0) {
      return product.images;
    }
    return [
      // product.thumbnail ||
      "https://tinasbotanicals.com/wp-content/uploads/2025/01/No-Product-Image-Available.png",
    ];
  }

  // Get main product image
  getMainImage(product) {
    const images = this.getProductImages(product);
    return images[0];
  }

  // Validate product data
  validateProduct(product) {
    const required = ["id", "name", "price", "currency", "category"];
    const missing = required.filter((field) => !product[field]);

    if (missing.length > 0) {
      console.warn(
        `Product validation failed. Missing fields: ${missing.join(", ")}`
      );
      return false;
    }

    return true;
  }
}

// Create global product manager instance
window.productManager = new ProductManager();
