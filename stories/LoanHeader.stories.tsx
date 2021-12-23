import React from 'react';
import { PawnShopHeader } from 'components/PawnShopHeader';
import { LoanHeader } from 'components/LoanHeader';
import {
  baseLoan,
  closedLoan,
  loanWithLenderAccruing,
  loanWithLenderPastDue,
  now,
} from 'lib/mockData';
import { TimestampContext } from 'hooks/useTimestamp/useTimestamp';

export default {
  title: 'components/LoanHeader',
  component: LoanHeader,
  decorators: [
    (Story: any) => (
      <TimestampContext.Provider value={now}>
        <Story />
      </TimestampContext.Provider>
    ),
  ],
};

const collateralMedia = {
  mediaUrl:
    'https://nftpawnshop.mypinata.cloud/ipfs/QmfBX5znHic5TQ5NE6CEYpVfMNsdASYDRj1dMR7mqQUGuQ',
  mediaMimeType: 'video',
};

export function LoanHeaderAwaiting() {
  return (
    <>
      <PawnShopHeader />
      <LoanHeader loan={baseLoan} collateralMedia={collateralMedia} />
    </>
  );
}

export function LoanHeaderWithLenderAccruing() {
  return (
    <>
      <PawnShopHeader />
      <LoanHeader
        loan={loanWithLenderAccruing}
        collateralMedia={collateralMedia}
      />
    </>
  );
}

export function LoanHeaderWithLenderPastDue() {
  return (
    <>
      <PawnShopHeader />
      <LoanHeader
        loan={loanWithLenderPastDue}
        collateralMedia={collateralMedia}
      />
    </>
  );
}

export function LoanHeaderClosed() {
  return (
    <>
      <PawnShopHeader />
      <LoanHeader loan={closedLoan} collateralMedia={collateralMedia} />
    </>
  );
}