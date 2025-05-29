# 📋 Gestion Articles - Full Stack Application

A comprehensive article management system built with React/TypeScript frontend and FastAPI backend, featuring real-time data synchronization, advanced search capabilities, and user management.

## 🌟 Features

### 📱 Frontend Features
- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data synchronization across all users
- **Advanced Search**: Filter articles by categories, price range, tags, and more
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Export/Import**: Backup and restore your data easily
- **File Attachments**: Add documents and images to articles
- **Notifications**: Set reminders for important articles
- **User Management**: Role-based access control
- **Statistics Dashboard**: Visual insights into your inventory

### 🚀 Backend Features
- **RESTful API**: Clean and well-documented API endpoints
- **PostgreSQL Database**: Robust data storage with ACID compliance
- **CORS Support**: Cross-origin resource sharing enabled
- **Fast Performance**: Built with FastAPI for high-speed operations
- **Data Validation**: Automatic request/response validation
- **File Upload Support**: Handle multimedia attachments

### 🛠️ Core Functionality
- **Article Management**: Create, read, update, and delete articles
- **Category Organization**: Hierarchical category and subcategory system
- **Inventory Tracking**: Monitor stock levels and pricing
- **User Authentication**: Secure login and role management
- **Audit Trail**: Track all modifications with timestamps
- **Bulk Operations**: Perform actions on multiple articles simultaneously

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Recharts** - Data visualization

### Backend
- **FastAPI** - Modern Python web framework
- **asyncpg** - PostgreSQL async driver
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python Multipart** - File upload support

### Database
- **PostgreSQL** - Primary database
- **SQL.js** - Browser-based SQLite fallback

## 📦 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **bun** package manager

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd projec_sadok
```

2. **Set up Python virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL database**
```bash
# Create a new PostgreSQL database
createdb gestion_articles

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/gestion_articles"
```

5. **Start the backend server**
```bash
# Development mode
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or use the Makefile
make run
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
# Using npm
npm install

# Or using bun
bun install
```

3. **Set up environment variables**
```bash
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

4. **Start the development server**
```bash
# Using npm
npm run dev

# Using bun
bun dev

# Or use the Makefile
make dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/gestion_articles
```

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Database Schema

The application automatically creates the necessary tables:

- **articles**: Store product information
- **categories**: Main category classifications
- **sous_categories**: Subcategory classifications
- **users**: User account information (if implemented)

## 🚀 Usage

### Default Login
- **Username**: `admin`
- **Password**: `admin`

### Adding Articles
1. Click the "+" button in the dashboard
2. Fill in the required information:
   - Title (required)
   - Price (required)
   - Unit (required)
   - Category and Subcategory (required)
   - Description (optional)
   - Tags (optional)
   - Attachments (optional)

### Managing Categories
1. Click "Gestion des catégories" in the dashboard
2. Add new categories and subcategories
3. Edit or delete existing ones

### Search and Filter
- Use the search bar for quick text search
- Apply category filters for refined results
- Use advanced search for complex queries

## 📚 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

### Main Endpoints

#### Articles
- `GET /api/articles/` - List all articles
- `POST /api/articles/` - Create new article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article

#### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### Subcategories
- `GET /api/sous-categories/` - List all subcategories
- `POST /api/sous-categories/` - Create new subcategory
- `PUT /api/sous-categories/{id}` - Update subcategory
- `DELETE /api/sous-categories/{id}` - Delete subcategory

## ��️ Project Structure 