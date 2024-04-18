"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundOrderId = exports.addCartProds = void 0;
const models_1 = __importDefault(require("../database/models"));
const Order = models_1.default.Order;
const Product = models_1.default.Product;
const OrderProduct = models_1.default.OrderProduct;
const addCartProds = async (dataArray) => {
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
exports.addCartProds = addCartProds;
const foundOrderId = async (id) => {
    return Order.findOne({
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
                    model: OrderProduct,
                    as: "order_products", // Alias for the through model
                    attributes: [
                        "id",
                        "quantity",
                        "title",
                        "price",
                        "orderId",
                        "productId",
                    ], // Include additional attributes from CartProduct
                },
            },
        ],
    });
};
exports.foundOrderId = foundOrderId;
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
