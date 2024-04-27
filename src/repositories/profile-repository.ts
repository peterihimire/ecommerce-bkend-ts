import db from "../database/models";

const Profile = db.Profile;

interface Profile {
  title?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  phone?: string;
}

export const createProfile = async (data: {
  acct_id: string;
  userId: number;
}) => {
  return Profile.create({
    acct_id: data.acct_id,
    userId: data.userId,
  });
};

export const foundProfile = async (acct_id: string) => {
  return Profile.findOne({
    where: { acct_id: acct_id },
  });
};

export const updateProfile = async (
  acct_id: string,
  data: Partial<Profile>
) => {
  console.log("This is data putu...", data);
  const updated_profile = await foundProfile(acct_id);
  console.log("This is the update product...", updated_profile);

  // Update the product fields if they are provided in the data
  if (data.title !== undefined) {
    updated_profile.title = data.title;
  }
  if (data.first_name !== undefined) {
    updated_profile.first_name = data.first_name;
  }
  if (data.last_name !== undefined) {
    updated_profile.last_name = data.last_name;
  }
  if (data.gender !== undefined) {
    updated_profile.gender = data.gender;
  }
  if (data.phone !== undefined) {
    updated_profile.phone = data.phone;
  }

  return updated_profile.save();
};
