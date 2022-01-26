import XLSX from "xlsx";
import fs from "fs";
import path from "path";
var pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
import axios from "axios";
var companies = require("../comp.json");
var contacts = require("../annots3.json");

const App = () => {
  const wb = XLSX.utils.book_new();
  var first_sheet_name = wb.SheetNames[1];
  var worksheet = wb.Sheets[first_sheet_name];
  let aoa = [
    [
      "company",
      "location",
      "firstName",
      "lastName",
      "title",
      "email",
      "phone",
      "fax",
      "mobile",
      "address1",
      "address2",
      "city",
      "county",
      "zipCode",
      "state",
      "codes",
    ],
  ];
  /* Find desired cell */
  contacts.forEach((x, i) => {
    let codeArray = x.codes.map((code) => `${code.code} ${code.name}`);
    let codeString = codeArray.join();
    x.contacts.map((cont) => {
      aoa.push([
        companies.locations[i].companyName,
        companies.locations[i].locationName,
        cont.firstName,
        cont.lastName,
        cont.title,
        cont.email,
        cont.phone,
        cont.fax,
        cont.mobile,
        x.locationInformation.physicalAddress.address1,
        x.locationInformation.physicalAddress.address2,
        x.locationInformation.physicalAddress.city,
        x.locationInformation.physicalAddress.county,
        x.locationInformation.physicalAddress.zipCode,
        x.locationInformation.physicalAddress.state?.name || "",
        codeString,
      ]);
    });
  });
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(wb, ws, "1");
  XLSX.writeFile(wb, "final.xlsx");
};
App();

// const App2 = async () => {
//   try {
//     const pdfFile = "C:/Users/mmurnane/projects/excel-update/src/test.pdf";
//     const pdf = await pdfjsLib.getDocument(pdfFile).promise;
//     const page = await pdf.getPage(1);
//     /* const annots = await page.getAnnotations();
//     const text = await page.getTextContent();
//     const items = annots.filter((x) => {
//       return x.title === "mmurnane";
//     });
//     fs.writeFileSync("./annots.json", JSON.stringify(annots));
//     fs.writeFileSync("./annots2.json", JSON.stringify(text)); */
//     const data = await pdf.getPageLabels();
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };

//App2();

// const App3 = async () => {
//   let objArray = companies.locations;
//   try {
//     const array = await Promise.all(
//       objArray.map(async (x: any) => {
//         const data: any = await axios.get(
//           `https://apicc.smartbidnet.com/location/${x.locationKey}?PassportKey=4C3DF736B02548EE232BB4D6F74386E236E1FA23&ResultType=%7BResultType%7D`
//         );
//         return data.data;
//       })
//     );
//     fs.writeFileSync("./annots3.json", JSON.stringify(array));
//   } catch (error) {
//     console.log(error);
//   }
// };
// App3();
