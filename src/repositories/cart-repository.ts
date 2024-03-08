import db from "../database/models";
const Cart = db.Cart;
const Product = db.Product;
const CartProduct = db.CartProduct;

export const foundCartId = async (id: number) => {
  return Cart.findOne({
    where: { id: id },
    attributes: {
      exclude: ["id", "createdAt", "updatedAt", "userId"],
    },
    include: [
      {
        attributes: {
          exclude: [
            "id",
            "createdAt",
            "updatedAt",
            "colors",
            "categories",
            "brand",
            "countInStock",
            "rating",
            "desc",
            "sizes",
            "numReviews",
            "images",
            "slug",
            "price",
            "title",
          ],
        },
        model: Product,
        as: "products",
        through: {
          model: CartProduct,
          as: "cart_products", // Alias for the through model
          attributes: ["quantity", "title", "price"], // Include additional attributes from CartProduct
        },
      },
    ],
  });
};

export const foundCart = async (id: string) => {
  return Cart.findOne({
    where: { uuid: id },
    include: [
      {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        model: Product,
        as: "products",
      },
    ],
  });
};

export const foundUserCartId = async (id: number) => {
  return Cart.findOne({
    where: { userId: id },
    include: [
      {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        model: Product,
        as: "products",
      },
    ],
  });
};

export const foundUserCart = async (id: string) => {
  return Cart.findOne({
    where: { uuid: id },
    include: [
      {
        attributes: { exclude: ["createdAt", "updatedAt"] },
        model: Product,
        as: "products",
      },
    ],
  });
};

export const addToCart = async () => {
  return Cart.findOne({
    // where: { uuid: id },
  });
};
// include: [
//   {
//     model: CartProduct,
//     as: "cartProducts", // Alias for the association
//     include: [
//       {
//         model: Product, // Assuming Product is imported
//         as: "product", // Alias for the association
//       },
//     ],
//   },
// ],
