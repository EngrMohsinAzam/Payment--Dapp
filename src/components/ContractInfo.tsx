import type React from "react"
import { CONTRACT_CONFIG } from "../config/contract"
import { formatAddress } from "../utils/formatters"

const ContractInfo: React.FC = () => {
  return (
    <div className="contract-info">
      <h3>Contract Information</h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Contract Address:</span>
          <a
            href={`https://sepolia.etherscan.io/address/${CONTRACT_CONFIG.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contract-link"
          >
            {formatAddress(CONTRACT_CONFIG.address)}
          </a>
        </div>
        <div className="info-item">
          <span className="info-label">Network:</span>
          <span className="network-badge">Sepolia Testnet</span>
        </div>
        <div className="info-item">
          <span className="info-label">Chain ID:</span>
          <span className="chain-id">{CONTRACT_CONFIG.network.chainId}</span>
        </div>
      </div>
    </div>
  )
}

export default ContractInfo
