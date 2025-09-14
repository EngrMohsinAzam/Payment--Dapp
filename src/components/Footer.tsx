import type React from "react"

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>SimplePayment DApp</h4>
          <p>A secure blockchain payment system built on Ethereum.</p>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li>
              <a href="https://sepolia.etherscan.io/" target="_blank" rel="noopener noreferrer">
                Sepolia Explorer
              </a>
            </li>
            <li>
              <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer">
                Get Test ETH
              </a>
            </li>
            <li>
              <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                MetaMask
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Security</h4>
          <p>Always verify contract addresses and use testnet for testing.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 SimplePayment DApp. Built with React & Ethers.js</p>
      </div>
    </footer>
  )
}

export default Footer
