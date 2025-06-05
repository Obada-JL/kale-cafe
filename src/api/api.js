const BASE_URL = "http://kale-cafe.com/api";

export const api = {
  async fetchProducts(route, selectedCategoryId) {
    console.log("selectedCategoryId", selectedCategoryId);
    const endpoint = route.startsWith("/") ? route : `/${route}`;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) {
      throw new Error(`Products not found for category ID: ${selectedCategoryId}`);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter products by category ObjectId
    const filteredProducts = data.filter((product) => {
      // Handle both populated category object and ObjectId string
      const productCategoryId = typeof product.category === 'object' && product.category !== null
        ? product.category._id 
        : product.category;
      
      // Convert both to string for comparison
      return String(productCategoryId) === String(selectedCategoryId);
    });

    console.log(`Filtered ${filteredProducts.length} products from ${data.length} total for category ${selectedCategoryId}`);
    
    // Sort products by price
    return filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  },

  async fetchImages(route, selectedCategoryId) {
    const endpoint = route.startsWith("/") ? route : `/${route}`;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Images response:", data);

    // Filter images by category ObjectId
    const filteredImages = data.filter((image) => {
      // Handle both populated category object and ObjectId string
      const imageCategoryId = typeof image.category === 'object' && image.category !== null
        ? image.category._id 
        : image.category;
      
      // Convert both to string for comparison
      return String(imageCategoryId) === String(selectedCategoryId);
    });

    console.log(`Filtered ${filteredImages.length} images from ${data.length} total for category ${selectedCategoryId}`);
    return filteredImages;
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
