import fs from "fs";
import path from "path";
import { jsPDF } from "jspdf";
import { FontStyle } from "@/pdf/types-pdf";

const addFont = (doc: jsPDF, fontStyle: FontStyle) => {
  const fontDir = path.resolve(__dirname, "../fonts/roboto");
  const fileName = `roboto-${fontStyle}.ttf`;
  const fileRoboto = fs.readFileSync(path.resolve(fontDir, fileName), {
    encoding: "binary",
  });
  return doc
    .addFileToVFS(fileName, fileRoboto)
    .addFont(fileName, "Roboto", fontStyle);
};

export const addFonts = (doc: jsPDF) => {
  const fontStyles: FontStyle[] = ["normal", "bold", "italic", "bolditalic"];
  fontStyles.forEach((fontStyle) => addFont(doc, fontStyle));
};
