import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface WalletContextType {
  address: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum === 'undefined') {
        return;
      }

      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });

        if (accounts && accounts.length > 0) {
          const chainId = await window.ethereum.request({ 
            method: 'eth_chainId' 
          });

          const bnbChainId = '0x38';
          if (chainId === bnbChainId) {
            setAddress(accounts[0]);
            localStorage.setItem('walletAddress', accounts[0]);
          } else {
            localStorage.removeItem('walletAddress');
          }
        } else {
          localStorage.removeItem('walletAddress');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        localStorage.removeItem('walletAddress');
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: t('toast.walletNotFoundTitle'),
        description: t('toast.walletNotFoundDesc'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      const bnbChainId = '0x38';
      if (chainId !== bnbChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: bnbChainId }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: bnbChainId,
                chainName: 'BNB Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
                },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/']
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      const walletAddress = accounts[0];
      setAddress(walletAddress);
      localStorage.setItem('walletAddress', walletAddress);

      toast({
        title: t('toast.walletConnectedTitle'),
        description: `${t('toast.walletConnectedDesc')} ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: t('toast.connectionFailedTitle'),
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    localStorage.removeItem('walletAddress');
    toast({
      title: t('toast.walletDisconnectedTitle'),
      description: t('toast.walletDisconnectedDesc'),
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          const chainId = await window.ethereum.request({ 
            method: 'eth_chainId' 
          });
          const bnbChainId = '0x38';
          
          if (chainId === bnbChainId) {
            setAddress(accounts[0]);
            localStorage.setItem('walletAddress', accounts[0]);
          } else {
            disconnectWallet();
          }
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      window.ethereum.on('chainChanged', async (chainId: string) => {
        const bnbChainId = '0x38';
        if (chainId !== bnbChainId) {
          disconnectWallet();
        } else {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            localStorage.setItem('walletAddress', accounts[0]);
          }
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnecting, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
