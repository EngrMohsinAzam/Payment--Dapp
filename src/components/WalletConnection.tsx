"use client"

import type React from "react"
import { useWallet } from "../hooks/useWallet"
import { formatAddress } from "../utils/formatters"

const WalletConnection: React.FC = () => {
  const { walletState, isLoading, error, connectWallet, disconnectWallet } = useWallet()

  return (
    <div className="wallet-connection">
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {!walletState.isConnected ? (
        <button className="connect-button" onClick={connectWallet} disabled={isLoading}>
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <span className="wallet-icon">🔗</span>
              Connect Wallet
            </>
          )}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-details">
            <div className="wallet-address">
              <span className="address-label">Connected:</span>
              <span className="address-value">{formatAddress(walletState.address!)}</span>
            </div>
            <div className="network-info">
              <span className="network-indicator"></span>
              {walletState.chainId === 11155111 ? "Sepolia Testnet" : `Chain ID: ${walletState.chainId}`}
            </div>
          </div>
          <button className="disconnect-button" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}

export default WalletConnection
