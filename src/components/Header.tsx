import type React from "react"
import WalletConnection from "./WalletConnection"

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">SimplePayment DApp</h1>
          <p className="app-subtitle">Blockchain Payment System</p>
        </div>
        <WalletConnection />
      </div>
    </header>
  )
}

export default Header
