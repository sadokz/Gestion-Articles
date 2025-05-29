import os
import asyncpg
from fastapi import FastAPI

DB_URL = os.getenv("DATABASE_URL")


async def connect():
    return await asyncpg.connect(DB_URL)


async def init_db():
    conn = await connect()
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            nom TEXT NOT NULL,
            description TEXT DEFAULT ''
        );
        CREATE TABLE IF NOT EXISTS sous_categories (
            id SERIAL PRIMARY KEY,
            nom TEXT NOT NULL,
            description TEXT DEFAULT '',
            categorie TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            titre TEXT,
            prix FLOAT,
            unite TEXT,
            description TEXT,
            categorie TEXT,
            sous_categorie TEXT,
            date_rappel TEXT,
            piece_jointe TEXT
        );
    """
    )

    # Add description columns if they don't exist (for existing databases)
    try:
        await conn.execute(
            "ALTER TABLE categories ADD COLUMN description TEXT DEFAULT ''"
        )
    except:
        pass  # Column already exists

    try:
        await conn.execute(
            "ALTER TABLE sous_categories ADD COLUMN description TEXT DEFAULT ''"
        )
    except:
        pass  # Column already exists

    # Insert sample categories if the table is empty
    existing_categories = await conn.fetch("SELECT COUNT(*) FROM categories")
    if existing_categories[0][0] == 0:
        await conn.execute(
            """
            INSERT INTO categories (nom, description) VALUES 
            ('Alimentaire', 'Produits alimentaires et boissons'),
            ('Électronique', 'Appareils et composants électroniques'),
            ('Vêtements', 'Vêtements et accessoires'),
            ('Maison', 'Articles pour la maison et décoration'),
            ('Sport', 'Articles de sport et loisirs'),
            ('Bureautique', 'Fournitures de bureau et papeterie')
        """
        )

        # Insert sample sous-categories
        await conn.execute(
            """
            INSERT INTO sous_categories (nom, description, categorie) VALUES 
            ('Fruits', 'Fruits frais', 'Alimentaire'),
            ('Légumes', 'Légumes frais', 'Alimentaire'),
            ('Boissons', 'Boissons diverses', 'Alimentaire'),
            ('Smartphones', 'Téléphones portables', 'Électronique'),
            ('Ordinateurs', 'PC et accessoires', 'Électronique'),
            ('Audio', 'Écouteurs, haut-parleurs', 'Électronique'),
            ('Hommes', 'Vêtements pour hommes', 'Vêtements'),
            ('Femmes', 'Vêtements pour femmes', 'Vêtements'),
            ('Enfants', 'Vêtements pour enfants', 'Vêtements'),
            ('Cuisine', 'Ustensiles et électroménager', 'Maison'),
            ('Décoration', 'Objets décoratifs', 'Maison'),
            ('Meubles', 'Mobilier de maison', 'Maison'),
            ('Fitness', 'Équipement de fitness', 'Sport'),
            ('Outdoor', 'Sports de plein air', 'Sport'),
            ('Ballons', 'Ballons et équipements de sport', 'Sport'),
            ('Papier', 'Papeterie et fournitures', 'Bureautique'),
            ('Stylos', 'Stylos et crayons', 'Bureautique'),
            ('Classement', 'Dossiers et classeurs', 'Bureautique')
        """
        )

    await conn.close()
