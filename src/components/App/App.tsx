import { useState} from "react";
import {DropdownMenu} from "../DropdownMenu/DropdownMenu";
import "./App.css"

export const App = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const handleDropdownToggle = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const data = [
    {
      number : 1
    },
    {
      number : 2
    },
    {
      number : 3
    },
  ]

  const handleDropdownFocus = (number: number) => {
    if (isOpen === number) {
      setIsOpen(null);
    } else {
      setIsOpen(number);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <DropdownMenu
        number={1}
        isOpen={activeDropdown === 1}
        onToggle={handleDropdownToggle}
      />
      <DropdownMenu
        number={2}
        isOpen={activeDropdown === 2}
        onToggle={handleDropdownToggle}
      />
      <DropdownMenu
        number={3}
        isOpen={activeDropdown === 3}
        onToggle={handleDropdownToggle}
      />
    </div>
  );
};

export default App;
