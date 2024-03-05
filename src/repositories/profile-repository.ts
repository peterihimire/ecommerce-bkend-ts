import db from "../database/models";

const Profile = db.Profile;

export const createProfile = async (data: {
  acct_id: string;
  userId: number;
}) => {
  return Profile.create({
    acct_id: data.acct_id,
    userId: data.userId,
  });
};
