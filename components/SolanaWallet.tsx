"use client"

import { useState } from "react"
import { mnemonicToSeed } from "bip39"
import { derivePath } from "ed25519-hd-key"
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import nacl from "tweetnacl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SolanaWallet({ mnemonic }: { mnemonic: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wallets, setWallets] = useState<{ publicKey: string; balance: number }[]>([])

  const addWallet = async () => {
    if (!mnemonic) return

    const seed = await mnemonicToSeed(mnemonic)
    const path = `m/44'/501'/${currentIndex}'/0'`
    const derivedSeed = derivePath(path, seed.toString("hex")).key
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
    const keypair = Keypair.fromSecretKey(secret)

    const connection = new Connection("https://api.devnet.solana.com")
    const balance = await connection.getBalance(keypair.publicKey)

    setCurrentIndex(currentIndex + 1)
    setWallets([
      ...wallets,
      {
        publicKey: keypair.publicKey.toBase58(),
        balance: balance / LAMPORTS_PER_SOL,
      },
    ])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana Wallets</CardTitle>
        <CardDescription>Manage your Solana wallets</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={addWallet} className="mb-4">
          Add Solana Wallet
        </Button>
        {wallets.map((wallet, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <div className="font-mono text-sm break-all">{wallet.publicKey}</div>
            <div className="text-sm">Balance: {wallet.balance} SOL</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

