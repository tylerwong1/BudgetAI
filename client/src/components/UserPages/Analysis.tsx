import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import "@/styles/Analysis.css";

const Analysis = () => {
  const [selectedCategory, setSelectedCategory] = useState("Select Category");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Dummy data for table rows
  const spendingData = [
    { category: "Food & Dining", amount: "$200", date: "2024-11-01" },
    { category: "Utilities", amount: "$150", date: "2024-11-02" },
    { category: "Entertainment", amount: "$75", date: "2024-11-03" },
    { category: "Travel", amount: "$300", date: "2024-11-04" },
  ];

  return (
    <div className="content-holder">
      <div className="user-select-analysis">
        <DropdownMenu>
          <DropdownMenuTrigger>{selectedCategory}</DropdownMenuTrigger>
          <DropdownMenuContent
            sideOffset={6}
            align="start"
            style={{
              position: "fixed",
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
      </div>
        <table className="display-results">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
            <tbody className="table-body-wrapper">
              {spendingData.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>{item.amount}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
  );
};

export default Analysis;
