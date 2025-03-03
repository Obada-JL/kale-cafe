const BASE_URL = "https://api.kale-cafe.com";

export const api = {
  async fetchProducts(route, selectedCategory) {
    const endpoint = route.startsWith("/") ? route : `/${route}`;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) {
      throw new Error(`Products not found for category: ${selectedCategory}`);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    const filteredProducts = data.filter(
      (product) =>
        product.category?.trim().toLowerCase() ===
        selectedCategory?.trim().toLowerCase()
    );

    // Sort products by price
    return filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  },

  async fetchImages(route, selectedCategory) {
    const endpoint = route.startsWith("/") ? route : `/${route}`;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    const data = await response.json();
    // Add logging to debug the response
    console.log("Images response:", data);

    // Make category comparison case-insensitive
    return data.filter(
      (image) =>
        image.category?.trim().toLowerCase() ===
        selectedCategory?.trim().toLowerCase()
    );
  },

  async fetchSpecialImages() {
    const response = await fetch(`${BASE_URL}/api/getSpecialImages`, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) {
      throw new Error("Special images not found");
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch special images: ${response.statusText}`);
    }

    return response.json();
  },
};
