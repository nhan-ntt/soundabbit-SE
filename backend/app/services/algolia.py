from algoliasearch.search_client import SearchClient
from dotenv import load_dotenv

import os

from database import SessionLocal  # Import SessionLocal
from models import Song, Artist

# Load environment variables
load_dotenv()

# Initialize the Algolia client
client = SearchClient.create(os.getenv('ALGOLIA_APP_ID'), os.getenv('ALGOLIA_WRITE_API_KEY'))

# Initialize the index
index = client.init_index(os.getenv('ALGOLIA_INIT_INDEX'))


# Function to sync songs
def sync_songs(db: SessionLocal):  # Change the type hint to SessionLocal
    # Query the database to get all songs
    songs = db.query(Song).all()
    artists = db.query(Artist).all()
    # Format the songs as a list of dictionaries
    objects = [{'objectID': song.id,
                'name': song.name,
                'audio_link': song.audio_link,
                'image_link': song.image_link,
                } for song in songs]
    # print(objects)
    # Add the songs to the index
    index.save_objects(objects)


# Create a Session instance
db = SessionLocal()

# Call the function with the Session instance
sync_songs(db)
