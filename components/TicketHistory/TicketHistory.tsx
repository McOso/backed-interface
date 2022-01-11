import { ethers } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import { jsonRpcLoanFacilitator } from 'lib/contracts';
import { Fieldset } from 'components/Fieldset';
import { ParsedEvent } from './ParsedEvent';
import { Loan } from 'types/Loan';
import styles from './TicketHistory.module.css';

interface TicketHistoryProps {
  loan: Loan;
}

export function TicketHistory({ loan }: TicketHistoryProps) {
  const [history, setHistory] = useState<ethers.Event[] | null>(null);

  const setup = useCallback(async () => {
    const history = await getTicketHistory(loan.id);
    setHistory(history);
  }, [loan.id]);

  useEffect(() => {
    setup();
  }, [setup]);

  return (
    <Fieldset legend="🎬 Activity">
      <div className={styles.container}>
        {history !== null &&
          history.map((e: ethers.Event, i) => (
            <ParsedEvent event={e} loan={loan} key={i} />
          ))}
      </div>
    </Fieldset>
  );
}

const getTicketHistory = async (loanId: ethers.BigNumber) => {
  const t0 = performance.now();

  const contract = jsonRpcLoanFacilitator();

  const mintTicketFilter = contract.filters.CreateLoan(loanId, null);
  const closeFilter = contract.filters.Close(loanId);
  const underwriteFilter = contract.filters.UnderwriteLoan(loanId);
  const buyoutUnderwriteFilter = contract.filters.BuyoutUnderwriter(loanId);
  const repayAndCloseFilter = contract.filters.Repay(loanId);
  const seizeCollateralFilter = contract.filters.SeizeCollateral(loanId);

  const filters = [
    mintTicketFilter,
    closeFilter,
    underwriteFilter,
    buyoutUnderwriteFilter,
    repayAndCloseFilter,
    seizeCollateralFilter,
  ];

  const [...events] = await Promise.all(
    filters.map((filter) => {
      return contract.queryFilter(
        filter,
        parseInt(process.env.NEXT_PUBLIC_FACILITATOR_START_BLOCK || ''),
      );
    }),
  );

  // TODO: keep track of TypedEvents so we don't have to do a type coercion
  // in ParsedEvent
  const allEvents = events.flat().sort((a, b) => b.blockNumber - a.blockNumber);

  const t1 = performance.now();
  console.log(`Call to getTicketHistoryPromiseAll took ${t1 - t0}ms`);

  return allEvents;
};