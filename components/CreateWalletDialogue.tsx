"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { initializeHDWallet, isHDWalletInitialized, createAccountFromHDWallet } from "@/lib/hdWallet"

interface CreateWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAccount: (name: string, solanaAddress: string, ethereumAddress: string) => void
}

export function CreateWalletDialog({ open, onOpenChange, onAddAccount }: CreateWalletDialogProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    // Check if the HD wallet is already initialized
    setIsInitialized(isHDWalletInitialized());
  }, [open]);

  const handleCreate = async () => {
    if (!name) return
    setIsGenerating(true);
    
    try {
      if (!isInitialized) {
        // First wallet - initialize the HD wallet and redirect to seed phrase page
        const newMnemonic = await initializeHDWallet("user@example.com", "password"); // In a real app, get email and password from auth
        
        const params = new URLSearchParams({
          phrase: newMnemonic,
          name: name,
          source: "create",
          isHDWallet: "true"
        });
        router.push(`/setup/seed-phrase?${params.toString()}`);
      } else {
        // Creating additional accounts from the HD wallet
        // Get the next available index (count of existing accounts)
        const accounts = JSON.parse(localStorage.getItem('walletAccounts') || '[]');
        const index = accounts.length;
        
        const newAccount = await createAccountFromHDWallet(name, index);
        if (newAccount) {
          onAddAccount(newAccount.name, newAccount.solanaAddress, newAccount.ethereumAddress);
          onOpenChange(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isInitialized ? "Add New Account" : "Create New Wallet"}
          </DialogTitle>
          <DialogDescription>
            {isInitialized 
              ? "Enter a name for your new account. It will be derived from your master seed phrase."
              : "Enter a name for your new wallet. We'll generate a secure seed phrase for you."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">
              {isInitialized ? "Account Name" : "Wallet Name"}
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} 
              placeholder={isInitialized ? "Enter account name" : "Enter wallet name"} />
          </div>
          <Button onClick={handleCreate} className="w-full" disabled={!name || isGenerating}>
            {isGenerating ? "Processing..." : (isInitialized ? "Add Account" : "Create Wallet")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}