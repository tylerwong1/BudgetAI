import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu"; // Adjust the path as necessary

const TransactionCategoryDropdown = () => {
  const [selectedCategory, setSelectedCategory] = useState("Select Category");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{selectedCategory}</DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={6}
        align="start"
        style={{
          position: "fixed", // Fixes the dropdown position relative to the screen, not the document flow
          animation: "fade-in 200ms ease-out, zoom-in 200ms ease-out",
        }}
      >
        <DropdownMenuRadioGroup
          value={selectedCategory}
          onValueChange={handleCategorySelect}
        >
          <DropdownMenuRadioItem value="Food & Dining">
            Food & Dining
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Utilities">
            Utilities
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Entertainment">
            Entertainment
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Travel">Travel</DropdownMenuRadioItem>
          {/* Add more categories as needed */}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionCategoryDropdown;
