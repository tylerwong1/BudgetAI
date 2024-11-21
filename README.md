# BudgetAI

## Team Members:
- **Antonio Villarreal** (Project Manager)
- **Tyler Wong** (Scrum Master)
- **Robert Kilkenny** (Lead Developer)

## Advisor:
- **Neha Rani**

## Project Description:
BudgetAI is a web application designed to analyze credit card spending, visualize expenditure trends, and provide AI-driven budgeting recommendations. The application integrates both a frontend (for visualization and user interaction) and a backend (for handling API calls and data storage).

For more detailed information on the project, please refer to the full [Project Proposal](https://docs.google.com/document/d/1ONZCn0vUPkbhBzL3Ws0JeJxyeE3qcLh3IjFuwpUngoM/edit?usp=sharing).

## Technologies Used:
- **Frontend**: React, Vite, JavaScript/TypeScript
- **Backend**: Python, Flask, MongoDB
- **AI Integration**: GPT-3.5 Turbo API (via Azure)
- **Version Control**: Git

## Getting Started

### Prerequisites

To run the full project, you'll need the following applications installed on your machine:
- **Node.js** or **Yarn** (for managing frontend dependencies)
- **Python 3.0+** (for the backend)
- **MongoDB** (for database storage)

Make sure to have **multiple terminal instances** available for running the backend and frontend simultaneously.


### Backend Setup

1. **Install MongoDB**: Ensure that MongoDB is installed and running on your local machine. The backend will connect to it via `localhost:27017`.
   
2. **Install Dependencies**:
    - Run the appropriate setup script based on your operating system:
        - For Windows: `install_windows.bat`
        - For Unix/Linux: `install_unix.sh`
   
3. **Set Environment Variables**:
    - In the project directory, find the file `example.env`.
    - Fill in the **AZURE_ENDPOINT** and **AZURE_API_KEY** with your credentials for GPT-3.5 Turbo (you can get these credentials from the Azure portal).
    - Rename `example.env` to `.env` to activate the environment variables.
    
4. **Run the Backend**:
    - Start the Flask server by running the following command:
```bash
python app.py
```
This will start the backend at `localhost:8080`.


### Frontend Setup

Once the backend is running, follow these steps to get the frontend up and running:

1. **Navigate to the client directory**:
```bash
cd ./client
```
2. **Install dependencies**:

If you're using npm:
```bash
npm install
```
Or if you're using Yarn:
```bash
yarn install
```
3. **Run the Website Locally**:

If you're using npm:
```bash
npm run dev
```
Or if you're using Yarn:
```bash
yarn run dev
```
The frontend should now be accessible at http://localhost:5173/BudgetAI/.


## Usage
Once both the backend and frontend are running, open the web application in your browser:

- Log in
- Upload your credit card transactions or use a test dataset
- View your spending trends and receive AI-generated budgeting suggestions