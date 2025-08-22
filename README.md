# 🚌 Public Transport Management System

A comprehensive web application for managing and navigating public transportation routes, schedules, and user feedback. Built with Django backend and React frontend, featuring real-time route planning, interactive maps, and sentiment analysis for user feedback.

## ✨ Features

### 🗺️ Route Management

- **Smart Route Planning**: Find optimal routes between destinations using advanced algorithms
- **Interactive Maps**: Visual route representation with Leaflet.js integration
- **Route Search**: Search for specific routes and view detailed information
- **Stop Information**: Complete details about bus stops including coordinates

### 📅 Schedule Management

- **Real-time Schedules**: View and manage bus departure and arrival times
- **Trip Patterns**: Track different trip patterns for various routes
- **Stop Times**: Detailed timing information for each stop along routes

### 👥 User Management

- **User Authentication**: Secure login and registration system
- **User Dashboard**: Personalized experience for registered users
- **Profile Management**: User profile customization and preferences

### 💬 Feedback System

- **User Feedback**: Collect and manage user ratings and comments
- **Sentiment Analysis**: AI-powered sentiment analysis using NLTK and TextBlob
- **Rating System**: 5-star rating system for service quality

### 🚀 Advanced Features

- **Web Scraping**: Automated data collection from transportation sources
- **Geolocation Services**: Integration with OpenRouteService for route optimization
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

### Backend

- **Framework**: Django 5.2.4
- **API**: Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (default) / PostgreSQL (production ready)
- **Web Scraping**: BeautifulSoup4, Selenium
- **NLP**: NLTK, TextBlob for sentiment analysis
- **Geolocation**: Geopy, OpenRouteService
- **CORS**: django-cors-headers

### Frontend

- **Framework**: React 19.1.0
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Maps**: Leaflet.js with React-Leaflet
- **UI Components**: Shadcn UI, Lucide React Icons
- **Charts**: Recharts for data visualization

### Development Tools

- **Linting**: ESLint
- **Package Manager**: npm
- **Version Control**: Git

## 📁 Project Structure

```
public_transport/
├── backend/                 # Django backend application
│   ├── transport/          # Core transportation models and views
│   ├── feedback/           # User feedback and sentiment analysis
│   ├── home/               # User management and authentication
│   ├── froutes/            # Route finding functionality
│   ├── sroutes/            # Route search functionality
│   ├── schedules/          # Schedule management
│   └── manage.py           # Django management script
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── api/            # API integration
│   │   └── icons/          # Application icons
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── env/                    # Virtual environment
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- Git

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd public_transport
   ```

2. **Create and activate virtual environment**

   ```bash
   python -m venv env
   # On Windows
   env\Scripts\activate
   # On macOS/Linux
   source env/bin/activate
   ```

3. **Install Python dependencies**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Run database migrations**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (optional)**

   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install Node.js dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 API Endpoints

### Authentication

- `POST /api/login/` - User login
- `POST /api/register/` - User registration
- `POST /api/logout/` - User logout

### Routes

- `GET /api/routes/` - List all routes
- `GET /api/routes/{id}/` - Get specific route details
- `POST /api/findroute/` - Find optimal route between stops

### Schedules

- `GET /api/schedules/` - List all schedules
- `GET /api/schedules/{id}/` - Get specific schedule details

### Feedback

- `GET /api/feedback/` - List user feedback
- `POST /api/feedback/` - Submit new feedback
- `GET /api/feedback/sentiment/` - Get sentiment analysis

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
OPENROUTE_API_KEY=your-openroute-api-key
```

### Database Configuration

The project uses SQLite by default. For production, update `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 📱 Usage

1. **Landing Page**: Welcome screen with project overview
2. **Authentication**: Login or register to access full features
3. **Home Dashboard**: Main navigation hub
4. **Route Search**: Find and explore transportation routes
5. **Route Planning**: Plan optimal journeys between destinations
6. **Schedules**: View and manage transportation timetables
7. **Feedback**: Rate services and provide comments
8. **Interactive Maps**: Visual route representation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Web scraping functionality requires proper configuration of Selenium WebDriver
- OpenRouteService API key is required for advanced routing features
- Sentiment analysis models need to be downloaded on first use

## 🔮 Future Enhancements

- Real-time GPS tracking
- Push notifications for delays
- Multi-language support
- Advanced analytics dashboard
- Mobile app development
- Integration with multiple transport providers

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for better public transportation**
