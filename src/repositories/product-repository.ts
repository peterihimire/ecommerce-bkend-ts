import db from "../database/models";
const Product = db.Product;

interface Product {
  title?: string;
  slug?: string;
  images?: string[];
  colors?: string[];
  categories?: string[];
  price?: number;
  brand?: string;
  countInStock?: number;
  rating?: number;
  desc?: string;
  sizes?: string[];
  numReviews?: string;
}

export const foundProducts = async () => {
  return Product.findAll({
    attributes: {
      exclude: ["id"],
    },
  });
};

export const foundProductId = async (id: string) => {
  return Product.findOne({
    where: { uuid: id },
  });
};

export const foundProductTitle = async (title: string) => {
  return Product.findOne({
    where: { title: title },
  });
};

export const createProduct = async (data: {
  title: string;
  slug: string;
  images: string[];
  colors: string[];
  categories: string[];
  price: number;
  brand: string;
  countInStock: number;
  rating: number;
  desc: string;
  sizes: string[];
  numReviews: string;
  // adminId: number;
}) => {
  return Product.create({
    title: data.title,
    slug: data.slug,
    images: data.images,
    colors: data.colors,
    categories: data.categories,
    price: data.price,
    brand: data.brand,
    countInStock: data.countInStock,
    rating: data.rating,
    desc: data.desc,
    sizes: data.sizes,
    numReviews: data.numReviews,
    // adminId: data.adminId,
  });
};

export const updateProductId = async (id: string, data: Partial<Product>) => {
  console.log("This is data putu...", data);
  const updated_product = await foundProductId(id);
  console.log("This is the update product...", updated_product);

  // Update the product fields if they are provided in the data
  if (data.title !== undefined) {
    updated_product.title = data.title;
  }
  if (data.slug !== undefined) {
    updated_product.slug = data.slug;
  }
  if (data.images !== undefined) {
    updated_product.images = data.images;
  }
  if (data.colors !== undefined) {
    updated_product.colors = data.colors;
  }
  if (data.categories !== undefined) {
    updated_product.categories = data.categories;
  }
  if (!Number.isNaN(data.countInStock)) {
    updated_product.price = data.price;
  }
  if (data.brand !== undefined) {
    updated_product.brand = data.brand;
  }
  if (!Number.isNaN(data.countInStock)) {
    updated_product.countInStock = data.countInStock;
  }
  if (!Number.isNaN(data.countInStock)) {
    updated_product.rating = data.rating;
  }
  if (data.desc !== undefined) {
    updated_product.desc = data.desc;
  }
  if (data.sizes !== undefined) {
    updated_product.sizes = data.sizes;
  }
  if (data.numReviews !== undefined) {
    // Convert numReviews to a number if provided as a string
    // updated_product.numReviews = parseInt(data.numReviews);
    updated_product.numReviews = data.numReviews;
  }

  return updated_product.save();
};

export const deleteProductId = async (id: string) => {
  const deleted_product = await Product.destroy({
    where: {
      uuid: id,
    },
  });
  return deleted_product;
};
// // Iterate over the properties of the data object
// for (const key in data) {
//   if (data.hasOwnProperty(key)) {
//     // Update only if the property is not undefined
//     if (data[key as keyof Product] !== undefined) {
//       updated_product[key as keyof Product] = data[key as keyof Product];
//     }
//   }
// }
// updated_product.title = data.title;
// updated_product.slug = data.slug;
// updated_product.images = data.images;
// updated_product.colors = data.colors;
// updated_product.categories = data.categories;
// updated_product.price = data.price;
// updated_product.brand = data.brand;
// updated_product.countInStock = data.countInStock;
// updated_product.rating = data.rating;
// updated_product.desc = data.desc;
// updated_product.sizes = data.sizes;
// updated_product.numReviews = data.numReviews;
// const found_product = await foundProductId(id);
// const deleted_product = await found_product.destroy();
// Iterate over the properties of the data object
// for (const key in data) {
//   if (data.hasOwnProperty(key)) {
//     // Update only if the property is not undefined
//     if (
//       data[key as keyof Product] !== undefined ||
//       !Number.isNaN(data[key as keyof Product])
//     ) {
//       updated_product[key as keyof Product] = data[key as keyof Product];
//     }
//   }
// }
