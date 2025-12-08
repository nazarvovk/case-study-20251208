import { TransactionDTO } from "@/lib/entities/transaction";
import { TransactionsService } from "@/lib/services/transactions";
import { StubTransactionsService } from "@/lib/services/transactions/stub";

export async function getAllTransactions(
  transactionsService: TransactionsService = new StubTransactionsService(),
): Promise<TransactionDTO[]> {
  return transactionsService.getAllTransactions();
}
