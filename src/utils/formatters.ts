import { ethers } from "ethers"

export const formatEther = (value: string | number): string => {
  try {
    return Number.parseFloat(ethers.formatEther(value.toString())).toFixed(4)
  } catch {
    return "0.0000"
  }
}

export const formatAddress = (address: string): string => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const parseEther = (value: string): bigint => {
  try {
    return ethers.parseEther(value)
  } catch {
    return BigInt(0)
  }
}
