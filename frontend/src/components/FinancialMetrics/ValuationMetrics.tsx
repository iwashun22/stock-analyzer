import { useRef } from 'react';
import Table from 'react-bootstrap/Table';

function ValuationMetrics({ info }: { 
  info: { [key: string]: any }
}) {
  const keys = useRef<Array<{ represent: string, keyName: string }>>([
    { represent: 'Market Capitalization', keyName: 'marketCap' },
    { represent: 'Enterprise Value', keyName: 'enterpriseValue' },
    { represent: 'P/E Ratio', keyName: 'trailingPE' },
    { represent: 'PEG Ratio', keyName: 'pegRatio' },
    { represent: 'P/S Ratio', keyName: 'priceToSalesTrailing12Months' },
    { represent: 'P/B Ratio', keyName: 'priceToBook' },
  ]);
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          {
            keys.current.map(key => <th>{key.represent}</th>)
          }
        </tr>
      </thead>
      <tbody>
        <tr>
          {
            keys.current.map(({ keyName }) => 
              <td>{ info[keyName] ? info[keyName] : "-" }</td>
            )
          }
        </tr>
      </tbody>
    </Table>
  )
}

export default ValuationMetrics