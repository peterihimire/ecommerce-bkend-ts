import db from "../database/models";
const Contact = db.Contact;

interface Contact {
  fullname?: string;
  company?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export const foundContacts = async () => {
  return Contact.findAll({
    attributes: {
      exclude: ["id"],
    },
  });
};

export const foundContactId = async (id: string) => {
  return Contact.findOne({
    where: { uuid: id },
  });
};

export const foundContactEmail = async (email: string) => {
  return Contact.findOne({
    where: { email: email },
  });
};

export const createContact = async (data: {
  fullname: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  return Contact.create({
    fullname: data.fullname,
    company: data.company,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
  });
};

export const updateContactId = async (id: string, data: Partial<Contact>) => {
  console.log("This is data putu...", data);
  const updated_contact = await foundContactId(id);
  console.log("This is the update contact...", updated_contact);

  // Update the product fields if they are provided in the data
  if (data.fullname !== undefined) {
    updated_contact.name = data.fullname;
  }
  if (data.company !== undefined) {
    updated_contact.desc = data.company;
  }
  return updated_contact.save();
};

export const deleteContactId = async (id: string) => {
  const deleted_contact = await Contact.destroy({
    where: {
      uuid: id,
    },
  });
  return deleted_contact;
};
