// mockProducts.js
export const mockProducts = [
  {
    id: 1,
    title: "collections",
    category: "shoes",
    brand: "Nike",
    name: "Nike Air Max 95 Men's Shoes",
    price: 13383.48,
    sizes: ["US 42", "US 43", "US 44", "US 45"],
    images: [
      `${import.meta.env.BASE_URL}images/nike-95-black.png`,
      `${import.meta.env.BASE_URL}images/nike-airmax-gray.png`,
      `${import.meta.env.BASE_URL}images/nike-95-black.png`,
    ],
  },
  {
    id: 2,
    title: "collections",
    category: "shoes",
    brand: "Nike",
    name: "Nike Air Max 95 Big Bubble",
    price: 13383.48,
    sizes: ["US 42", "US 43", "US 44", "US 45"],
    images: [
      `${import.meta.env.BASE_URL}images/nike-airmax-gray.png`,
      `${import.meta.env.BASE_URL}images/nike-airmax-gray-side.png`,
    ],
  },
];
