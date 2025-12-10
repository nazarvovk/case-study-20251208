import { TransactionDTO } from "@/lib/entities/transaction";
import { TransactionsService } from ".";
import stubData from "./stub.data.json";

export class StubTransactionsService implements TransactionsService {
  async getAllTransactions(): Promise<TransactionDTO[]> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network

    return stubData as TransactionDTO[];
  }
}
