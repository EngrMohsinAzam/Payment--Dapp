"use client"

import type React from "react"
import { useState } from "react"
import { useContract } from "../hooks/useContract"
import { useWallet } from "../hooks/useWallet"
import { formatEther } from "../utils/formatters"

const PaymentForm: React.FC = () => {
  const { walletState } = useWallet()
  const { contractState, isLoading, error, makePayment, transferFee } = useContract()
  const [paymentAmount, setPaymentAmount] = useState("")
  const [feeAmount, setFeeAmount] = useState("")
  const [lastTransaction, setLastTransaction] = useState<string | null>(null)
  const [transactionType, setTransactionType] = useState<"payment" | "fee" | null>(null)

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) {
      alert("Please enter a valid payment amount")
      return
    }

    try {
      const result = await makePayment(paymentAmount)
      if (result.success) {
        setLastTransaction(result.hash)
        setTransactionType("payment")
        setPaymentAmount("")
      }
    } catch (err) {
      console.error("Payment failed:", err)
    }
  }

  const handleTransferFee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feeAmount || Number.parseFloat(feeAmount) <= 0) {
      alert("Please enter a valid fee amount")
      return
    }

    try {
      const result = await transferFee(feeAmount)
      if (result.success) {
        setLastTransaction(result.hash)
        setTransactionType("fee")
        setFeeAmount("")
      }
    } catch (err) {
      console.error("Fee transfer failed:", err)
    }
  }

  if (!walletState.isConnected) {
    return (
      <div className="payment-form-container">
        <div className="connect-prompt">
          <h3>Connect Your Wallet</h3>
          <p>Please connect your wallet to interact with the smart contract.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-form-container">
      <div className="contract-stats">
        <h3>Contract Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Payments</span>
            <span className="stat-value">{formatEther(contractState.totalPayments)} ETH</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Fees</span>
            <span className="stat-value">{formatEther(contractState.totalFees)} ETH</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Contract Balance</span>
            <span className="stat-value">{formatEther(contractState.contractBalance)} ETH</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {lastTransaction && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <div>
            <p>{transactionType === "payment" ? "Payment" : "Fee transfer"} successful!</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${lastTransaction}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      )}

      <div className="forms-container">
        <form onSubmit={handleMakePayment} className="payment-form">
          <h4>Make Payment</h4>
          <div className="form-group">
            <label htmlFor="paymentAmount">Amount (ETH)</label>
            <input
              type="number"
              id="paymentAmount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0.01"
              step="0.001"
              min="0"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="submit-button payment-button" disabled={isLoading || !paymentAmount}>
            {isLoading ? <span className="loading-spinner"></span> : "Send Payment"}
          </button>
        </form>

        <form onSubmit={handleTransferFee} className="fee-form">
          <h4>Transfer Fee</h4>
          <div className="form-group">
            <label htmlFor="feeAmount">Fee Amount (ETH)</label>
            <input
              type="number"
              id="feeAmount"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              placeholder="0.001"
              step="0.001"
              min="0"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="submit-button fee-button" disabled={isLoading || !feeAmount}>
            {isLoading ? <span className="loading-spinner"></span> : "Transfer Fee"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm
