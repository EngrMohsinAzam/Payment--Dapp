"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import type { WalletState } from "../types"

declare global {
  interface Window {
    ethereum?: any
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
  })
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()

        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          const network = await provider.getNetwork()

          setWalletState({
            address,
            isConnected: true,
            chainId: Number(network.chainId),
          })
          setProvider(provider)
          setSigner(signer)
        }
      } catch (err) {
        console.error("Error checking connection:", err)
      }
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      // Check if we're on Sepolia testnet
      if (Number(network.chainId) !== 11155111) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // Sepolia chainId in hex
          })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Chain not added to MetaMask
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Test Network",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia.infura.io/v3/"],
                  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
                },
              ],
            })
          }
        }

        // Re-get network info after switch
        const updatedNetwork = await provider.getNetwork()
        setWalletState({
          address,
          isConnected: true,
          chainId: Number(updatedNetwork.chainId),
        })
      } else {
        setWalletState({
          address,
          isConnected: true,
          chainId: Number(network.chainId),
        })
      }

      setProvider(provider)
      setSigner(signer)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
      console.error("Connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      isConnected: false,
      chainId: null,
    })
    setProvider(null)
    setSigner(null)
    setError(null)
  }

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          checkConnection()
        }
      }

      const handleChainChanged = () => {
        checkConnection()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [checkConnection])

  return {
    walletState,
    provider,
    signer,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  }
}
