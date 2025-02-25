"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertTriangle, Check, Copy, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createSolanaWallet, createEthereumWallet } from "@/lib/wallet"

export default function SeedPhrasePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const seedPhrase = searchParams.get("phrase")
  const walletName = searchParams.get("name")
  const isHDWallet = searchParams.get("isHDWallet") === "true"

  const copyPhrase = () => {
    if (seedPhrase) {
      navigator.clipboard.writeText(seedPhrase)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const continueToWallet = async () => {
    if (!seedPhrase || !walletName) return
    
    setIsCreating(true)
    try {
      // Create the wallets from the mnemonic (using index 0 for the first account)
      const solanaWallet = await createSolanaWallet(seedPhrase, 0)
      const ethereumWallet = await createEthereumWallet(seedPhrase, 0)
      
      const walletData = {
        name: walletName,
        solanaAddress: solanaWallet.publicKey.toBase58(),
        ethereumAddress: ethereumWallet.address
      }
      
      // Store the wallet data in sessionStorage for the home page to retrieve
      sessionStorage.setItem('newWalletData', JSON.stringify(walletData))
      
      // Store that this is an HD wallet
      if (isHDWallet) {
        localStorage.setItem('isHDWallet', 'true')
      }
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error("Error creating wallet:", error)
    } finally {
      setIsCreating(false)
    }
  }

  if (!seedPhrase || !walletName) {
    router.push('/')
    return null
  }

  return (
    <div className="container max-w-2xl min-h-screen py-8 mx-auto space-y-6">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <ShieldAlert className="mr-2 h-5 w-5" />
            {isHDWallet ? "Master Seed Phrase" : "Wallet Seed Phrase"}
          </CardTitle>
          <CardDescription className="text-base">
            This is the only way to recover your {isHDWallet ? "master wallet and all accounts" : "wallet"}. Save these words in a secure location.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Never share your seed phrase with anyone. Anyone with these words can access {isHDWallet ? "all your accounts" : "your wallet"}.
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-3 gap-2">
              {seedPhrase.split(" ").map((word, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-background rounded">
                  <span className="text-muted-foreground">{index + 1}.</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1" onClick={copyPhrase}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Phrase
                </>
              )}
            </Button>
            <Button className="flex-1" onClick={continueToWallet} disabled={isCreating}>
              {isCreating ? "Creating Wallet..." : "I've Saved It"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}