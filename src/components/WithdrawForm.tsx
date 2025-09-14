"use client"

import type React from "react"
import { useState } from "react"
import { useContract } from "../hooks/useContract"
import { useWallet } from "../hooks/useWallet"
import { formatEther } from "../utils/formatters"

const WithdrawForm: React.FC = () => {
  const { walletState } = useWallet()
  const { contractState, isOwner, withdraw, isLoading } = useContract()
  const [txHash, setTxHash] = useState<string>("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleWithdraw = async () => {
    if (!walletState.isConnected || !isOwner) return

    try {
      setStatus("idle")
      setTxHash("")

      const result = await withdraw()

      if (result.success) {
        setStatus("success")
        setTxHash(result.hash)
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Withdraw error:", error)
      setStatus("error")
    }
  }

  // Don't render if not connected or not owner
  if (!walletState.isConnected || !isOwner) {
    return null
  }

  const contractBalance = Number.parseFloat(formatEther(contractState.contractBalance))

  return (
    <div className="withdraw-form">
      <div className="form-header">
        <h3>Owner Withdrawal</h3>
        <div className="owner-badge">
          <span className="owner-icon">👑</span>
          <span>Contract Owner</span>
        </div>
      </div>

      <div className="balance-info">
        <div className="balance-item">
          <span className="label">Available Balance:</span>
          <span className="value">{formatEther(contractState.contractBalance)} ETH</span>
        </div>
      </div>

      <button
        className={`withdraw-btn ${contractBalance === 0 ? "disabled" : ""}`}
        onClick={handleWithdraw}
        disabled={isLoading || contractBalance === 0}
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            Withdrawing...
          </>
        ) : (
          `Withdraw All Funds (${formatEther(contractState.contractBalance)} ETH)`
        )}
      </button>

      {contractBalance === 0 && <p className="no-funds-message">No funds available for withdrawal</p>}

      {status === "success" && txHash && (
        <div className="success-message">
          <p>✅ Withdrawal successful!</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View on Etherscan
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="error-message">
          <p>❌ Withdrawal failed. Please try again.</p>
        </div>
      )}
    </div>
  )
}

export default WithdrawForm
