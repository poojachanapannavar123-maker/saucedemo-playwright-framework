export type sortCase = {
  id: string;
  option: string;
  sortBy: "name" | "price";
  order: "ascending" | "descending";
  startFrom?: string;
};

export const sortCases: sortCase[] = [
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
