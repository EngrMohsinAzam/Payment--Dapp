export interface WalletState {
  address: string | null
  isConnected: boolean
  chainId: number | null
}

export interface ContractState {
  totalPayments: string
  totalFees: string
  contractBalance: string
}

export interface TransactionResult {
  hash: string
  success: boolean
  error?: string
}
