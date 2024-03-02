import db from "../database/models";
const Product = db.Product;

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
