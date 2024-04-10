import db from "../database/models";
const Order = db.Order;
const Product = db.Product;
const OrderProduct = db.OrderProduct;

export const addCartProds = async (dataArray: any[]) => {
  const orderProducts = [];
  for (const data of dataArray) {
    const orderProduct = await OrderProduct.create({
      orderId: data.orderId,
      productId: data.prodId,
      quantity: data.quantity,
      uuid: data.uuid,
      title: data.title,
      price: data.price,
    });
    orderProducts.push(orderProduct);
  }
  return orderProducts;
};

// export const foundCartId = async (id: number) => {
//   return Cart.findOne({
//     where: { id: id },
//     attributes: {
//       exclude: ["id", "createdAt", "updatedAt", "userId"],
//     },
//     include: [
//       {
//         attributes: {
//           exclude: [
//             "id",
//             "createdAt",
//             "updatedAt",
//             "colors",
//             "categories",
//             "brand",
//             "countInStock",
//             "rating",
//             "desc",
//             "sizes",
//             "numReviews",
//             "images",
//             "slug",
//             "price",
//             "title",
//           ],
//         },
//         model: Product,
//         as: "products",
//         through: {
//           model: CartProduct,
//           as: "cart_products", // Alias for the through model
//           attributes: ["quantity", "title", "price"], // Include additional attributes from CartProduct
//         },
//       },
//     ],
//   });
// };

// export const foundCart = async (id: string) => {
//   return Cart.findOne({
//     where: { uuid: id },
//     include: [
//       {
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//         model: Product,
//         as: "products",
//       },
//     ],
//   });
// };

// export const foundUserCartId = async (id: number) => {
//   return Cart.findOne({
//     where: { userId: id },
//     include: [
//       {
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//         model: Product,
//         as: "products",
//       },
//     ],
//   });
// };

// export const foundUserCart = async (id: string) => {
//   return Cart.findOne({
//     where: { uuid: id },
//     include: [
//       {
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//         model: Product,
//         as: "products",
//       },
//     ],
//   });
// };

// export const foundCartProd = async (cartId: number, prodId: number) => {
//   return CartProduct.findOne({
//     where: {
//       cartId: cartId,
//       productId: prodId,
//     },
//   });
// };

// export const addCartProd = async (data: {
//   cartId: number;
//   prodId: number;
//   quantity: number;
//   addedBy: string;
//   uuid: string;
//   addedAt: Date;
//   title: string;
//   price: number;
// }) => {
//   return CartProduct.create({
//     cartId: data.cartId,
//     productId: data.prodId,
//     quantity: data.quantity,
//     addedBy: data.addedBy,
//     uuid: data.uuid,
//     addedAt: data.addedAt,
//     title: data.title,
//     price: data.price,
//   });
// };

// export const removeCartProd = async (cartId: number, prodId: number) => {
//   return CartProduct.destroy({
//     where: {
//       cartId: cartId,
//       productId: prodId,
//     },
//   });
// };
