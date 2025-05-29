from pydantic import BaseModel
from typing import Optional


class ArticleBase(BaseModel):
    titre: str
    prix: float
    unite: str
    description: Optional[str] = ""
    categorie: str
    sous_categorie: str
    date_rappel: Optional[str] = ""
    piece_jointe: Optional[str] = None


class ArticleCreate(ArticleBase):
    pass


class Article(ArticleBase):
    id: int


class Categorie(BaseModel):
    id: int
    nom: str
    description: Optional[str] = ""


class SousCategorie(BaseModel):
    id: int
    nom: str
    description: Optional[str] = ""
    categorie: str
