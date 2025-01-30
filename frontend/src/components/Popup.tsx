import React from 'react';
import { IoMdClose } from 'react-icons/io';
import './Popup.scss';

type Variant = "default" | "error";
type ModalProps = React.PropsWithChildren<
  {
    show: boolean,
    noCloseButton?: false,
    onClose: (e: React.MouseEvent) => unknown,
    variant?: Variant
  } | {
    show: boolean,
    noCloseButton?: true,
    onClose?: never,
    variant?: Variant
  }
>;

function Popup({
  show,
  onClose,
  variant = 'default',
  noCloseButton = false,
  children,
}: ModalProps) {
  if (show) {
    return (
      <div className="darkfilter">
        <div className={`pop-up text-dark variant-${variant}`}>
          { 
            !noCloseButton && (
              <div className="close-btn-container">
                <button
                  className="bg-transparent close-btn"
                  onClick={onClose}
                >
                  <IoMdClose size={20} className="d-block close-icon"/>
                </button>
              </div>
            )
          }
          { children }
        </div>
      </div>
    )
  }
  else return <React.Fragment></React.Fragment>
}

export default Popup