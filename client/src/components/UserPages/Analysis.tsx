import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import "@/styles/Analysis.css";

// Dummy data for later
const spendingData = [
  { category: "Food & Dining", amount: "$200", date: "2024-11-01" },
  { category: "Utilities", amount: "$150", date: "2024-11-02" },
  { category: "Entertainment", amount: "$75", date: "2024-11-03" },
  { category: "Travel", amount: "$300", date: "2024-11-04" },
];

const categories = ["All", "Food & Dining", "Utilities", "Entertainment", "Travel"];
export type Category = typeof categories[number];

interface Data {
  category: string,
  amount: string,
  date: string
}

const Analysis = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [filteredData, setFilteredData] = useState<Data[]>(spendingData);

  const handleCategorySelect = (category: string) => {
    if (["All", "Food & Dining", "Utilities", "Entertainment", "Travel"].includes(category)) {
      setSelectedCategory(category as Category);
    }
  };

  useEffect(()=> {
    if (selectedCategory === "All") {
      setFilteredData(spendingData);
    } else {
      setFilteredData(spendingData.filter((item) => item.category === selectedCategory));
    }
  },[spendingData, selectedCategory])

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
            {categories.map((category) => (
              <DropdownMenuRadioItem key={category} value={category}>
                {category}
              </DropdownMenuRadioItem>
            ))}
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
              {filteredData.map((item, index) => (
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
