import React from 'react';
import { WagmiConfig, createConfig, configureChains, useAccount, useConnect, useDisconnect } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, provider } = configureChains(
  [
    {
      id: 11155111,
      name: "Tea Sepolia",
      network: "tea-sepolia",
      nativeCurrency: {
        name: "TEA",
        symbol: "TEA",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["https://tea-sepolia.g.alchemy.com/public"],
        },
      },
    },
  ],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "tea-protocol-app", // Replace with your WalletConnect Project ID
        metadata: {
          name: "Tea Tx Checker",
          description: "Check Tea Protocol transactions",
          url: "https://yourapp.com",
          icons: [],
        },
      },
    }),
  ],
  publicClient: publicProvider(),
});

function WalletConnectUI({ setAddress }) {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  React.useEffect(() => {
    if (isConnected && address) {
      setAddress(address);
    }
  }, [isConnected, address]);

  return (
    <div className="mb-4">
      {isConnected ? (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Connected: {address.slice(0, 6)}...{address.slice(-4)}</span>
          <button onClick={disconnect} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default function WalletProvider({ children, setAddress }) {
  return (
    <WagmiConfig config={config}>
      <WalletConnectUI setAddress={setAddress} />
      {children}
    </WagmiConfig>
  );
}