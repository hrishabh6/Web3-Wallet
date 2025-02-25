"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSolanaWallet, createEthereumWallet } from "@/lib/wallet"

interface ImportWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (name: string, solanaAddress: string, ethereumAddress: string) => void
}

export function ImportWalletDialog({ open, onOpenChange, onImport }: ImportWalletDialogProps) {
  const [name, setName] = useState("")
  const [words, setWords] = useState(Array(12).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words]
    newWords[index] = value.toLowerCase().trim()
    setWords(newWords)

    // Auto-focus next input if word is entered
    if (value && index < 11) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !words[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleImport = async () => {
    if (!name || words.some((word) => !word)) return

    const mnemonic = words.join(" ")
    const solanaWallet = await createSolanaWallet(mnemonic, 0)
    const ethereumWallet = await createEthereumWallet(mnemonic, 0)

    onImport(name, solanaWallet.publicKey.toBase58(), ethereumWallet.address)

    setName("")
    setWords(Array(12).fill(""))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Existing Wallet</DialogTitle>
          <DialogDescription>Enter your 12-word seed phrase to import your existing wallet.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Wallet Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter wallet name" />
          </div>
          <div>
            <Label>Seed Phrase</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {words.map((word, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                  <Input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={word}
                    onChange={(e) => handleWordChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="flex-1"
                    placeholder={`Word ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleImport} className="w-full" disabled={!name || words.some((word) => !word)}>
            Import Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

