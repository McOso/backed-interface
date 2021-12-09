import { ethers } from 'ethers';
import { formattedAnnualRate } from 'lib/interest';
import { LoanInfo } from 'lib/LoanInfoType';

export type LoanStatus = 'indeterminate' | 'active' | 'past due';

// this file is named weirdly because apparently `constants` is a reserved, deprecated module.

export const headerMessages = {
  availableForLending: ['Available for Lending'],
  test: ['Get an NFT and DAI '],
  create: ['Create a Loan'],
  ticket: (
    {
      loanId,
      loanAmount,
      loanAssetDecimals,
      perSecondInterestRate,
      loanAssetSymbol,
      closed,
      lastAccumulatedTimestamp,
      durationSeconds,
    }: LoanInfo,
    status: LoanStatus,
  ) => {
    if (closed) {
      return [`Loan #${loanId} (closed)`];
    }

    const amount = ethers.utils.formatUnits(loanAmount, loanAssetDecimals);
    const interestRate = formattedAnnualRate(perSecondInterestRate);
    const idEntry = `Loan #${loanId}`;
    const paymentEntry = `${amount} ${loanAssetSymbol} @ ${interestRate}%`;
    const statusEntry = (() => {
      if (lastAccumulatedTimestamp.eq(0)) {
        return 'Awaiting lender';
      }

      // Waiting on the first timestamp refresh
      if (status === 'indeterminate') {
        return 'Loading...';
      }

      if (status === 'past due') {
        return 'Past due';
      }

      return 'Accruing interest';
    })();
    return [idEntry, paymentEntry, statusEntry];
  },
};