import { useRef } from 'react';
import Description, { Emphasis as Emph, SmallHeader } from './Description';

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
        <DocsWithRanges indicator={indicator} section="customParam"/>
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
  section: "headerTitle" | "purpose" | "customParam"
}) {

  if (section === "customParam") {
    switch(indicator) {
      case 'ADX':
        return (
          <>
            <Description.BulletPoints name="show-DI">
              Toggle to display the positive and negative directional indicators.
            </Description.BulletPoints>
          </>
        )
      default:
        return null;
    }
  }

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
          A technical indicator used to measure the strength of a trend.
        </p>
      ) : (
        <>
          <p>
            <Emph>ADX</Emph> helps traders determine whether a trend is strong enough to follow or if the market is ranging (moving sideways). 
          </p>
          <p>
            It is usually used with <Emph>Directional Indicators</Emph>, which include the Positive Directional Indicator (+DI) and the Negative Directional Indicator (-DI) as part of the Directional Movement System.
          </p>
          <ul>
            <li>
              <Emph>+DI</Emph> measures the strength of <Emph underline>upward</Emph> movements.
            </li>
            <li>
              <Emph>-DI</Emph> measures the strength of <Emph underline>downward</Emph> movements.
            </li>
          </ul>
          <SmallHeader>How to interpret ADX?</SmallHeader>
          <ul>
            <li>
              Below 20 → Weak trend or sideways market.
            </li>
            <li>
              20-40 → Moderate trend.
            </li>
            <li>
              40-60 → Strong trend.
            </li>
            <li>
              Above 60 → Very strong trend.
            </li>
          </ul>
          <SmallHeader>Example</SmallHeader>
          <p>If the <Emph>ADX</Emph> value is greater than 25 and <Emph>+DI</Emph> is greater than <Emph>-DI</Emph>, that means the uptrend is strong.</p>
          <p>In the opposite way, if the <Emph>ADX</Emph> value is greater than 25 and <Emph>-DI</Emph> is greater than <Emph>+DI</Emph>, that means the downtrend is strong.</p>
        </>
      )
    case 'ATR':
      return section === "headerTitle" ? (
        <p>
          ATR measures market volatility by calculating the average range between high and low prices over a specified period.
        </p>
      ) : (
        <>
          <p>
            It helps traders understand market conditions. A higher ATR indicates stronger price movements.
          </p>
          <Emph>High ATR</Emph>
          <ul>
            <li>Large price movements (big candles).</li>
            <li>Indicate potential breakouts or a strong trend.</li>
          </ul>
          <Emph>Low ATR</Emph>
          <ul>
            <li>Small price movements (small candles).</li>
            <li>Market is calm or in consolidation.</li>
          </ul>
        </>
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