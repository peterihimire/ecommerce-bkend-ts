import db from "../database/models";
const Product = db.Product;

interface Product {
  title?: string;
  slug?: string;
  images?: string[];
  color?: string;
  categories?: string[];
  price?: number;
  brand?: string;
  countInStock?: number;
  rating?: number;
  desc?: string;
  size?: string;
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
  color: string;
  categories: string[];
  price: number;
  brand: string;
  countInStock: number;
  rating: number;
  desc: string;
  size: string;
  numReviews: string;
  // adminId: number;
}) => {
  return Product.create({
    title: data.title,
    slug: data.slug,
    images: data.images,
    color: data.color,
    categories: data.categories,
    price: data.price,
    brand: data.brand,
    countInStock: data.countInStock,
    rating: data.rating,
    desc: data.desc,
    size: data.size,
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
  if (data.color !== undefined) {
    updated_product.color = data.color;
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
  if (data.size !== undefined) {
    updated_product.size = data.size;
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
