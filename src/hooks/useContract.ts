"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { CONTRACT_CONFIG } from "../config/contract"
import type { ContractState, TransactionResult } from "../types"
import { useWallet } from "./useWallet"

export const useContract = () => {
  const { signer, provider, walletState } = useWallet()
  const [contractState, setContractState] = useState<ContractState>({
    totalPayments: "0",
    totalFees: "0",
    contractBalance: "0",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  const getContract = useCallback(() => {
    if (!signer) return null
    return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, signer)
  }, [signer])

  const getReadOnlyContract = useCallback(() => {
    if (!provider) return null
    return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, provider)
  }, [provider])

  const checkOwnership = useCallback(async () => {
    const contract = getReadOnlyContract()
    if (!contract || !walletState.address) return

    try {
      const owner = await contract.owner()
      setIsOwner(owner.toLowerCase() === walletState.address.toLowerCase())
    } catch (err) {
      console.error("Error checking ownership:", err)
      setIsOwner(false)
    }
  }, [getReadOnlyContract, walletState.address])

  const fetchContractData = useCallback(async () => {
    const contract = getReadOnlyContract()
    if (!contract) return

    try {
      const [totalPayments, totalFees, contractBalance] = await Promise.all([
        contract.totalPayments(),
        contract.totalFees(),
        contract.getContractBalance(),
      ])

      setContractState({
        totalPayments: totalPayments.toString(),
        totalFees: totalFees.toString(),
        contractBalance: contractBalance.toString(),
      })
    } catch (err) {
      console.error("Error fetching contract data:", err)
      setError("Failed to fetch contract data")
    }
  }, [getReadOnlyContract])

  const makePayment = async (amount: string): Promise<TransactionResult> => {
    const contract = getContract()
    if (!contract) {
      throw new Error("Contract not available")
    }

    setIsLoading(true)
    setError(null)

    try {
      const value = ethers.parseEther(amount)
      const tx = await contract.makePayment({ value })

      // Wait for transaction confirmation
      const receipt = await tx.wait()

      // Refresh contract data
      await fetchContractData()

      return {
        hash: receipt.hash,
        success: true,
      }
    } catch (err: any) {
      const errorMessage = err.reason || err.message || "Transaction failed"
      setError(errorMessage)
      return {
        hash: "",
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const transferFee = async (amount: string): Promise<TransactionResult> => {
    const contract = getContract()
    if (!contract) {
      throw new Error("Contract not available")
    }

    setIsLoading(true)
    setError(null)

    try {
      const value = ethers.parseEther(amount)
      const tx = await contract.transferFee({ value })

      // Wait for transaction confirmation
      const receipt = await tx.wait()

      // Refresh contract data
      await fetchContractData()

      return {
        hash: receipt.hash,
        success: true,
      }
    } catch (err: any) {
      const errorMessage = err.reason || err.message || "Fee transfer failed"
      setError(errorMessage)
      return {
        hash: "",
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const withdraw = async (): Promise<TransactionResult> => {
    const contract = getContract()
    if (!contract) {
      throw new Error("Contract not available")
    }

    if (!isOwner) {
      throw new Error("Only contract owner can withdraw")
    }

    setIsLoading(true)
    setError(null)

    try {
      const tx = await contract.withdraw()

      // Wait for transaction confirmation
      const receipt = await tx.wait()

      // Refresh contract data
      await fetchContractData()

      return {
        hash: receipt.hash,
        success: true,
      }
    } catch (err: any) {
      const errorMessage = err.reason || err.message || "Withdrawal failed"
      setError(errorMessage)
      return {
        hash: "",
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (walletState.isConnected && provider) {
      fetchContractData()
      checkOwnership()
    }
  }, [walletState.isConnected, provider, fetchContractData, checkOwnership])

  return {
    contractState,
    isLoading,
    error,
    isOwner,
    makePayment,
    transferFee,
    withdraw,
    fetchContractData,
  }
}
