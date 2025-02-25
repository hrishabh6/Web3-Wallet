"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2, ExternalLink } from "lucide-react"
import type { WalletAccount } from "@/app/page"

interface WalletDashboardProps {
  account: WalletAccount
}

export function WalletDashboard({ account }: WalletDashboardProps) {
  const [copiedSolana, setCopiedSolana] = useState(false)
  const [copiedEthereum, setCopiedEthereum] = useState(false)

  const copyToClipboard = (text: string, type: 'solana' | 'ethereum') => {
    navigator.clipboard.writeText(text)
    if (type === 'solana') {
      setCopiedSolana(true)
      setTimeout(() => setCopiedSolana(false), 2000)
    } else {
      setCopiedEthereum(true)
      setTimeout(() => setCopiedEthereum(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{account.name}&apos;s Wallet</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="solana">Solana</TabsTrigger>
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Solana Balance</CardTitle>
                <CardDescription>Your SOL balance and address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{account.solanaBalance} SOL</div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <span className="truncate">{account.solanaAddress}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-1 h-6 w-6" 
                    onClick={() => copyToClipboard(account.solanaAddress, 'solana')}
                  >
                    {copiedSolana ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4" 
                  onClick={() => window.open(`https://explorer.solana.com/address/${account.solanaAddress}`, '_blank')}
                >
                  View on Explorer
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Ethereum Balance</CardTitle>
                <CardDescription>Your ETH balance and address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{account.ethereumBalance} ETH</div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <span className="truncate">{account.ethereumAddress}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-1 h-6 w-6" 
                    onClick={() => copyToClipboard(account.ethereumAddress, 'ethereum')}
                  >
                    {copiedEthereum ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4" 
                  onClick={() => window.open(`https://etherscan.io/address/${account.ethereumAddress}`, '_blank')}
                >
                  View on Explorer
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="solana" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solana Account</CardTitle>
              <CardDescription>Your Solana wallet details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Account Address</div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-sm">
                    {account.solanaAddress}
                  </code>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copyToClipboard(account.solanaAddress, 'solana')}
                  >
                    {copiedSolana ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Balance</div>
                <div className="text-2xl font-bold">{account.solanaBalance} SOL</div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => window.open(`https://explorer.solana.com/address/${account.solanaAddress}`, '_blank')}
              >
                View on Solana Explorer
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ethereum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ethereum Account</CardTitle>
              <CardDescription>Your Ethereum wallet details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Account Address</div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-sm">
                    {account.ethereumAddress}
                  </code>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copyToClipboard(account.ethereumAddress, 'ethereum')}
                  >
                    {copiedEthereum ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Balance</div>
                <div className="text-2xl font-bold">{account.ethereumBalance} ETH</div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => window.open(`https://etherscan.io/address/${account.ethereumAddress}`, '_blank')}
              >
                View on Etherscan
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}