# Docker Setup Guide

This guide explains how to run the Acquisitions API using Docker in both development and production environments.

## 🏗️ Architecture Overview

### Development Environment
- **Neon Local**: PostgreSQL proxy for local development with ephemeral branches
- **Express.js App**: Your application container
- **Adminer**: Database management UI (optional)

### Production Environment
- **Neon Cloud**: Serverless PostgreSQL database
- **Express.js App**: Production-optimized container
- **NGINX**: Reverse proxy and SSL termination (optional)

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose v3.8+
- Git (for cloning the repository)

## 🚀 Quick Start

### Development Setup

1. **Clone and navigate to the repository**
   ```bash
   git clone <your-repo-url>
   cd acquisitions
   ```

2. **Start development environment**
   ```bash
   npm run docker:dev
   ```

   This command will:
   - Build your application Docker image
   - Start Neon Local PostgreSQL proxy
   - Start your Express.js application
   - Set up networking between services

3. **Access your services**
   - **API**: http://localhost:3000
   - **Health Check**: http://localhost:3000/health
   - **Database**: localhost:5432 (neondb/neondb)
   - **Adminer** (optional): http://localhost:8080

4. **Run database migrations**
   ```bash
   # Enter the app container
   docker exec -it acquisitions-app-dev sh
   
   # Run migrations
   npm run db:migrate
   ```

### Production Setup

1. **Configure production environment**
   ```bash
   cp .env.production .env.production.local
   # Edit .env.production.local with your actual Neon Cloud URL and secrets
   ```

2. **Deploy production stack**
   ```bash
   npm run docker:prod
   ```

## 🔧 Configuration

### Environment Files

#### `.env.development`
```env
NODE_ENV=development
DATABASE_URL=postgresql://neondb:neondb@neon-local:5432/neondb
JWT_SECRET=dev-jwt-secret-change-in-production
```

#### `.env.production`
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@ep-xxxx-xxxx.region.neon.tech/dbname?sslmode=require
JWT_SECRET=your-super-secure-jwt-secret-here
```

### Neon Database URLs

#### Development (Neon Local)
```
postgresql://neondb:neondb@neon-local:5432/neondb
```

#### Production (Neon Cloud)
```
postgresql://username:password@ep-xxxx-xxxx.region.neon.tech/dbname?sslmode=require
```

## 🛠️ Available Commands

### Development Commands
```bash
# Start development environment
npm run docker:dev

# Stop development environment
npm run docker:dev:down

# View application logs
npm run docker:dev:logs

# Start with database management UI
docker-compose -f docker-compose.dev.yml --profile tools up --build
```

### Production Commands
```bash
# Start production environment (detached)
npm run docker:prod

# Stop production environment
npm run docker:prod:down

# View application logs
npm run docker:prod:logs

# Start with NGINX reverse proxy
docker-compose -f docker-compose.prod.yml --profile nginx up --build -d
```

### Utility Commands
```bash
# Build application image only
npm run docker:build

# Clean up Docker resources
npm run docker:clean

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

## 🗄️ Database Management

### Development (Neon Local)

**Using Adminer UI:**
1. Start with tools profile: `docker-compose -f docker-compose.dev.yml --profile tools up`
2. Open http://localhost:8080
3. Use credentials: `neondb/neondb@neon-local/neondb`

**Using psql directly:**
```bash
# Connect from host
psql -h localhost -p 5432 -U neondb -d neondb

# Or from within app container
docker exec -it acquisitions-app-dev sh
psql -h neon-local -p 5432 -U neondb -d neondb
```

### Production (Neon Cloud)

Use your Neon Cloud dashboard or connect with the provided connection string.

## 🔒 Security Considerations

### Development
- Uses default credentials for convenience
- HTTP-only cookies for JWT tokens
- Basic security headers via Helmet

### Production
- **CRITICAL**: Change all default passwords and secrets
- Enable HTTPS with proper SSL certificates
- Use environment variables for all secrets
- Set appropriate CORS origins
- Consider rate limiting and additional security middleware

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000
   netstat -tulpn | grep :3000
   # Kill the process or change port in .env file
   ```

2. **Database connection failed**
   ```bash
   # Check if Neon Local is healthy
   docker logs neon-local
   
   # Restart the database service
   docker-compose -f docker-compose.dev.yml restart neon-local
   ```

3. **Container build fails**
   ```bash
   # Clean Docker cache and rebuild
   npm run docker:clean
   docker-compose -f docker-compose.dev.yml up --build --no-cache
   ```

4. **Migrations not applied**
   ```bash
   # Run migrations manually
   docker exec -it acquisitions-app-dev npm run db:migrate
   ```

### Health Checks

Both development and production compose files include health checks:

```bash
# Check container health
docker ps
# Look for "healthy" status in the STATUS column

# View health check logs
docker inspect --format='{{.State.Health}}' acquisitions-app-dev
```

### Logs and Debugging

```bash
# View all service logs
docker-compose -f docker-compose.dev.yml logs

# Follow specific service logs
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f neon-local

# Enter container for debugging
docker exec -it acquisitions-app-dev sh
```

## 🚀 Deployment

### Local Production Testing
```bash
# Test production build locally
npm run docker:prod
curl http://localhost:3000/health
```

### Cloud Deployment

1. **Configure secrets** in your cloud provider
2. **Set up Neon Cloud database** and get connection string
3. **Deploy using your preferred method**:
   - Docker Compose on VPS
   - Kubernetes manifests
   - Cloud container services (AWS ECS, Azure Container Instances, etc.)

### Environment Variables for Cloud Deployment
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=...
NODE_ENV=production
PORT=3000
```

## 📚 Additional Resources

- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Drizzle ORM Migration Guide](https://orm.drizzle.team/kit-docs/overview)

## 🤝 Contributing

When contributing:
1. Test changes in development environment first
2. Ensure all health checks pass
3. Update documentation if configuration changes
4. Test both development and production builds