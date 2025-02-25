import React, { Component, useRef } from 'react';
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
        <div className="header-context fs-5">
          { children }
        </div>
      </div>
    )
  }

  static SubHeader: React.FC<React.PropsWithChildren<DescriptionHeader>>  = ({ children, title, variant = "plain" }) => {
    return (
      <div className={`sub-header-container variant-${variant} mb-4`}>
        <h4 className="sub-header-title text-capitalize fs-5">{title}</h4>
        <div className="header-context text-secondary">
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
          <i className="text-secondary-emphasis">{ name }</i>
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
      <div className="description-container px-3">
        { this.props.children }
      </div>
    )
  }
}

interface EmphasisProp {
  underline?: boolean,
  lineThrough?: boolean,
  italic?: boolean,
}
export const Emphasis: React.FC<React.PropsWithChildren<EmphasisProp>> = ({ children, underline = false, lineThrough = false, italic = false }) => {
  const classList = [
    "text-secondary-emphasis",
    underline && "text-decoration-underline",
    lineThrough && "text-decoration-line-through",
    italic && "fst-italic",
  ].filter(v => v);
  return (
    <i className={classList.join(" ")}>{ children }</i>
  )
}

export default Description;
