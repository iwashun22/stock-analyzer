import { useRef } from 'react';
import Description from './Description';

const INDICATOR_WITH_RANGES = ['SMA', 'EMA', 'RSI', 'ADX', 'ATR', 'BBANDS'] as const;

const isIncludingRanages = (str: string): str is (typeof INDICATOR_WITH_RANGES[number]) => {
  return INDICATOR_WITH_RANGES.some(v => v === str);
}

function Docs({ indicator, fullname }: {
  indicator: string,
  fullname: string,
}) {
  const formattedHeader = useRef(`${fullname}(${indicator})`);

  if (isIncludingRanages(indicator)) return (
    <Description>
      <Description.Header title={formattedHeader.current}>
        <DocsWithRanges indicator={indicator} />
      </Description.Header>
      <Description.SubHeader title="fields" variant="gray">
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
      <Description.SubHeader title="fields" variant="gray">
        <Description.BulletPoints name="fastperiod">
          Hello World
        </Description.BulletPoints>
        <Description.BulletPoints name="slowperiod">
          Hello World
        </Description.BulletPoints>
      </Description.SubHeader>
    </Description>
  )

  return <></>
}

function DocsWithRanges({ indicator }: {
  indicator: typeof INDICATOR_WITH_RANGES[number],
}) {
  switch (indicator) {
    case 'SMA':
      return (
        <p>
          The average of a selected range of prices.
        </p>
      )
    case 'EMA':
      return (
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure fugit libero dolorem incidunt beatae amet? Facere reprehenderit delectus, sit eaque amet expedita? Consequatur reiciendis aliquid nulla. Quo eos unde iste?
        </p>
      )
    case 'ADX':
      return (
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure fugit libero dolorem incidunt beatae amet? Facere reprehenderit delectus, sit eaque amet expedita? Consequatur reiciendis aliquid nulla. Quo eos unde iste?
        </p>
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