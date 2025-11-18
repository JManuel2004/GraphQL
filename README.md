# Backend GraphQL

API GraphQL para gestión de usuarios, proyectos y tareas con autenticación JWT.

## Tecnologías

- NestJS + TypeScript
- GraphQL + Apollo Server
- PostgreSQL + TypeORM
- JWT Authentication

## Instalación

```bash
git clone https://github.com/JManuel2004/GraphQL.git
cd GraphQL/backend-graphql
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`
2. Configurar variables de base de datos
3. Iniciar PostgreSQL con Docker: `docker-compose up -d`

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Uso

- **GraphQL Playground**: `http://localhost:3000/graphql`
- **Seed de datos**: Ejecutar query `seed` para poblar BD
- **Login admin**: `admin@example.com` / `Admin123!`

## Documentación

Ver documentación completa en [`docs/`](docs/)

## Scripts

- `npm run start:dev` - Desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm run test` - Ejecutar tests
- `npm run lint` - Verificar código

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
