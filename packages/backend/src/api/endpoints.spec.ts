import axios from "axios";
import { setupEndpoints } from "@/api/endpoints";
import { generateInvoice } from "@/pdf/generation";

jest.mock("@/pdf/generation");

const mockedGenerateInvoice = jest.mocked(generateInvoice);

describe("Endpoints", () => {
  const port = 3000;
  const server = setupEndpoints().startExpressServer(port);
  const axiosInstance = axios.create({
    baseURL: `http://localhost:${port}`,
    validateStatus: (status) => status < 500,
  });

  afterAll(async () => {
    // Wait for server close before restarting. Useful when watching tests.
    await new Promise((resolve) => server.close(resolve));
  });

  const endpointInvoiceGenerate = "invoice/generate";

  it("should return a validation error for passing a missing 'customerNameShort'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      customerNameShort: undefined,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "customerNameShort",
      })
    );
  });

  it("should return a validation error for passing a zero-length 'customerNameShort'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      customerNameShort: "",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "customerNameShort",
      })
    );
  });

  it("should return a validation error for passing a missing 'projectNameShort'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      projectNameShort: "",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "projectNameShort",
      })
    );
  });

  it("should return a validation error for passing a zero-length 'projectNameShort'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      projectNameShort: "",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "projectNameShort",
      })
    );
  });

  it("should return a validation error for passing a missing 'payeeNameShort'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      payeeNameShort: "",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "payeeNameShort",
      })
    );
  });

  it("should return a validation error for passing a zero-length 'payeeNameShort'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      payeeNameShort: "",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "payeeNameShort",
      })
    );
  });

  it("should return a validation error for pasing a missing 'lang'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      lang: undefined,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "lang",
      })
    );
  });

  it("should return a validation error for passing an unknown 'lang'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      lang: "fr",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "lang",
      })
    );
  });

  it("should not return a validation error for a missing 'dueInDays'", async () => {
    const { data } = await axiosInstance.post(endpointInvoiceGenerate, {
      dueInDays: undefined,
    });
    expect(data.errors).not.toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "dueInDays",
      })
    );
  });

  it("should return a validation error for passing a negative 'dueInDays'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      dueInDays: -1,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "dueInDays",
      })
    );
  });

  it("should return a validation error for passing a floating point number for 'dueInDays'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      dueInDays: 30.01,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "dueInDays",
      })
    );
  });

  it("should return a validation error for passing a string for 'dueInDays'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      dueInDays: "30",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "dueInDays",
      })
    );
  });

  it("should return a validation error for passing an invalid date string for 'dateInvoice'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      dateInvoice: "thisisnotadate",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "dateInvoice",
      })
    );
  });

  it("should convert the string for 'dateInvoice' to a Date object", async () => {
    await axiosInstance.post(endpointInvoiceGenerate, {
      projectNameShort: "project",
      customerNameShort: "customer",
      payeeNameShort: "payee",
      lang: "en",
      dateInvoice: "2022-01-01T00:00:00.000Z",
      hoursWorked: 100,
    });
    expect(mockedGenerateInvoice).toHaveBeenCalledWith(
      expect.objectContaining({
        dateInvoice: new Date("2022-01-01T00:00:00.000Z"),
      })
    );
  });

  it("should return a validation error for passing a negative 'hoursWorked'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      hoursWorked: -1,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "hoursWorked",
      })
    );
  });

  it("should return a validation error for passing a floating point number for 'hoursWorked'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      hoursWorked: 30.01,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "hoursWorked",
      })
    );
  });

  it("should return a validation error for passing a string for 'hoursWorked'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      hoursWorked: "30",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "hoursWorked",
      })
    );
  });

  it("should return a validation error for a missing 'hoursWorked' if 'invoicedToEndCustomer' was not passed either", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      hoursWorked: undefined,
      invoicedToEndCustomer: undefined,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "hoursWorked",
      })
    );
  });

  it("should not return a validation error for a missing 'hoursWorked' if 'invoicedToEndCustomer' was passed", async () => {
    const { data } = await axiosInstance.post(endpointInvoiceGenerate, {
      hoursWorked: undefined,
      invoicedToEndCustomer: 100,
    });
    expect(data.errors).not.toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "hoursWorked",
      })
    );
  });

  it("should return a validation error for passing a negative 'invoicedToEndCustomer'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      invoicedToEndCustomer: -1,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "invoicedToEndCustomer",
      })
    );
  });

  it("should return a validation error for passing a string for 'invoicedToEndCustomer'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      invoicedToEndCustomer: "1000",
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "invoicedToEndCustomer",
      })
    );
  });

  it("should return a validation error for a missing 'invoicedToEndCustomer' if 'hoursWorked' was not passed either", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      hoursWorked: undefined,
      invoicedToEndCustomer: undefined,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "invoicedToEndCustomer",
      })
    );
  });

  it("should not return a validation error for a missing 'invoicedToEndCustomer' if 'hoursWorked' was passed", async () => {
    const { data } = await axiosInstance.post(endpointInvoiceGenerate, {
      hoursWorked: 100,
      invoicedToEndCustomer: undefined,
    });
    expect(data.errors).not.toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "invoicedToEndCustomer",
      })
    );
  });

  it("should return a validation error for passing a value for both 'hoursWorked' and 'invoicedToEndCustomer'", async () => {
    const { data, status } = await axiosInstance.post(endpointInvoiceGenerate, {
      invoicedToEndCustomer: 1000,
      hoursWorked: 30,
    });
    expect(status).toBe(400);
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "invoicedToEndCustomer",
      })
    );
    expect(data.errors).toContainEqual(
      expect.objectContaining({
        location: "body",
        param: "hoursWorked",
      })
    );
  });

  it("should not return a 400 status for passing in a valid request body", async () => {
    const { status } = await axiosInstance.post(endpointInvoiceGenerate, {
      projectNameShort: "project",
      customerNameShort: "customer",
      payeeNameShort: "payee",
      lang: "en",
      dateInvoice: "2022-01-01T00:00:00.000Z",
      hoursWorked: 100,
    });
    expect(status).not.toBe(400);
  });
});
