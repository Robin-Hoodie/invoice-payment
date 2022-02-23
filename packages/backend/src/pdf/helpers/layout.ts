import { jsPDF } from "jspdf";

const round = (number: number, fractionDigits = 2) =>
  Number(number.toFixed(fractionDigits));

export const getOffsetsX = (doc: Pick<jsPDF, "getBounds">) => {
  const { width: docWidth } = doc.getBounds();
  return {
    LEFT: round(docWidth * 0.1),
    MIDDLE_LEFT: round(docWidth * 0.26),
    MIDDLE: round(docWidth * 0.42),
    MIDDLE_RIGHT: round(docWidth * 0.58),
    RIGHT: round(docWidth * 0.74),
  };
};

export type OffsetsX = ReturnType<typeof getOffsetsX>;
