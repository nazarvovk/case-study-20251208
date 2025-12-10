import "@testing-library/jest-dom";
import { AggregationTable, calculateAggregation } from "./aggregation-table";
import { AggregationFunction } from "./aggregation";
import { render, screen } from "@testing-library/react";

type DataEntry = {
  type: string;
  status: string;
  amount: number;
};

describe(calculateAggregation.name, () => {
  const data: DataEntry[] = [
    { type: "invoice", status: "paid", amount: 1000 },
    { type: "invoice", status: "paid", amount: 500 },
    { type: "invoice", status: "pending", amount: 750 },
    { type: "payment", status: "paid", amount: 250 },
    { type: "invoice", status: "pending", amount: 2000 },
    { type: "payment", status: "pending", amount: 1500 },
  ];

  const sum: AggregationFunction<DataEntry> = (values) =>
    values.reduce((acc, t) => acc + t.amount, 0);

  it("computes grand total without grouping", () => {
    expect(calculateAggregation(data, sum)).toBe(6000);
  });

  it("computes row total grouped by type", () => {
    expect(calculateAggregation(data, sum, "type", "invoice")).toBe(4250);
    expect(calculateAggregation(data, sum, "type", "payment")).toBe(1750);
  });

  it("computes column total grouped by status", () => {
    expect(
      calculateAggregation(data, sum, undefined, undefined, "status", "paid"),
    ).toBe(1750);
    expect(
      calculateAggregation(
        data,
        sum,
        undefined,
        undefined,
        "status",
        "pending",
      ),
    ).toBe(4250);
  });

  it("computes cell value grouped by type and status", () => {
    expect(
      calculateAggregation(data, sum, "type", "invoice", "status", "paid"),
    ).toBe(1500);
    expect(
      calculateAggregation(data, sum, "type", "invoice", "status", "pending"),
    ).toBe(2750);
    expect(
      calculateAggregation(data, sum, "type", "payment", "status", "paid"),
    ).toBe(250);
  });

  it("returns 0 for non-matching filters", () => {
    expect(
      calculateAggregation(data, sum, "type", "invoice", "status", "cancelled"),
    ).toBe(0);
  });
});

describe(AggregationTable.name, () => {
  const data: DataEntry[] = [
    { type: "invoice", status: "paid", amount: 1000 },
    { type: "invoice", status: "pending", amount: 750 },
    { type: "payment", status: "paid", amount: 250 },
  ];

  const sum: AggregationFunction<DataEntry> = (values) =>
    values.reduce((acc, t) => acc + t.amount, 0);

  it("renders table with correct headers and data cells", () => {
    render(
      <AggregationTable
        data={data}
        rowsKey="type"
        columnsKey="status"
        aggregationFunction={sum}
      />,
    );

    expect(screen.getByText("paid")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("invoice")).toBeInTheDocument();
    expect(screen.getByText("payment")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getAllByText("250")).toHaveLength(2); // data cell and total cell
  });

  it("displays row and column totals", () => {
    render(
      <AggregationTable
        data={data}
        rowsKey="type"
        columnsKey="status"
        aggregationFunction={sum}
      />,
    );

    // Row total: Invoice = 1750
    expect(screen.getByText("1750")).toBeInTheDocument();
    // Column total: Paid = 1250
    expect(screen.getByText("1250")).toBeInTheDocument();
  });
});
