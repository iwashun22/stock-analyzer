import { useRef } from 'react';
import Description, { Emphasis as Emph, SmallHeader } from './Description';
import { MdArrowRightAlt } from 'react-icons/md';

const INDICATOR_WITH_RANGES = ['SMA', 'EMA', 'RSI', 'ADX', 'ATR', 'BBANDS'] as const;

const isIncludingRanages = (str: string): str is (typeof INDICATOR_WITH_RANGES[number]) => {
  return INDICATOR_WITH_RANGES.some(v => v === str);
}

const subheaderTitle = "detail";
const inputFieldTitle = "Input";

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
        <DocsWithRanges indicator={indicator} section="detail"/>
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
          A trend-following momentum indicator that identifies changes in trend direction, strength, and momentum.
        </p>
      </Description.Header>
      <Description.SubHeader title={subheaderTitle}>
        <p>
          <Emph>MACD</Emph> consists of three components:
        </p>
        <ol>
          <li>
            <Emph>MACD Line</Emph>
            <p>
              The difference between the short-term <Emph underline>EMA</Emph> and the long-term <Emph underline>EMA</Emph> typically 12 and 26 periods, respectfully.
            </p>
          </li>
          <li>
            <Emph>Signal Line</Emph>
            <p>
              The EMA (typically with a period of 9) of the MACD Line, used to generate buy/sell signals.
            </p>
          </li>
          <li>
            <Emph>Histogram</Emph>
            <p>
              The difference between the MACD Line and the Signal Line.
            </p>
          </li>
        </ol>
        <SmallHeader>Common MACD settings:</SmallHeader>
        <p>Order in short-term EMA, long-term EMA, and the Signal EMA.</p>
        <ul>
          {
            ([
              [12, 26, 9, "Standard and most commonly used"],
              [5, 35, 5, "Used for the long-term trading"],
              [3, 10, 16, "More responsive to short-term trading"]
            ] as const).map((v, i) => {
              const [fastperiod, slowperiod, signal, explanation] = v;
              return (
                <li key={i}>
                  <Emph>{fastperiod}, {slowperiod}, {signal}</Emph>
                  <p>{explanation}.</p>
                </li>
              );
            })
          }
        </ul>
        <SmallHeader>How to interpret MACD?</SmallHeader>
        <Emph>Bullish market</Emph>
        <ul>
          <li>
            When the MACD Line crosses above the Signal Line.
          </li>
          <li>
            When the Histogram is positive and growing.
          </li>
        </ul>
        <Emph>Bearish market</Emph>
        <ul>
          <li>
            When the MACD Line crosses below the Signal Line.
          </li>
          <li>
            When the Histogram is negative and growing.
          </li>
        </ul>
      </Description.SubHeader>
      <Description.SubHeader title={inputFieldTitle} variant="gray">
        <Description.BulletPoints name="fast period">
          The number of periods for a short-term EMA that results in the MACD Line.
        </Description.BulletPoints>
        <br/>
        <Description.BulletPoints name="slow period">
          The number of periods for a long-term EMA that results in the MACD Line.
        </Description.BulletPoints>
        <Description.BulletPoints name="signal period">
          The number of periods for the EMA of the MACD Line.
        </Description.BulletPoints>
      </Description.SubHeader>
    </Description>
  )

  return null;
}

function DocsWithRanges({ indicator, section }: {
  indicator: typeof INDICATOR_WITH_RANGES[number],
  section: "headerTitle" | "detail" | "customParam"
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
              Below 20 <MdArrowRightAlt/> Weak trend or sideways market.
            </li>
            <li>
              20-40 <MdArrowRightAlt/> Moderate trend.
            </li>
            <li>
              40-60 <MdArrowRightAlt/> Strong trend.
            </li>
            <li>
              Above 60 <MdArrowRightAlt/> Very strong trend.
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
      return section === "headerTitle" ? (
        <p>
          A technical indicator that analyzes market volatility, visualized with bands on the graph.
        </p>
      ) : (
        <>
          <p>
            Wider bands indicate higher volatility, while narrower bands indicate lower volatility.
          </p>
          <p>
            <Emph>Bollinger Bands (BBANDS)</Emph> are consisted of three lines:
          </p>
          <ul>
            <li>
              <Emph>Middle Band</Emph>
              <p className="ps-3 formula-text">= SMA(n)</p>
            </li>
            <li>
              <Emph>Upper Band</Emph>
              <p className="ps-3 formula-text">= SMA(n) + (K &times; &sigma;)</p>
            </li>
            <li>
              <Emph>Lower Band</Emph>
              <p className="ps-3 formula-text">= SMA(n) &minus; (K &times; &sigma;)</p>
            </li>
          </ul>
          <p><Emph>Where:</Emph></p>
          <p className="ps-3">
            <Emph>SMA</Emph> is the Simple Moving Average (20 periods by default).
          </p>
          <p className="ps-3">
            <Emph>&sigma;</Emph> is the standard deviation of the price.
          </p>
          <p className="ps-3">
            <Emph>K</Emph> is a multiplier (typically 2).
          </p>
        </>
      )
    case 'RSI':
      return section === "headerTitle" ? (
        <p>
          A technical indicator measuring the speed and change of price movements.
        </p>
      ) : (
        <>
          <p>
            <Emph>RSI</Emph> value ranges from 0 to 100 and helps traders identify <Emph>overbought</Emph> or <Emph>oversold</Emph> conditions in a market.
          </p>
          <SmallHeader>How to interpret RSI?</SmallHeader>
          <ol>
            <li>
              <div className="mb-2">
                <Emph>Overbought & Oversold conditions</Emph>
              </div>
              <ul>
                <li>
                  Above 70 <MdArrowRightAlt/> Overbought (potential price reversal or pullback)
                </li>
                <li>
                  Below 30 <MdArrowRightAlt/> Oversold (potential price bounce or rally)
                </li>
              </ul>
            </li>
            <li>
              <div className="mb-2">
                <Emph>Trend strength</Emph>
              </div>
              <ul>
                <li>
                  Above 50 <MdArrowRightAlt/> Indicate uptrend
                </li>
                <li>
                  Below 50 <MdArrowRightAlt/> Indicate downtrend
                </li>
              </ul>
            </li>
          </ol>
        </>
      )
  }
}

export default Docs;