import React, { Component } from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { TbDiamondFilled, TbArrowBadgeRight } from 'react-icons/tb';

import './Description.scss';

interface DescriptionHeader {
  title: string,
  variant?: "plain" | "gray"
}
interface BulletPointProp {
  name: string,
}

class Description extends Component<React.PropsWithChildren> {
  static Header: React.FC<React.PropsWithChildren<DescriptionHeader>> = ({ children, title, variant = "plain" }) => {
    return (
      <div className={`header-container mb-4 variant-${variant}`}>
        <h2 className="title text-center fs-4">
          <FaBookOpen className="header-icon me-2"/>
          {title}
        </h2>
        <div className="header-context">
          { children }
        </div>
      </div>
    )
  }

  static SubHeader: React.FC<React.PropsWithChildren<DescriptionHeader>>  = ({ children, title, variant = "plain" }) => {
    return (
      <div className={`sub-header-container variant-${variant}`}>
        <h4 className="sub-header-title text-capitalize fs-5">{title}</h4>
        <div className="header-context">
          { children }
        </div>
      </div>
    )
  }

  static BulletPoints: React.FC<React.PropsWithChildren<BulletPointProp>> = ({ name, children }) => {
    return (
      <div className="bullet-list">
        <h6 className="text-capitalize fs-6 fw-semibold list-name">
          <TbDiamondFilled className="bullet-icon me-2"/>
          { name }
          <TbArrowBadgeRight className="separator-icon mx-3"/>
        </h6>
        <p className="bullet-list-description fs-6 list-description">
          { children }
        </p>
      </div>
    )
  }

  render() {
    return (
      <div className="description-container mx-3">
        { this.props.children }
      </div>
    )
  }
}

export default Description;
