export type CustomerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const validCustomer: CustomerInfo = {
  firstName: "Pooja",
  lastName: "C",
  postalCode: "560040",
};

export const ORDER_COMPLETE_MESSAGE = "Thank you for your order!";

export const TAX_RATE = 0.08;

export const missingFieldCases: {
  id: string;
  field: string;
  customer: CustomerInfo;
  expectedError: string;
}[] = [
  {
    id: "TID019",
    field: "first name",
    customer: { ...validCustomer, firstName: "" },
    expectedError: "Error: First Name is required",
  },
  {
    id: "TID020",
    field: "last name",
    customer: { ...validCustomer, lastName: "" },
    expectedError: "Error: Last Name is required",
  },
  {
    id: "TID021",
    field: "postal code",
    customer: { ...validCustomer, postalCode: "" },
    expectedError: "Error: Postal Code is required",
  },
];
