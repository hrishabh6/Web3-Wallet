import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { PlusCircle, Wallet } from "lucide-react"
import type { WalletAccount } from "@/app/page"
import { CreateWalletDialog } from "./CreateWalletDialogue"
import { ImportWalletDialog } from "./ImportWalletDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

interface WalletSidebarProps {
  accounts: WalletAccount[]
  selectedAccount: string | null
  onSelectAccount: (id: string) => void
  onCreateAccount: () => void
  onImportAccount: () => void
  setShowCreate: (show: boolean) => void
  setShowImport: (show: boolean) => void
  showCreate: boolean
  showImport: boolean
  onAddAccount: (name: string, solanaAddress: string, ethereumAddress: string) => void
}

export function WalletSidebar({ 
  accounts, 
  selectedAccount, 
  onSelectAccount, 
  setShowCreate, 
  setShowImport, 
  showCreate, 
  showImport, 
  onAddAccount 
}: WalletSidebarProps) {
  return (
    <div className="w-[280px] border-r bg-muted/10">
      <div className="flex h-full flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            My Wallets
          </h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => onSelectAccount(account.id)}
                  className={cn(
                    "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                    selectedAccount === account.id && "bg-accent",
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {account.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {account.solanaAddress.slice(0, 6)}...{account.solanaAddress.slice(-4)}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No wallets yet. Create or import a wallet to get started.
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 space-y-2 border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Wallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-4">
                <Button onClick={() => setShowCreate(true)} className="w-full">
                  Create New Wallet
                </Button>
                <Button variant="outline" onClick={() => setShowImport(true)} className="w-full">
                  Import Existing Wallet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <CreateWalletDialog open={showCreate} onOpenChange={setShowCreate} />
      <ImportWalletDialog open={showImport} onOpenChange={setShowImport} onImport={onAddAccount} />
    </div>
  )
}