import { DescriptionList } from 'components/DescriptionList';
import { Fieldset } from 'components/Fieldset';
import { NFTExchangeAddressLink } from 'components/NFTExchangeLink';
import { Loan } from 'types/Loan';
import React, { useMemo } from 'react';
import { CollateralSaleInfo } from 'lib/loans/collateralSaleInfo';
import styles from './CollateralInfo.module.css';

type CollateralInfoProps = {
  loan: Loan;
  collateralSaleInfo: CollateralSaleInfo | null;
};

export const CollateralInfo = ({
  loan,
  collateralSaleInfo,
}: CollateralInfoProps) => {
  const tokenId = useMemo(
    () => loan.collateralTokenId.toString(),
    [loan.collateralTokenId],
  );

  if (!collateralSaleInfo) {
    return (
      <Fieldset legend="🖼️ Collateral">
        <dd>#{tokenId}</dd>
        <dd>
          <NFTExchangeAddressLink
            contractAddress={loan.collateralContractAddress}
            assetId={tokenId}
          />
        </dd>
      </Fieldset>
    );
  }

  return (
    <Fieldset legend="🖼️ Collateral">
      <DescriptionList>
        <dd>#{tokenId}</dd>
        <dd>
          <NFTExchangeAddressLink
            contractAddress={loan.collateralContractAddress}
            assetId={tokenId}
          />
        </dd>

        {!collateralSaleInfo.recentSale && (
          <>
            <dt className={styles.label}>item&apos;s last sale</dt>
            <dd>No recent sale info</dd>
          </>
        )}
        {!!collateralSaleInfo.recentSale && (
          <>
            <dt className={styles.label}>item&apos;s last sale</dt>
            <dd>
              {collateralSaleInfo.recentSale.price}{' '}
              {collateralSaleInfo.recentSale.paymentToken}
            </dd>
          </>
        )}

        <dt className={styles.label}>collection</dt>
        <dd>{loan.collateralName}</dd>

        <div className={styles.collectionInfoElement}>
          <dt className={styles.label}>items</dt>
          <dd>{collateralSaleInfo.collectionStats.items || '--'}</dd>
        </div>

        <div className={styles.collectionInfoElement}>
          <dt className={styles.label}>floor price</dt>
          <dd>{collateralSaleInfo.collectionStats.floor || '--'} ETH</dd>
        </div>

        <div className={styles.collectionInfoElement}>
          <dt className={styles.label}>owners</dt>
          <dd>{collateralSaleInfo.collectionStats.owners || '--'}</dd>
        </div>

        <div className={styles.collectionInfoElement}>
          <dt className={styles.label}>volume</dt>
          <dd>
            {collateralSaleInfo.collectionStats.volume?.toFixed(2) || '--'} ETH
          </dd>
        </div>
      </DescriptionList>
    </Fieldset>
  );
};
