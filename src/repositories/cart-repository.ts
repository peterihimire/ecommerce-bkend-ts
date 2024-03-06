import db from "../database/models";
const Cart = db.Cart;

export const foundCart = async (id: string) => {
  return Cart.findOne({
    where: { uuid: id },
  });
};

export const addToCart = async () => {
  return Cart.findOne({
    // where: { uuid: id },
  });
};
