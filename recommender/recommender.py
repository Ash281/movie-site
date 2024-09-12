from fastapi import FastAPI, HTTPException
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

app = FastAPI()

df = pd.read_csv("netflix_movies.csv")

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
index = faiss.read_index('netflix_movies_index.index')

async def recommend_movie(query: str):
    try:
        query_embedding = np.array(model.encode([query]))
        k = 10
        distances, indices = index.search(query_embedding, k)
        recommended_movies = df.iloc[indices[0]]['title'].tolist()
        return {"recommended_movies": recommended_movies}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
