import { mnemonicToSeed } from "bip39"
import { derivePath } from "ed25519-hd-key"
import { Keypair } from "@solana/web3.js"
import { Wallet, HDNodeWallet } from "ethers"
import nacl from "tweetnacl"

export async function createSolanaWallet(mnemonic: string, index: number) {
  const seed = await mnemonicToSeed(mnemonic)
  const path = `m/44'/501'/${index}'/0'`
  const derivedSeed = derivePath(path, seed.toString("hex")).key
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
  return Keypair.fromSecretKey(secret)
}

export async function createEthereumWallet(mnemonic: string, index: number) {
  const seed = await mnemonicToSeed(mnemonic)
  const derivationPath = `m/44'/60'/${index}'/0/0`
  const hdNode = HDNodeWallet.fromSeed(seed)
  const child = hdNode.derivePath(derivationPath)
  return new Wallet(child.privateKey)
}

