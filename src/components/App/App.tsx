import { useState} from "react";
import {DropdownMenu} from "../DropdownMenu/DropdownMenu";
import "./App.css"

export const App = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const handleDropdownToggle = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
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

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {
        data.map((item) => {
          return <DropdownMenu
          number={item.number}
          isOpen={activeDropdown === item.number}
          onToggle={handleDropdownToggle}
          key={item.number}
        />
        })
      }
    </div>
  );
};

export default App;
