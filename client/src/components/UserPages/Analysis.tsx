import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/api";
import { Button } from "../ui/button";
import "@/styles/Analysis.css";

const categories = [
  "All",
  "Food & Drink",
  "Bills & Utilities",
  "Entertainment",
  "Travel",
  "Gas",
];

export type Category = (typeof categories)[number];

const timeFrames = ["All Time", "Last Week", "Last Month", "Last 6 Months"];

interface Data {
  category: string;
  amount: string;
  date: string;
}

const Analysis = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [allData, setAllData] = useState<Data[]>([]); // Store all transactions
  const [filteredData, setFilteredData] = useState<Data[]>([]); // Filtered transactions
  const [selectedTimeFrame, setTimeFrame] = useState<string>("All Time");

  // Function to fetch data from API
  const fetchSpendingData = async () => {
    try {
      const data = await apiRequest("/query/transactions", "GET");
      setAllData(data); // Store the full dataset
      setFilteredData(data); // Default to show all data
    } catch (error) {
      console.error("Failed to fetch spending data:", error);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    if (categories.includes(category as Category)) {
      setSelectedCategory(category as Category);
    }
  };

  const handleTimeSelect = (timeFrame: string) => {
    setTimeFrame(timeFrame);
  };

  const handleSubmit = () => {
    let filtered = allData;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedTimeFrame !== "All Time") {
      const now = new Date();

      if (selectedTimeFrame === "Last Week") {
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        filtered = filtered.filter((item) => new Date(item.date) >= lastWeek);
      } else if (selectedTimeFrame === "Last Month") {
        const lastMonth = new Date(now);
        lastMonth.setDate(now.getMonth() - 1);
        filtered = filtered.filter((item) => new Date(item.date) >= lastMonth);
      }
    }
    setFilteredData(filtered);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSpendingData();
  }, []);

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
        <DropdownMenu>
          <DropdownMenuTrigger>{selectedTimeFrame}</DropdownMenuTrigger>
          <DropdownMenuContent
            sideOffset={6}
            align="start"
            style={{
              position: "fixed",
              animation: "fade-in 200ms ease-out, zoom-in 200ms ease-out",
            }}
          >
            <DropdownMenuRadioGroup
              value={selectedTimeFrame}
              onValueChange={handleTimeSelect}
            >
              {timeFrames.map((time) => (
                <DropdownMenuRadioItem key={time} value={time}>
                  {time}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <table className="display-results">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody className="table-body-wrapper">
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>{"$" + item.amount}</td>
              <td>{item.transaction_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Analysis;
