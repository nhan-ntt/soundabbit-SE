# Sounddabit API
* Built with FastAPI and PostgreSQL
# How to run
1. Clone the repository
2. Activate your virtual environment
3. Install the dependencies
```
pip install -r requirements.txt
```
4. Init the database
```
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```
5. Configuration

- Ensure you have the required environment variables.
```
SECRET_KEY='your_secret_key'
DATABASE_URL="postgresql://postgres:password@localhost:5432/your_db_name"
ALGOLIA_INIT_INDEX="your_index_name"    
ALGOLIA_API_KEY=yourapikey
ALGOLIA_APP_ID=yourappid
ALGOLIA_WRITE_API_KEY=yourwriteapikey
```
6. Run the application
```
uvicorn app.main:app --reload
```

***Note:***
*You can visit http://localhost:8000/docs to see the API documentation*

