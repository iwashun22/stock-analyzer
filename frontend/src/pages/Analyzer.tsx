import TargetEditor from '@/components/TargetEditor';
import FinancialMetrics from '@/components/FinancialMetrics';
import TechnicalIndicators from '@/components/TechnicalIndicators';

function Analyzer() {
  return (
    <>
      <TargetEditor/>
      <FinancialMetrics/>
      <TechnicalIndicators/>
    </>
  )
}

export default Analyzer