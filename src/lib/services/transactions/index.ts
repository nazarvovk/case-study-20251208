import { TransactionDTO } from "@/lib/entities/transaction";

export type TransactionsService = {
  getAllTransactions(): Promise<TransactionDTO[]>;
};
