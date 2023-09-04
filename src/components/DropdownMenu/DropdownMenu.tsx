import {useState, useEffect, useRef} from "react";
import { createPortal } from "react-dom";
import './DropdownMenu.css'
import {data} from "../../utils/data"

interface DropdownMenuProps {
  number: number;
  isOpen: boolean;
  onToggle: (id: number) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({number, onToggle, isOpen}) => {
  const [isTextSelected, setIsTextSelected] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const dropdownOpenDown = useRef<boolean>(true);
  const dropdownOpenRight = useRef<boolean>(true)
  const [dropdownDirection, setDropdownDirection] = useState<string>('down-right');
  const [activeElement, setActiveElement] = useState<Element | null>(null);

  useEffect(() => {
    const recalculateDropdownDirection = () => {
      if (isOpen && buttonRef.current && dropdownRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const availableSpaceLeft = buttonRect.left;
        const availableSpaceRight = viewportWidth - (buttonRect.left + buttonRect.width);
        const dropdownWidth = dropdownRef.current.offsetWidth;
  
        dropdownOpenDown.current = buttonRect.top + buttonRect.height + (dropdownRef.current?.offsetHeight ?? 0) <= viewportHeight;
        dropdownOpenRight.current = availableSpaceLeft <= availableSpaceRight;
      }
  
      let newDirection = '';
  
      if (dropdownOpenDown.current) {
        newDirection += 'down-';
      } else {
        newDirection += 'up-';
      }
  
      if (dropdownOpenRight.current) {
        newDirection += 'right';
      } else {
        newDirection += 'left';
      }
  
      setDropdownDirection(newDirection);
    };

    recalculateDropdownDirection();

    const handleScroll = () => {
      recalculateDropdownDirection();

      if (!buttonRef.current) return;
  
      const buttonRect = buttonRef.current.getBoundingClientRect();
  
      if (buttonRect.top < 0 || buttonRect.bottom > window.innerHeight) {
        if (isOpen) {
          onToggle(-1);
        }
      } else {
        if (activeElement) {
          onToggle(isOpen ? -1 : number);
        }
      }
    }

    const handleResize = () => {
      recalculateDropdownDirection();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener("scroll", handleScroll);
  
    if (isOpen) {
      setActiveElement(document.activeElement);
    } else {
      setActiveElement(null);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener("scroll", handleScroll);
    };

  
  }, [isOpen, number, activeElement]);

  const handleTriggerClick = () => {
    onToggle(isOpen ? -1 : number);
  };
  
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };

    const buttonRect = buttonRef.current.getBoundingClientRect();

    const top = dropdownOpenDown.current
      ? buttonRect.top + buttonRect.height
      : buttonRect.top - (dropdownRef.current?.offsetHeight ?? 0);
    const left = dropdownOpenRight.current
      ? buttonRect.left
      : buttonRect.left - (dropdownRef.current?.offsetWidth ?? 0) + buttonRect.width;

    return { top, left };
  };

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (resultRef.current && e.target) {
      resultRef.current.innerText = (e.target as HTMLElement).textContent || "";
      setIsTextSelected(true);
    }
    onToggle(-1);
  }

  const renderDropdown = () => {
    if (!isOpen || !buttonRef.current) return null;
  
    const menuStyles = {
      position: "absolute" as const,
      ...getDropdownPosition(),
    };
  
    return createPortal(
      <ul ref={dropdownRef} className={`ul ${dropdownDirection}`} style={menuStyles}>
        {data.map((item, index) => (
          <li className="li" key={index} onClick={(e) => handleClick(e)}>
            {item.text}
            <img className="img" src={item.img} alt="img" />
          </li>
        ))}
      </ul>,
      document.body
    );
  };
  
  return (
    <>
      <div className="container-button">
        <button className="button" ref={buttonRef} onClick={handleTriggerClick}></button>
        <div className="result" style={isTextSelected ? { display: 'block' } : {}} ref={resultRef}></div>
      </div>
      {renderDropdown()}
    </>
  );
};