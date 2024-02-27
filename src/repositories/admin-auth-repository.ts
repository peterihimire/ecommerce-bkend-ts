import db from "../database/models";
const Admin = db.Admin;

export const foundAdmin = async (email: string) => {
  return Admin.findOne({
    where: { email: email },
  });
};

export const createAdmin = async (data: {
  name: string;
  user_name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  return Admin.create({
    name: data.name,
    user_name: data.user_name,
    email: data.email,
    password: data.password,
    phone: data.phone,
  });
};
