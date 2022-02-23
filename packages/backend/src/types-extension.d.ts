// Defined on globalThis in @shelf/jest-mongodb
declare var __MONGO_URI__: string;
declare var __MONGO_DB_NAME__: string;

declare module "jspdf" {
  import { FontSize, TextColor } from "@/pdf/helpers/jspdf-enhanced";
  import { FontStyle } from "@/pdf/types-pdf";

  type ParametersText = Parameters<jsPDF["text"]>;
  type ParameterTextOptions = ParametersText[3] & {
    fontSize?: FontSize;
    fontStyle?: FontStyle;
    textColor?: TextColor;
  };

  interface jsPDFAPI {
    init: () => jsPDF;
    textEnhanced: (
      text: ParametersText[0],
      x: ParametersText[1],
      y: ParametersText[2],
      options?: ParameterTextOptions,
      transform?: ParametersText[4]
    ) => jsPdf;
    getBounds: () => {
      width: number;
      height: number;
    };
  }

  interface jsPDF {
    init: jsPDFAPI["init"];
    textEnhanced: jsPDFAPI["textEnhanced"];
    getBounds: jsPDFAPI["getBounds"];
  }
}

declare module "*.png";
