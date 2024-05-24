export type CustomUser = {
  id: string;
  email: string;
};
export type PassportUser = {
  user: string;
};

export type Admin = {
  id: string;
  email: string;
};

export type Cart = {
  userId: string | null;
  cartId: string;
  products: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalQty: number;
  totalPrice: number;
};

export type Client = {
  email: string;
  password: string;
  hashes: string;
};
