import { jsPDF } from "jspdf";
import { FontStyle } from "@/pdf/types-pdf";
import { addFonts } from "@/pdf/helpers/setup-fonts";

export enum FontSize {
  LARGE = 14,
  MEDIUM = 10,
  SMALL = 8,
}

export enum TextColor {
  BLACK = "000000",
  BRAND_PRIMARY = "0070c0",
}

const fontSizeDefault = FontSize.MEDIUM;
const textColorDefault = TextColor.BLACK;
const fontStyleDefault: FontStyle = "normal";
const fontDefault = "Roboto";

export const createjsPDFEnhanced = () => {
  jsPDF.API.init = function (this: jsPDF) {
    addFonts(this);
    this.setFont(fontDefault, fontStyleDefault)
      .setFontSize(fontSizeDefault)
      .setTextColor(textColorDefault);
    return this;
  };

  jsPDF.API.textEnhanced = function (
    this: jsPDF,
    text,
    x,
    y,
    {
      fontSize = fontSizeDefault,
      fontStyle = fontStyleDefault,
      textColor = textColorDefault,
      ...options
    } = {},
    transform
  ) {
    const isDefaultFontSize = fontSize === fontSizeDefault;
    const isDefaultFontStyle = fontStyle === fontStyleDefault;
    const isDefaultTextColor = textColor === textColorDefault;
    if (!isDefaultFontStyle) {
      this.setFont(fontDefault, fontStyle);
    }
    if (!isDefaultFontSize) {
      this.setFontSize(fontSize);
    }
    if (!isDefaultTextColor) {
      this.setTextColor(textColor);
    }
    this.text(text, x, y, options, transform);
    if (!isDefaultFontStyle) {
      this.setFont(fontDefault, fontStyleDefault);
    }
    if (!isDefaultFontSize) {
      this.setFontSize(fontSizeDefault);
    }
    if (!isDefaultTextColor) {
      this.setTextColor(textColorDefault);
    }
    return this;
  };

  jsPDF.API.getBounds = function (this: jsPDF) {
    return {
      width: this.internal.pageSize.width,
      height: this.internal.pageSize.height,
    };
  };

  return new jsPDF().init();
};
