import {useState, useEffect, useRef} from "react";
import { createPortal } from "react-dom";
import './DropdownMenu.css'

interface DropdownMenuProps {
  number: number;
  isOpen: boolean;
  onToggle: (id: number) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({number, onToggle, isOpen}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const dropdownOpenDown = useRef<boolean>(true);
  const dropdownOpenRight = useRef<boolean>(true)
  const [dropdownDirection, setDropdownDirection] = useState<string>('down-right');
  const [activeElement, setActiveElement] = useState<Element | null>(null);

  const data = [
    "item 1", "item 2", "item 3", "item 4", "item 5"
  ]

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

    const handleResize = () => {
      recalculateDropdownDirection();
    };

    window.addEventListener('resize', handleResize);
  
    if (isOpen) {
      setActiveElement(document.activeElement);
    } else {
      setActiveElement(null);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
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

  const renderDropdown = () => {
    if (!isOpen || !buttonRef.current) return null;
  
    const menuStyles = {
      position: "absolute" as const,
      ...getDropdownPosition(),
    };
  
    return createPortal(
      <ul ref={dropdownRef} className={`ul ${dropdownDirection}`} style={menuStyles}>
        {data.map((item) => (
          <li className="li" key={item}>
            {item}
          </li>
        ))}
      </ul>,
      document.body
    );
  };
  
  return (
      <>
        <button className="button" ref={buttonRef} onClick={handleTriggerClick}>
          {number}
        </button>
        {renderDropdown()}
    </>
  );
};