import moment from "moment";
import imageToBase64 from "image-to-base64";

export const generateReciept = async (data: {}) => {
  console.log(data);
  return {
    // playground requires you to assign document definition to a variable called dd

    content: [
      {
        columns: [
          {
            image:
              "data:image/png;base64,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",
            width: 80,
          },
          //   {
          //     text: [
          //       { text: "BILL FROM: \n", margin: [5, 15, 0, 0] },
          //       {
          //         text: "National Teachers' Institute (NTI),\nKaduna, Nigeria.",
          //         fontSize: 15,
          //       },
          //     ],
          //     margin: [10, 7, 0, 0],
          //     width: 250,
          //   },
          {
            fontSize: 12,
            text: [
              { text: "For Support and Enquires\n", bold: true, fontSize: 15 },
              {
                text: "0700225569684 \n SMS: 09064579779\n WhatsApp: 09097807503",
              },
            ],
            alignment: "right",
          },
        ],
      },
      {
        table: {
          widths: ["*", "*", "*"],
          headerRows: 1,
          body: [
            [
              { text: "", fillColor: "000", style: "tableHeader", bold: true },
              { text: "", fillColor: "#000" },
              { text: "", fillColor: "#000" },
            ],
          ],
        },
        // layout: 'headerLineOnly',
        margin: [0, 20],
      },
      //   {
      //     text: "PAYMENT INVOICE",
      //     bold: true,
      //     fontSize: 20,
      //     margin: [15, 30, 0, 15],
      //   },
      {
        table: {
          widths: [40, "*", "*", "*"],
          body: [
            [
              { text: `Bill to:`, alignment: "left", bold: true },
              "Peter Ihimire",
              { text: `Order id:`, alignment: "right", bold: true },
              { text: `849494003`, alignment: "right" },
            ],
            [
              ``,
              "peterihimire@gmail.com",
              { text: `Order date:`, alignment: "right", bold: true },
              { text: `22-02-2003`, alignment: "right" },
            ],
            [
              ``,
              "Lagos, Nigeria",
              { text: `Due date:`, alignment: "right", bold: true },
              { text: `93903848849`, alignment: "right" },
            ],
            // [``, "", "",""],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },
      {
        style: "tableExample",
        table: {
          widths: [200, "*", "*", "*"],
          headerRows: 1,
          body: [
            [
              {
                text: "Description",
                // fillColor: "#46C35F",
                color: "#000",
                bold: true,
                fontSize: 12,
                margin: [15, 5],
              },
              {
                text: "Quantity",
                // fillColor: "#46C35F",
                color: "#000",
                bold: true,
                fontSize: 12,
                margin: [15, 5],
              },
              {
                text: "Price",
                // fillColor: "#46C35F",
                color: "#000",
                bold: true,
                fontSize: 12,
                alignment: "right",
                margin: [15, 5],
              },
              {
                text: "Amount",
                // fillColor: "#46C35F",
                color: "#000",
                bold: true,
                fontSize: 12,
                alignment: "right",
                margin: [15, 5],
              },
            ],
            [
              {
                text: `NTI First Semester Form Fee for English/Math`,
                margin: [15, 10],
                fontSize: 12,
              },
              { text: `2`, margin: [15, 10] },
              {
                text: `₦20000.00`,
                alignment: "right",
                margin: [15, 10],
                fontSize: 12,
              },
              {
                text: `₦20000.00`,
                alignment: "right",
                fontSize: 12,
                margin: [15, 10],
              },
            ],
          ],
        },
        layout: "borders",
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: [280, "*", "*"],
          headerRows: 1,
          body: [
            [
              "",
              {
                text: "TOTAL",
                // fillColor: "#46C35F",
                color: "#000",
                fontSize: 14,
                margin: [10, 5],
              },
              {
                text: `₦20000`,
                alignment: "right",
                color: "#000",
                // fillColor: "#46C35F",
                fontSize: 14,
                margin: [15, 5],
              },
            ],
          ],
        },
        // layout: "noBorders",
        layout: "borders",
        margin: [0, 0, 0, 20],
      },

      {
        text: "Terms and conditions",
        bold: true,
        margin: [15, 50, 0, 15],
      },

      {
        text: "Every time you select a line of text, the utility will bring up a small menu with suggested actions like copy and paste, as well as translation, spell check, word count, and more useful stuff! Once you give it a go, PopClip will likely become your most-used and most-loved instant text helper.",
        margin: [15, 0, 0, 0],
      },
      {
        // image: paymentImage,
        // width: 100,
        // margin: [15, 0, 0, 0],
        // alignment: "right",
      },
    ],
    styles: {
      header: {
        bold: true,
        fontSize: 16,
        margin: [0, 25, 0, 10],
      },
      text: {
        fontSize: 12,
        margin: [15, 2, 0, 0],
      },
    },
  };
};

export const generatePDFFile = async (type: string, data: {}) => {
  let result;
  switch (type) {
    case "invoice":
      result = await generateReciept(data);
      break;
    case "receipt":
      result = await generateReciept(data);
      break;
    default:
      console.log("Unknown PDF file.");
  }
  return result;
};
