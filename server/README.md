cd server

install_windows.bat or install_unix.sh

python app.py

http POST http://localhost:8080/user/signup name="John Doe" email="john@example.com" password="password123"

http POST http://localhost:8080/user/login email="john@example.com" password="password123"

http --session=budgetai_session POST http://localhost:8080/upload file='{"file": "<BASE64_STRING>", "filename": "chase_freedom.csv"}'




