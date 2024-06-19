import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import { foundAdmin } from "../repositories/admin-auth-repository";
import {
  createContact,
  foundContactId,
  foundContacts,
  foundContactEmail,
  updateContactId,
  deleteContactId,
} from "../repositories/contact-repository";

const SibApiV3Sdk = require("sib-api-v3-typescript");

export const addContact: RequestHandler = async (req, res, next) => {
  const { fullname, email, phone, subject, message, company } = req.body;

  try {
    const payload = {
      fullname: fullname as string,
      email: email as string,
      phone: phone as string,
      company: company as string,
      subject: subject as string,
      message: message as string,
    };

    // BREVO TYPESCRIPT
    // Initialize the TransactionalEmailsApi instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Set your Sendinblue API key
    const apiKey = apiInstance.authentications["apiKey"];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Replace with your API key

    // Create a new instance of SendSmtpEmail to specify email details
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Set the sender details
    sendSmtpEmail.sender = {
      name: "Benkih",
      email: "support@benkih.com",
    };

    // Set the recipient email address
    sendSmtpEmail.to = [{ email }];

    // Set the subject and content of the email
    sendSmtpEmail.subject = "Message Acknowledgement";
    sendSmtpEmail.htmlContent = `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    @media screen and (max-width: 600px) {
                      .content {
                          width: 100% !important;
                          display: block !important;
                          padding: 0px !important;
                      }
                       .container {
                          padding: 10px !important;
                      }
                       .wrapper {
                          width: 100% !important;
                          display: block !important;
                     
                      }
                      .header {
                          padding-bottom: 10px !important;
                          font-size: 20px !important;
                      }
                       .logo{
                          width: 40px !important;
                          margin-right: 4px !important;
                        }
                      .body{
                          padding-bottom: 10px !important;
                          padding-top: 10px !important;
                      }

                      .footer {
                     
                          padding-top: 10px !important;
                      }
                    }
                  </style>
                  <title>benkih e-commeerce</title>
                </head>
                <body style="font-family: 'Poppins', Arial, sans-serif">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 20px;">
                         <table class="wrapper" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                           <tr>
                           <td class="container" align="center" style="padding: 40px;">
                          <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 0px solid #cccccc;">
                              <!-- Header -->
                              <tr>
                                  <td class="header" style="padding-bottom: 40px; text-align: left; color: grey; font-size: 30px; font-weight:bolder; border-bottom: 1px solid #cccccc;">
                                    <img src="https://res.cloudinary.com/dymhdpka1/image/upload/v1714244037/peterihimire-logo_whf5lr.png" alt="Benkih E-commerce Logo" style="width: 80px; height: auto; vertical-align: middle; margin-right: 8px;" class="logo" /> Benkih
                                  </td>
                              </tr>

                              <!-- Body -->
                              <tr>
                                  <td class="body" style="padding-bottom: 40px;padding-top: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                  <strong>Hello ${fullname},</strong> <br>
                                  Welcome to the Benkih e-commerce, we are glad you decided to take the step to check out what our community has to offer you.<br><br>
                                  We recieved your message, and we will follow through immediately.
                                     
                                  </td>
                              </tr>

                              <!-- Footer -->
                              <tr>
                                <td class="footer" style="padding-top: 40px; text-align: left; color: #333333;; font-size: 14px; border-top: 1px solid #cccccc;">
                                  This message was sent automatically by <a href='https://support@benkih.com' style="color: blue; text-decoration: none;" target="_blank">support@benkih.com</a>. Do not reply to this message as no response will be given.
                                </td>
                              </tr>
                          </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                      </tr>
                  </table>
                </body>
              </html>`;

    // Send the email
    apiInstance
      .sendTransacEmail(sendSmtpEmail)
      .then((data: any) => {
        // console.log("Email sent successfully. Response:", data);
        // Handle success
        res.status(httpStatusCodes.CREATED).json({
          status: "success",
          msg: `We've recieved your message. Confirmation message sent to ${email}.`,
        });
      })
      .catch((error: any) => {
        console.error("Error sending email:", error);
        // Handle error
        return next(
          new BaseError(
            error.response.body.message,
            httpStatusCodes.INTERNAL_SERVER
          )
        );
      });

    const createdContact = await createContact(payload);
    console.log("This is message received...", createdContact);

    // res.status(201).json({
    //   status: "success",
    //   msg: "Message recieved, we sent you a confirmation email!",
    // });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// GET ALL CONTACTS BY ADMIN
export const getAllContacts: RequestHandler = async (req, res, next) => {
  const { admin } = req.session;
  const email = admin?.email;
  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    const allContacts = await foundContacts();
    if (!allContacts) {
      return next(new BaseError("No contact found.", httpStatusCodes.CONFLICT));
    }
    const contacts = await allContacts;

    console.log(contacts);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "All recieved contacts!.",
      data: contacts,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// GET A SINGLE CONTACT BY ADMIN
export const getContact: RequestHandler = async (req, res, next) => {
  const { cId } = req.params;
  const { admin } = req.session;
  const email = admin?.email;

  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    const existingContact = await foundContactId(cId);
    console.log(existingContact);
    if (!existingContact) {
      return next(
        new BaseError(`Contact with the  id ${cId} does not exist.`, 404)
      );
    }

    const contact = await existingContact;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Contact info",
      data: contact,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// DELETE CONTACT BY ADMIN
export const deleteContact: RequestHandler = async (req, res, next) => {
  const { cId } = req.params;
  const { admin } = req.session;
  const email = admin?.email;

  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    const foundContact = await foundContactId(cId);
    if (!foundContact) {
      return next(
        new BaseError(`Contact with that UserId ${cId} does not exist.`, 404)
      );
    }
    await deleteContactId(cId);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Contact Deleted",
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

module.exports = {
  addContact,
  getAllContacts,
  getContact,
  deleteContact,
};
