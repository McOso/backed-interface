import { useCallback, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { TransactionButton } from 'components/Button';
import { web3Erc20Contract } from 'lib/contracts';
import { useWeb3 } from 'hooks/useWeb3';
import { CompletedButton } from 'components/Button';

interface AllowButtonProps {
  contractAddress: string;
  symbol: string;
  callback: () => void;
  done?: boolean;
}

export function AllowButton({
  contractAddress,
  symbol,
  callback,
  done,
}: AllowButtonProps) {
  const { account } = useWeb3();
  const [txHash, setTxHash] = useState('');
  const [waitingForTx, setWaitingForTx] = useState(false);

  const allow = useCallback(async () => {
    const contract = web3Erc20Contract(contractAddress);
    const t = await contract.approve(
      process.env.NEXT_PUBLIC_NFT_LOAN_FACILITATOR_CONTRACT || '',
      ethers.BigNumber.from(2).pow(256).sub(1),
    );
    setWaitingForTx(true);
    setTxHash(t.hash);
    t.wait()
      .then(() => {
        callback();
        setWaitingForTx(false);
      })
      .catch((err) => {
        setWaitingForTx(false);
        console.log(err);
      });
  }, [callback, contractAddress]);

  const buttonText = useMemo(() => `Authorize ${symbol}`, [symbol]);

  if (done) {
    return (
      <CompletedButton
        buttonText={buttonText}
        message={<span>Permission granted</span>}
        success
      />
    );
  }

  return (
    <TransactionButton
      text={buttonText}
      onClick={allow}
      txHash={txHash}
      isPending={waitingForTx}
    />
  );
}
