import db from "../database/models";
import { createProfile } from "../repositories/profile-repository";
const User = db.User;
const Profile = db.Profile;
const Cart = db.Cart;
const CartProduct = db.CartProduct;

export const foundUser = async (email: string) => {
  return User.findOne({
    where: { email: email },
    include: [
      {
        attributes: {
          exclude: ["id", "createdAt", "updatedAt", "userId"],
        },
        model: Profile,
        as: "profile",
        // include: [
        //   {
        //     attributes: {
        //       exclude: ["id", "createdAt", "updatedAt", "profileId", "acct_id"],
        //     },
        //     model: Business,
        //     as: "business",
        //   },
        //   {
        //     attributes: {
        //       exclude: ["id", "createdAt", "updatedAt", "profileId"],
        //     },
        //     model: Instance,
        //     as: "instances",
        //   },
        //   {
        //     attributes: {
        //       exclude: ["id", "createdAt", "updatedAt", "profileId"],
        //     },
        //     model: Channel,
        //     as: "channels",
        //   },
        // ],
      },
      {
        attributes: {
          exclude: ["id", "createdAt", "updatedAt", "userId"],
        },
        model: Cart,
        as: "cart",
        // through: {
        //   attributes: [],
        // },
      },
    ],
  });
};

export const existingAcctId = async (acct_id: string) => {
  return User.findOne({
    where: { acct_id: acct_id },
  });
};

export const createUser = async (data: {
  email: string;
  password: string;
  acct_id: string;
}) => {
  return User.create({
    email: data.email,
    password: data.password,
    acct_id: data.acct_id,
  });
};

// export const createProfile = async (data: {
//   // first_name: string;
//   // last_name: string;
//   acct_id: string;
//   userId: number;
// }) => {
//   return Profile.create({
//     // first_name: data.first_name,
//     // last_name: data.last_name,
//     acct_id: data.acct_id,
//     userId: data.userId,
//   });
// };

// module.exports = {
//   foundUser,
//   existingAcctId,
//   createUser,
//   createProfile,
// };
