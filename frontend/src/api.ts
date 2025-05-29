const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function getArticles() {
  const res = await fetch(`${BASE_URL}/articles`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function getArticle(id) {
  const res = await fetch(`${BASE_URL}/articles/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function createArticle(formData) {
  const res = await fetch(`${BASE_URL}/articles/`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.error('Create article error:', errorData);
    throw new Error(`HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`);
  }
  return res.json();
}

export async function updateArticle(id, article) {
  const res = await fetch(`${BASE_URL}/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(article)
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function deleteArticle(id) {
  const res = await fetch(`${BASE_URL}/articles/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function createCategory(nom) {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom })
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function updateCategory(id, nom) {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom })
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${BASE_URL}/categories/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function getSousCategories() {
  const res = await fetch(`${BASE_URL}/sous-categories`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function createSousCategorie(nom, categorie) {
  const res = await fetch(`${BASE_URL}/sous-categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, categorie })
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function updateSousCategorie(id, nom, categorie) {
  const res = await fetch(`${BASE_URL}/sous-categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, categorie })
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function deleteSousCategorie(id) {
  const res = await fetch(`${BASE_URL}/sous-categories/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}
