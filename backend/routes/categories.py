from fastapi import APIRouter, HTTPException
from typing import List, Optional
from database import connect
from models import Categorie

router = APIRouter()


@router.get("/", response_model=List[Categorie])
async def list_categories():
    conn = await connect()
    rows = await conn.fetch("SELECT * FROM categories;")
    await conn.close()
    return [dict(r) for r in rows]


@router.post("/", response_model=Categorie)
async def create_category(nom: str, description: Optional[str] = ""):
    conn = await connect()
    row = await conn.fetchrow(
        "INSERT INTO categories (nom, description) VALUES ($1, $2) RETURNING *;",
        nom,
        description,
    )
    await conn.close()
    return dict(row)


@router.put("/{categorie_id}", response_model=Categorie)
async def update_category(categorie_id: int, nom: str, description: Optional[str] = ""):
    conn = await connect()
    row = await conn.fetchrow(
        "UPDATE categories SET nom=$1, description=$2 WHERE id=$3 RETURNING *;",
        nom,
        description,
        categorie_id,
    )
    await conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Category not found")
    return dict(row)


@router.delete("/{categorie_id}")
async def delete_category(categorie_id: int):
    conn = await connect()
    await conn.execute("DELETE FROM categories WHERE id=$1;", categorie_id)
    await conn.close()
    return {"message": "Deleted"}
