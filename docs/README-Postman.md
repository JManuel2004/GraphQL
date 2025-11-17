# Colección de Postman - GraphQL API

## 📥 Importar la Colección

1. Abre Postman
2. Haz clic en **Import** (arriba a la izquierda)
3. Selecciona el archivo `GraphQL-API.postman_collection.json`
4. La colección se importará con todas las requests configuradas

## 🔧 Configuración de Variables de Entorno

La colección usa variables para facilitar el uso:

### Variables de la Colección:
- `base_url`: `http://localhost:3000` (ya configurado)
- `jwt_token`: Se guarda automáticamente después del login
- `project_id`: Se guarda automáticamente después de crear un proyecto

### Variables de Entorno (Opcional):
Puedes crear un entorno en Postman con estas variables:
- `base_url`: `http://localhost:3000`
- `jwt_token`: (se llena automáticamente)

## 📋 Orden Recomendado para Probar

### 1. Autenticación
1. **Register** - Registra un nuevo usuario (opcional si ya tienes uno)
2. **Login** - Inicia sesión y obtén el token JWT
   - El token se guarda automáticamente en la variable `jwt_token`

### 2. Proyectos
3. **Create Project** - Crea un nuevo proyecto
   - El ID del proyecto se guarda automáticamente en `project_id`
4. **Get All Projects** - Lista todos tus proyectos
5. **Get Project By ID** - Obtiene un proyecto específico
6. **Update Project** - Actualiza un proyecto
7. **Delete Project** - Elimina un proyecto

## 🔐 Autenticación

Todas las requests de **Projects** requieren autenticación. El token JWT se envía automáticamente en el header `Authorization: Bearer {{jwt_token}}`.

**Nota:** Asegúrate de ejecutar **Login** primero para obtener el token.

## 📝 Ejemplos de Uso

### Login
```graphql
mutation Login {
  login(loginInput: {
    email: "test@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
      fullname
    }
  }
}
```

### Create Project
```graphql
mutation CreateProject {
  createProject(createProjectInput: {
    title: "Mi Proyecto"
    description: "Descripción"
    status: PENDING
  }) {
    id
    title
    status
  }
}
```

### Get All Projects
```graphql
query GetAllProjects {
  projects {
    id
    title
    description
    status
  }
}
```

## 🐛 Troubleshooting

### Error: "Unauthorized"
- Asegúrate de haber ejecutado **Login** primero
- Verifica que el token no haya expirado (ejecuta **Renew Token**)

### Error: "Project not found"
- Verifica que el `project_id` esté correcto
- Asegúrate de haber creado un proyecto primero

### Error: "Connection refused"
- Verifica que el servidor esté corriendo en `http://localhost:3000`
- Revisa que Docker Compose esté activo

## 📚 Estados de Proyecto

Los proyectos pueden tener los siguientes estados:
- `PENDING` - Pendiente
- `IN_PROGRESS` - En progreso
- `COMPLETED` - Completado

