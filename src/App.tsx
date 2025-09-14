import type React from "react"
import Header from "./components/Header"
import PaymentForm from "./components/PaymentForm"
import ContractInfo from "./components/ContractInfo"
import WithdrawForm from "./components/WithdrawForm"
import Footer from "./components/Footer"
import "./App.css"

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="hero-section">
            <h2>Decentralized Payment System</h2>
            <p>
              Interact with our smart contract deployed on Sepolia testnet. Make payments and transfer fees securely
              using your Web3 wallet.
            </p>
          </div>

          <div className="content-grid">
            <div className="payment-section">
              <PaymentForm />
              <WithdrawForm />
            </div>
            <div className="info-section">
              <ContractInfo />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
