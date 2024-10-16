"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const [tokensToStake, setTokensToStake] = useState<string | bigint>("");
  const [tokensToUnStake, setTokensToUnStake] = useState<string | bigint>("");
  const [tokensToRedeem, setTokensToRedeem] = useState<string | bigint>("");

  const { writeContractAsync: writeDimSumVaultAsync } = useScaffoldWriteContract("DimSumVault");

  const { data: yourTokenSymbol } = useScaffoldReadContract({
    contractName: "STRANGE",
    functionName: "symbol",
  });

  const { data: yourTokenBalance } = useScaffoldReadContract({
    contractName: "STRANGE",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { data: yourSharesSymbol } = useScaffoldReadContract({
    contractName: "DimSumVault",
    functionName: "symbol",
  });

  const { data: yourSharesBalance } = useScaffoldReadContract({
    contractName: "DimSumVault",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Dim Sum Vault</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="flex flex-col items-center bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-12 w-full max-w-lg">
          <div className="text-xl">
            Your token balance:{" "}
            <div className="inline-flex items-center justify-center">
              {parseFloat(formatEther(yourTokenBalance || 0n)).toFixed(4)}
              <span className="font-bold ml-1">{yourTokenSymbol}</span>
            </div>
          </div>

          <div className="text-xl">
            Your shares balance:{" "}
            <div className="inline-flex items-center justify-center">
              {parseFloat(formatEther(yourSharesBalance || 0n)).toFixed(4)}
              <span className="font-bold ml-1">{yourSharesSymbol}</span>
            </div>
          </div>
        </div>

        {/* Stake */}

        <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="text-xl">Stake your tokens</div>
          <div>1 share per token</div>

          <div className="w-full flex flex-col space-y-2">
            <IntegerInput
              placeholder="amount of tokens to stake"
              value={tokensToStake.toString()}
              onChange={value => setTokensToStake(value)}
              disableMultiplyBy1e18
            />
          </div>

          <button
            className="btn btn-secondary mt-2"
            onClick={async () => {
              try {
                await writeDimSumVaultAsync({
                  functionName: "stake",
                  args: [BigInt(tokensToStake) * 10n ** 18n, connectedAddress],
                });
              } catch (err) {
                console.error("Error calling stake function:", err);
              }
            }}
          >
            Stake
          </button>
        </div>

        {/* UnStake */}

        <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="text-xl">UnStake your assets</div>
          <div>1 share per token</div>

          <div className="w-full flex flex-col space-y-2">
            <IntegerInput
              placeholder="amount of assets to unstake"
              value={tokensToUnStake.toString()}
              onChange={value => setTokensToUnStake(value)}
              disableMultiplyBy1e18
            />
          </div>

          <button
            className="btn btn-secondary mt-2"
            onClick={async () => {
              try {
                await writeDimSumVaultAsync({
                  functionName: "unstake",
                  args: [BigInt(tokensToUnStake) * 10n ** 18n, connectedAddress, connectedAddress],
                });
              } catch (err) {
                console.error("Error calling unstake function:", err);
              }
            }}
          >
            UnStake
          </button>
        </div>

        {/* Vault Redeem */}

        <div className="flex flex-col items-center space-y-4 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-8 w-full max-w-lg">
          <div className="text-xl">Redeem from Vault</div>
          <div>Redeem your shares for tokens</div>

          <div className="w-full flex flex-col space-y-2">
            <IntegerInput
              placeholder="amount of shares to redeem"
              value={tokensToRedeem.toString()}
              onChange={value => setTokensToRedeem(value)}
              disableMultiplyBy1e18
            />
          </div>

          <button
            className="btn btn-secondary mt-2"
            onClick={async () => {
              try {
                await writeDimSumVaultAsync({
                  functionName: "vaultRedeem",
                  args: [BigInt(tokensToRedeem) * 10n ** 18n, connectedAddress, connectedAddress],
                });
              } catch (err) {
                console.error("Error calling redeem function:", err);
              }
            }}
          >
            Redeem Tokens
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
