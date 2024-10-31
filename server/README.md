cd server

install_windows.bat or install_unix.sh

python app.py

http --session=budgetai_session POST http://localhost:8080/user/signup name="John Doe" email="john@example.com" password="passWord123$"

http --session=budgetai_session POST http://localhost:8080/user/login email="john@example.com" password="passWord123$"

http --session=budgetai_session --form POST http://localhost:8080/upload/csv file@files/chase_freedom.csv

http --session=budgetai_session GET http://localhost:8080/query/transactions

http --session=budgetai_session POST http://localhost:8080/query/transactions/category category="Gas"

http --session=budgetai_session POST http://localhost:8080/user/wipe password="passWord123$"
