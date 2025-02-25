// In /app/page.tsx
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WalletSidebar } from "@/components/WalletSidebar"
import { WalletDashboard } from "@/components/WalletDashboard"
import { Button } from "@/components/ui/button"
import { CreateWalletDialog } from "@/components/CreateWalletDialogue" 
import { ImportWalletDialog } from "@/components/ImportWalletDialog"
import { isLoggedIn } from "@/lib/auth"
import { isHDWalletInitialized } from "@/lib/hdWallet"

export type WalletAccount = {
  id: string
  name: string
  solanaAddress: string
  ethereumAddress: string
  solanaBalance: number
  ethereumBalance: number
  index: number // Add derivation index to track HD wallet accounts
}

export default function Home() {
  const router = useRouter();
  
  // Check authentication
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/auth');
    }
  }, [router]);
  
  // Load accounts from localStorage on initial render
  const [accounts, setAccounts] = useState<WalletAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const savedAccounts = localStorage.getItem('walletAccounts')
      return savedAccounts ? JSON.parse(savedAccounts) : []
    }
    return []
  })
  
  // Load selected account from localStorage
  const [selectedAccount, setSelectedAccount] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedAccount')
    }
    return null
  })
  
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [hasHDWallet, setHasHDWallet] = useState(false)
  
  // Check if HD wallet exists
  useEffect(() => {
    setHasHDWallet(isHDWalletInitialized());
  }, []);
  
  // Save accounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('walletAccounts', JSON.stringify(accounts))
  }, [accounts])
  
  // Save selected account to localStorage whenever it changes
  useEffect(() => {
    if (selectedAccount) {
      localStorage.setItem('selectedAccount', selectedAccount)
    }
  }, [selectedAccount])
  
  // Check for newly created wallet on component mount
  useEffect(() => {
    // Check sessionStorage for new wallet data
    const newWalletData = sessionStorage.getItem('newWalletData')
    if (newWalletData) {
      try {
        const walletData = JSON.parse(newWalletData)
        addAccount(walletData.name, walletData.solanaAddress, walletData.ethereumAddress)
        // Clear the data after adding
        sessionStorage.removeItem('newWalletData')
      } catch (error) {
        console.error("Error parsing new wallet data:", error)
      }
    }
  }, [])
  
  const addAccount = (name: string, solanaAddress: string, ethereumAddress: string) => {
    const newAccount: WalletAccount = {
      id: `account-${Date.now()}`, // Using timestamp for unique ID
      name,
      solanaAddress,
      ethereumAddress,
      solanaBalance: 0,
      ethereumBalance: 0,
      index: accounts.length // Use current length as index for HD wallet
    }
    
    setAccounts(prevAccounts => {
      // Check if account already exists to prevent duplicates
      const exists = prevAccounts.some(
        acc => acc.solanaAddress === solanaAddress || acc.ethereumAddress === ethereumAddress
      )
      if (exists) return prevAccounts
      
      return [...prevAccounts, newAccount]
    })
    
    setSelectedAccount(newAccount.id)
  }
  
  const handleSelectAccount = (id: string) => {
    setSelectedAccount(id)
  }
  
  const currentAccount = accounts.find((a) => a.id === selectedAccount)
  
  // If not logged in, don't render anything (will redirect to auth page)
  if (typeof window !== 'undefined' && !isLoggedIn()) {
    return null;
  }
  
  return (
    <div className="flex h-screen">
      <WalletSidebar
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={handleSelectAccount}
        onCreateAccount={() => setShowCreate(true)}
        onImportAccount={() => setShowImport(true)}
        onAddAccount={addAccount}
        setShowCreate={setShowCreate}
        setShowImport={setShowImport}
        showCreate={showCreate}
        showImport={showImport}
      />
      
      <div className="flex-1 p-6">
        {currentAccount ? (
          <WalletDashboard account={currentAccount} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <h1 className="text-3xl font-bold">
              Welcome to Web3 Wallet
            </h1>
            
            <div className="flex space-x-4">
              <Button onClick={() => setShowCreate(true)}>
                {hasHDWallet ? "Add New Account" : "Create New Wallet"}
              </Button>
              {!hasHDWallet && (
                <Button variant="outline" onClick={() => setShowImport(true)}>
                  Import Existing Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <CreateWalletDialog 
        open={showCreate} 
        onOpenChange={setShowCreate} 
        onAddAccount={addAccount} 
      />
      
      <ImportWalletDialog 
        open={showImport} 
        onOpenChange={setShowImport} 
      />
    </div>
  )
}