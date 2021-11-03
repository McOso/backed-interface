import React, { useCallback, useEffect, useState } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { getLoanInfo } from 'lib/loan';
import TicketPageBody from 'components/ticketPage/TicketPageBody';
import PawnShopHeader from 'components/PawnShopHeader';

export default function Ticket({ ticketID }) {
  const [loanInfo, setLoanInfo] = useState(null);
  const [account, setAccount] = useState(null);

  const fetchData = useCallback(() => {
    setLoanInfo(null);
    console.log('fetching data');
    if (ticketID == null) {
      return;
    }
    getLoanInfo(`${ticketID}`).then(loanInfo => setLoanInfo(loanInfo));
  }, [ticketID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div id="ticket-page-wrapper">
      <PawnShopHeader
        account={account}
        setAccount={setAccount}
        message={`pawn loan #${ticketID}`}
      />
      {loanInfo == null ? (
        <Dimmer active={loanInfo == null} inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
      ) : (
        <TicketPageBody
          account={account}
          loanInfo={loanInfo}
          refresh={fetchData}
        />
      )}
    </div>
  );
}

function LoadingOverlay({ txHash }) {
  return (
    <div id="loading-box">
      Tx is loading
      <style jsx>
        {`
          #loading-box {
            display: ${txHash == '' ? 'none' : 'normal'};
          }
        `}
      </style>
    </div>
  );
}
