import { useRef } from 'react';
import Description, { Emphasis as Emph } from './Description';

const INDICATOR_WITH_RANGES = ['SMA', 'EMA', 'RSI', 'ADX', 'ATR', 'BBANDS'] as const;

const isIncludingRanages = (str: string): str is (typeof INDICATOR_WITH_RANGES[number]) => {
  return INDICATOR_WITH_RANGES.some(v => v === str);
}

const subheaderTitle = "purpose";
const inputFieldTitle = "fields";

function Docs({ indicator, fullname }: {
  indicator: string,
  fullname: string,
}) {
  const formattedHeader = useRef(`${fullname}(${indicator})`);

  if (isIncludingRanages(indicator)) return (
    <Description>
      <Description.Header title={formattedHeader.current}>
        <DocsWithRanges indicator={indicator} section="headerTitle"/>
      </Description.Header>
      <Description.SubHeader title={subheaderTitle}>
        <DocsWithRanges indicator={indicator} section="purpose"/>
      </Description.SubHeader>
      <Description.SubHeader title={inputFieldTitle} variant="gray">
        <Description.BulletPoints name="range">
          The number of periods used to calculate the output.
        </Description.BulletPoints>
      </Description.SubHeader>
    </Description>
  )

  if (indicator === 'MACD') return (
    <Description>
      <Description.Header title={formattedHeader.current}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolores exercitationem dignissimos. Dicta aut eum quos sit. Quo expedita nostrum corrupti tempora, labore, debitis aut mollitia neque explicabo, vero eos.
        </p>
      </Description.Header>
      <Description.SubHeader title={subheaderTitle}>

      </Description.SubHeader>
      <Description.SubHeader title={inputFieldTitle} variant="gray">
        <Description.BulletPoints name="fastperiod">
          Hello World
        </Description.BulletPoints>
        <br/>
        <Description.BulletPoints name="slowperiod">
          Hello World
        </Description.BulletPoints>
      </Description.SubHeader>
    </Description>
  )

  return <></>
}

function DocsWithRanges({ indicator, section }: {
  indicator: typeof INDICATOR_WITH_RANGES[number],
  section: "headerTitle" | "purpose"
}) {
  switch (indicator) {
    case 'SMA':
      return section === "headerTitle" ? (
        <p>
          The average of a selected range of prices.
        </p>
      ) : (
        <>
          <p>
            <Emph>SMA</Emph> is used in technical analysis to smooth out price data and identify trends over a specific period.
          </p>
          <p>It helps determine the overall direction of the trend.</p>
          <p>
            A short-term SMA crossing above a long-term SMA can signal a <Emph underline>buy opportunity.</Emph>
          </p>
        </>
      )
    case 'EMA':
      return section === "headerTitle" ? (
        <p>
          A moving average that gives more weight to recent prices.
        </p>
      ) : (
        <>
          <p><Emph>EMA</Emph> reacts more quickly to price changes than SMA, helping traders identify trends earlier.</p>
          <p>A short-term EMA crossing above a long-term EMA (e.g., 12-day EMA crossing 26-day EMA) is a <Emph underline>bullish signal.</Emph></p>
        </>
      )
    case 'ADX':
      return section === "headerTitle" ? (
        <p>
          A moving average that gives more weight to recent prices.
        </p>
      ) : (
        <>
          <p><Emph>EMA</Emph> reacts more quickly to price changes than SMA, helping traders identify trends earlier.</p>
          <p>A short-term EMA crossing above a long-term EMA (e.g., 12-day EMA crossing 26-day EMA) is a <Emph underline>bullish signal.</Emph></p>
        </>
      )
    case 'ATR':
      return (
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure fugit libero dolorem incidunt beatae amet? Facere reprehenderit delectus, sit eaque amet expedita? Consequatur reiciendis aliquid nulla. Quo eos unde iste?
        </p>
      )
    case 'BBANDS':
      return (
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure fugit libero dolorem incidunt beatae amet? Facere reprehenderit delectus, sit eaque amet expedita? Consequatur reiciendis aliquid nulla. Quo eos unde iste?
        </p>
      )
    case 'RSI':
      return (
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure fugit libero dolorem incidunt beatae amet? Facere reprehenderit delectus, sit eaque amet expedita? Consequatur reiciendis aliquid nulla. Quo eos unde iste?
        </p>
      )
  }
}

export default Docs;