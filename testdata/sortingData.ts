export type sortCases = {
  id: string;
  option: string;
  sortBy: string;
  order: string;
  startFrom?: string;
};

export const sortCases: sortCases[] = [
  {
    id: "TID024",
    option: "Name (A to Z)",
    sortBy: "name",
    order: "ascending",
    startFrom: "Name (Z to A)",
  },
  {
    id: "TID025",
    option: "Name (Z to A)",
    sortBy: "name",
    order: "descending",
  },
  {
    id: "TID026",
    option: "Price (low to high)",
    sortBy: "price",
    order: "ascending",
  },
  {
    id: "TID027",
    option: "Price (high to low)",
    sortBy: "price",
    order: "descending",
  },
];
