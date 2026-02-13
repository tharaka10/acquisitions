# Docker Quick Reference

## 🚀 Getting Started

```bash
# Development (Neon Local + App)
npm run docker:dev

# Production (App only, uses Neon Cloud)
npm run docker:prod
```

## 📊 Monitoring & Logs

```bash
# View logs
npm run docker:dev:logs        # Development
npm run docker:prod:logs       # Production

# Follow logs in real-time
docker-compose -f docker-compose.dev.yml logs -f

# Check container status
docker ps
```

## 🗄️ Database Operations

```bash
# Run migrations in development
docker exec -it acquisitions-app-dev npm run db:migrate

# Access database directly (development)
docker exec -it neon-local psql -U neondb -d neondb

# Start with Adminer (database UI)
docker-compose -f docker-compose.dev.yml --profile tools up --build
# Then visit: http://localhost:8080
```

## 🔧 Maintenance

```bash
# Stop services
npm run docker:dev:down
npm run docker:prod:down

# Rebuild everything
docker-compose -f docker-compose.dev.yml up --build --force-recreate

# Clean up Docker resources
npm run docker:clean

# Remove all containers and volumes (nuclear option)
docker-compose -f docker-compose.dev.yml down -v --rmi all
```

## 🐛 Debugging

```bash
# Enter app container
docker exec -it acquisitions-app-dev sh

# Check container health
docker inspect --format='{{.State.Health}}' acquisitions-app-dev

# View specific service logs
docker-compose -f docker-compose.dev.yml logs neon-local
docker-compose -f docker-compose.dev.yml logs app
```

## 🌐 URLs (Development)

- **API**: http://localhost:3000
- **Health**: http://localhost:3000/health
- **Database**: localhost:5432
- **Adminer**: http://localhost:8080 (with --profile tools)

## 🚀 Production with NGINX

```bash
# Start with reverse proxy
docker-compose -f docker-compose.prod.yml --profile nginx up --build -d

# Access via:
# - HTTP: http://localhost
# - HTTPS: https://localhost (if SSL configured)
```
