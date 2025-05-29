import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from typing import List
from database import connect
from models import Article, ArticleCreate

router = APIRouter()
UPLOAD_DIR = "uploads"

@router.post("/", response_model=Article)
async def create_article(
    titre: str = Form(...),
    prix: float = Form(...),
    unite: str = Form(...),
    description: str = Form(""),
    categorie: str = Form(...),
    sous_categorie: str = Form(...),
    date_rappel: str = Form(""),
    file: UploadFile = File(None)
):
    filename = None
    if file:
        filename = file.filename
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

    conn = await connect()
    row = await conn.fetchrow("""
        INSERT INTO articles (titre, prix, unite, description, categorie, sous_categorie, date_rappel, piece_jointe)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    """, titre, prix, unite, description, categorie, sous_categorie, date_rappel, filename)
    await conn.close()
    return dict(row)

@router.get("/", response_model=List[Article])
async def list_articles():
    conn = await connect()
    rows = await conn.fetch("SELECT * FROM articles;")
    await conn.close()
    return [dict(r) for r in rows]

@router.get("/{article_id}", response_model=Article)
async def get_article(article_id: int):
    conn = await connect()
    row = await conn.fetchrow("SELECT * FROM articles WHERE id=$1;", article_id)
    await conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Article not found")
    return dict(row)

@router.put("/{article_id}", response_model=Article)
async def update_article(article_id: int, data: ArticleCreate):
    conn = await connect()
    row = await conn.fetchrow("""
        UPDATE articles SET
            titre=$1, prix=$2, unite=$3, description=$4,
            categorie=$5, sous_categorie=$6, date_rappel=$7
        WHERE id=$8 RETURNING *;
    """, data.titre, data.prix, data.unite, data.description,
          data.categorie, data.sous_categorie, data.date_rappel, article_id)
    await conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Article not found")
    return dict(row)

@router.delete("/{article_id}")
async def delete_article(article_id: int):
    conn = await connect()
    await conn.execute("DELETE FROM articles WHERE id=$1;", article_id)
    await conn.close()
    return {"message": "Deleted"}

@router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename=filename)
    raise HTTPException(status_code=404, detail="File not found")
