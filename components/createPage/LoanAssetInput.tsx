import { ethers } from 'ethers';
import React, { ChangeEvent, useCallback, useState, useEffect } from 'react';
import { LoanAsset, getLoanAssets } from 'lib/loanAssets';
import { jsonRpcERC20Contract } from 'lib/contracts';

export default function LoanAssetInput({ setDecimals, setLoanAssetAddress }) {
  const [loanAssetOptions, setLoanAssetOptions] = useState<LoanAsset[]>([])

  const setLoanAsset = useCallback(async (address: string) => {
    const contract = jsonRpcERC20Contract(address);
    const decimals = await contract.decimals().catch((e) => console.log(e));
    setDecimals(decimals);
    setLoanAssetAddress(address);
  }, [setDecimals, setLoanAssetAddress])

  const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const address = ethers.utils.getAddress(event.target.value);
    setLoanAsset(address)
  }, [setLoanAsset])

  const loadAssets = useCallback(async () => {
    const assets  = await getLoanAssets()
    setLoanAssetOptions(assets)
    setLoanAsset(assets[0].address)
  }, [setLoanAsset])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  return (
    <div className="input-wrapper">
      <h4 className="blue">
          loan asset
      </h4>

      <select onChange={handleChange}>
        {
          loanAssetOptions.map((a, i) => {
          return  <option key={i} value={a.address}>{a.symbol}</option>
          })
        }
      </select>
    </div>
  );
}
