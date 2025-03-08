import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaEdit } from 'react-icons/fa';
import './AboutApp.scss';

interface LinkProp {
  id: string,
  tooltip: string,
  linkTo?: string,
}
function Link({ id, children, tooltip, linkTo="#" }: React.PropsWithChildren<LinkProp>) {
  const isExternalLink = linkTo !== "#";
  return (
    <OverlayTrigger overlay={<Tooltip id={id}>{tooltip}</Tooltip>}>
      <a href={linkTo} target={isExternalLink ? "_blank" : "_self"}>{ children }</a>
    </OverlayTrigger>
  )
}

function AboutApp() {
  return (
    <section id="about-app">
      <h1 className="text-uppercase fw-bolder text-center about-header mb-4">About</h1>
      <p>
        Hello, my name is Shun. Welcome to the Stock Analyzer web application.
        This application focuses on studying how to use technical indicators. I am using a library called <Link linkTo="https://ta-lib.org" id="ta-lib-link" tooltip="A Technical Analysis Library (Core written in C/C++).">TA-Lib</Link>.
        While this does not guarantee accurate stock trend predictions, it helps users understand potential market trends.
        The stock data is retrieved in real-time from <Link tooltip="An open source Python library that provides free access to financial data on Yahoo Finance." id="yfinance-link" linkTo="https://pypi.org/project/yfinance/">yfinance</Link>.
      </p>
      <div className="split-container mt-5">
        <div className="left-container">
          <h3 className="fs-4 fw-bold styled-header">Stock</h3>
          <p>
            This application also provides some financial metrics data. You can only analyze the stock market, meaning cryptocurrency and foreign exchange rates are not included.
          </p>
        </div>
        <div className="right-container">
          <h3 className="fs-4 fw-bold styled-header">Key features</h3>
          <p>
            With this web application, you can generate graphs to analyze stock trends using various indicators. You can customize the indicators, compare them, and generate as many graph images as you need for your analysis.
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="fs-3 fw-bold mb-3">How to use?</h2>
        <p>
          Enter the stock symbol you want to analyze in the search bar. The system will check if the symbol is available.
        </p>
        <p>
          Then you will be redirected to the analysis page, where you can view financial data and generate graphs.
        </p>
        <p>
          You can click on the symbol at the top to look up a different stock or click <FaEdit/> to adjust the time period and interval. If all the images fail to load, try changing the time period or the interval. If the data is empty or too large, it may cause an error.
        </p>
      </div>
    </section>
  )
}

export default AboutApp;