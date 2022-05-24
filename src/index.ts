import {
  DynamoDBClient,
  BatchExecuteStatementCommand,
} from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import zlib from "zlib";
import fs from "fs";
import type { Readable } from "stream";

const s3 = new S3Client({ region: "us-east-1" });

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

const App = async () => {
  try {
    const zippedJson = await s3.send(
      new GetObjectCommand({
        Key: "AWSDynamoDB/01653391142364-cee69543/data/soqv77chfe4ajlut5my64y236e.json.gz",
        Bucket: "mike-m",
      })
    );

    const result = zippedJson.Body as Readable;
    const unzip = zlib.createGunzip();
    const writeStream = fs.createWriteStream(`./ddb.json`, "utf-8");
    result.pipe(unzip).pipe(writeStream);
    await new Promise((resolve) => writeStream.on("finish", resolve));
    let data = fs.readFileSync(`./ddb.json`).toString();
    const sortedArrayOfObjects = data
      .replace(/\n/g, "&&")
      .split("&&")
      .map((x) => {
        try {
          console.log(x);
          return JSON.parse(x);
        } catch (error) {
          return JSON.parse("{}");
        }
      })
      .map((obj) => (obj.Item ? unmarshall(obj.Item) : {}));
    fs.writeFileSync("./final.json", JSON.stringify(sortedArrayOfObjects));
  } catch (error) {
    console.log(error);
  }
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
