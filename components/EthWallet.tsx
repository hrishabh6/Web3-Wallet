"use client"

import { useState } from "react"
import { mnemonicToSeed } from "bip39"
import { Wallet, HDNodeWallet, JsonRpcProvider } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const EthWallet = ({ mnemonic }: { mnemonic: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wallets, setWallets] = useState<{ address: string; balance: string }[]>([])

  const addWallet = async () => {
    if (!mnemonic) return

    const seed = await mnemonicToSeed(mnemonic)
    const derivationPath = `m/44'/60'/${currentIndex}'/0/0`
    const hdNode = HDNodeWallet.fromSeed(seed)
    const child = hdNode.derivePath(derivationPath)
    const wallet = new Wallet(child.privateKey)

    const provider = new JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID")
    const balance = await provider.getBalance(wallet.address)

    setCurrentIndex(currentIndex + 1)
    setWallets([
      ...wallets,
      {
        address: wallet.address,
        balance: (Number(balance) / 1e18).toFixed(4),
      },
    ])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ethereum Wallets</CardTitle>
        <CardDescription>Manage your Ethereum wallets</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={addWallet} className="mb-4">
          Add ETH Wallet
        </Button>
        {wallets.map((wallet, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <div className="font-mono text-sm break-all">{wallet.address}</div>
            <div className="text-sm">Balance: {wallet.balance} ETH</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

