import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { formattedAnnualRate } from 'lib/interest';
import { SCALAR } from 'lib/constants';
import { addressToENS } from 'lib/account';
import { Loan as ParsedLoan } from 'types/Loan';
import { Loan } from 'types/generated/graphql/nftLoans';
import { ethers } from 'ethers';

dayjs.extend(duration);

export const ensOrAddr = async (rawAddress: string): Promise<string> => {
  const ens = await addressToENS(rawAddress);
  if (ens === null) {
    return rawAddress.substring(0, 7);
  }
  return ens;
};

export const emailHeader = (loan: Loan): string =>
  `Loan #${loan.id}: ${loan.collateralName}`;

export const formattedLoanTerms = (
  loanAmount: number,
  loanAssetDecimal: number,
  perSecondInterestRate: number,
  durationSeconds: number,
  loanAssetSymbol: string,
) => {
  const parsedLoanAmount = ethers.utils.formatUnits(
    loanAmount.toString(),
    loanAssetDecimal,
  );
  const amount = `${parsedLoanAmount} ${loanAssetSymbol}`;

  const interest = formattedAnnualRate(
    ethers.BigNumber.from(perSecondInterestRate),
  );

  return {
    amount,
    duration: formattedDuration(durationSeconds),
    interest: `${interest}%`,
  };
};

export const getEstimatedRepaymentAndMaturity = (
  loan: ParsedLoan,
  duration: ethers.BigNumber = loan.durationSeconds,
): [string, string] => {
  const interestOverTerm = loan.perSecondInterestRate
    .mul(duration)
    .mul(loan.loanAmount)
    .div(SCALAR);

  const estimatedRepayment = ethers.utils.formatUnits(
    loan.accumulatedInterest.add(interestOverTerm).add(loan.loanAmount),
    loan.loanAssetDecimals,
  );

  const dateOfMaturity = formattedDate(loan.endDateTimestamp!);

  return [estimatedRepayment, dateOfMaturity];
};

export const formattedDuration = (duration: number): string => {
  const days = Math.floor(dayjs.duration({ seconds: duration }).asDays());
  if (days != 0) {
    return `${days} days`;
  }

  const hours = Math.floor(dayjs.duration({ seconds: duration }).asHours());
  if (hours != 0) {
    return `${hours} hours`;
  }

  const minutes = Math.floor(dayjs.duration({ seconds: duration }).asMinutes());
  return `${minutes} minutes`;
};

export const formattedDate = (timestamp: number): string =>
  dayjs.unix(timestamp).format('MM/DD/YYYY');
