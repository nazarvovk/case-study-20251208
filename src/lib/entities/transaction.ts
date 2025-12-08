export type TransactionType = "invoice" | "bill" | "direct_expense";

export type TransactionDTO = {
  transaction_type: TransactionType;
  transaction_number: string;
  amount: string;
  status: "paid" | "unpaid" | "partially_paid";
  year: string;
};
