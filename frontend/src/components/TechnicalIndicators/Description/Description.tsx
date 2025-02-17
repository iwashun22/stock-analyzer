import React, { Component } from 'react';
import { FaBookOpen } from 'react-icons/fa';

import './Description.scss';

interface DescriptionHeader {
  title: string,
}

class Description extends Component<React.PropsWithChildren> {
  static Header: React.FC<React.PropsWithChildren<DescriptionHeader>> = ({ children, title }) => {
    return (
      <div className="header-container">
        <h4 className="title text-center">
          <FaBookOpen className="header-icon me-2"/>
          {title}
        </h4>
        <div className="header-context">
          { children }
        </div>
      </div>
    )
  }

  static SubHeader: React.FC<React.PropsWithChildren<DescriptionHeader>>  = ({ title, children }) => {
    return (
      <div className="sub-header-container">
        <h6 className="text-capitalize">{title}</h6>
        <div className="header-context">
          { children }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="description-container">
        { this.props.children }
      </div>
    )
  }
}

export default Description;
