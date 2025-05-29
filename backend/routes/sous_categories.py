from fastapi import APIRouter, HTTPException
from typing import List
from database import connect
from models import SousCategorie

router = APIRouter()

@router.get("/", response_model=List[SousCategorie])
async def list_sous_categories():
    conn = await connect()
    rows = await conn.fetch("SELECT * FROM sous_categories;")
    await conn.close()
    return [dict(r) for r in rows]

@router.post("/", response_model=SousCategorie)
async def create_sous_category(nom: str, categorie: str):
    conn = await connect()
    row = await conn.fetchrow("INSERT INTO sous_categories (nom, categorie) VALUES ($1, $2) RETURNING *;", nom, categorie)
    await conn.close()
    return dict(row)

@router.put("/{sc_id}", response_model=SousCategorie)
async def update_sous_category(sc_id: int, nom: str, categorie: str):
    conn = await connect()
    row = await conn.fetchrow("UPDATE sous_categories SET nom=$1, categorie=$2 WHERE id=$3 RETURNING *;", nom, categorie, sc_id)
    await conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Sous-catégorie not found")
    return dict(row)

@router.delete("/{sc_id}")
async def delete_sous_category(sc_id: int):
    conn = await connect()
    await conn.execute("DELETE FROM sous_categories WHERE id=$1;", sc_id)
    await conn.close()
    return {"message": "Deleted"}
