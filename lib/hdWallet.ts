
import { generateMnemonic } from "bip39";
import { createSolanaWallet, createEthereumWallet } from "@/lib/wallet";

// Store the master seed phrase for the HD wallet
let masterSeedPhrase: string | null = null;

// Initialize the HD wallet
export const initializeHDWallet = async (email: string, password: string): Promise<string> => {
  // In a real implementation, you would derive the seed from email+password using a KDF
  // For this demo, we'll simply generate a new seed phrase
  const seedPhrase = await generateMnemonic();
  masterSeedPhrase = seedPhrase;
  
  // Store the seed phrase encrypted with the password (simplified)
  // In a real app, use proper encryption
  localStorage.setItem('masterSeedPhrase', seedPhrase);
  localStorage.setItem('walletEmail', email);
  
  return seedPhrase;
};

// Get the master seed phrase
export const getMasterSeedPhrase = (): string | null => {
  if (masterSeedPhrase) return masterSeedPhrase;
  
  // Try to load from localStorage
  const storedSeedPhrase = localStorage.getItem('masterSeedPhrase');
  if (storedSeedPhrase) {
    masterSeedPhrase = storedSeedPhrase;
    return storedSeedPhrase;
  }
  
  return null;
};

// Create a new account from the HD wallet with the given derivation index
export const createAccountFromHDWallet = async (
  name: string, 
  index: number
): Promise<{ name: string; solanaAddress: string; ethereumAddress: string; } | null> => {
  const seedPhrase = getMasterSeedPhrase();
  if (!seedPhrase) return null;
  
  try {
    // Create the wallets from the mnemonic with the specified index
    const solanaWallet = await createSolanaWallet(seedPhrase, index);
    const ethereumWallet = await createEthereumWallet(seedPhrase, index);
    
    return {
      name,
      solanaAddress: solanaWallet.publicKey.toBase58(),
      ethereumAddress: ethereumWallet.address
    };
  } catch (error) {
    console.error("Error creating account from HD wallet:", error);
    return null;
  }
};

// Check if HD wallet is initialized
export const isHDWalletInitialized = (): boolean => {
  return getMasterSeedPhrase() !== null;
};