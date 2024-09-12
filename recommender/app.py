from fastapi import FastAPI, HTTPException, Request
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# cors middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv("netflix_titles.csv")

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
index = faiss.read_index('netflix_movies_index.index')

@app.post("/api/recommend")
async def recommend_movie(request: Request):
    try:
        data = await request.json()
        query = data['query']
        if not query:
            raise HTTPException(status_code=400, detail="Query is empty")
        query_embedding = np.array(model.encode([query]))
        k = 10
        distances, indices = index.search(query_embedding, k)
        recommended_movies = df.iloc[indices[0]]['title'].tolist()
        return {"recommended_movies": recommended_movies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
