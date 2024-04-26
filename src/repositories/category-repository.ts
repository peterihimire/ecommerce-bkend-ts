import db from "../database/models";
const Category = db.Category;

interface Category {
  name?: string;
  desc?: string;
}

export const foundCategories = async () => {
  return Category.findAll({
    attributes: {
      exclude: ["id"],
    },
  });
};

export const foundCategoryId = async (id: string) => {
  return Category.findOne({
    where: { uuid: id },
  });
};

export const foundCategoryName = async (name: string) => {
  return Category.findOne({
    where: { name: name },
  });
};

export const createCategory = async (data: {
  name: string;
  desc: string;

}) => {
  return Category.create({
    name: data.name,
    desc: data.desc,
  
  });
};

export const updateCategoryId = async (id: string, data: Partial<Category>) => {
  console.log("This is data putu...", data);
  const updated_category = await foundCategoryId(id);
  console.log("This is the update category...", updated_category);

  // Update the product fields if they are provided in the data
  if (data.name !== undefined) {
    updated_category.name = data.name;
  }
  if (data.desc !== undefined) {
    updated_category.desc = data.desc;
  }
  return updated_category.save();
};

export const deleteCategoryId = async (id: string) => {
  const deleted_category = await Category.destroy({
    where: {
      uuid: id,
    },
  });
  return deleted_category;
};
