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
- `task_id`: Se guarda automáticamente después de crear una tarea

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

### 3. Tareas
8. **Create Task** - Crea una nueva tarea
   - Requiere un `project_id` válido
   - El ID de la tarea se guarda automáticamente en `task_id`
9. **Get All Tasks** - Lista todas las tareas del usuario
10. **Get Tasks By Project** - Lista todas las tareas de un proyecto específico
11. **Get Task By ID** - Obtiene una tarea específica
12. **Update Task** - Actualiza una tarea
13. **Delete Task** - Elimina una tarea

## 🔐 Autenticación

Todas las requests de **Projects** y **Tasks** requieren autenticación. El token JWT se envía automáticamente en el header `Authorization: Bearer {{jwt_token}}`.

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

### Create Task
```graphql
mutation CreateTask {
  createTask(createTaskInput: {
    title: "Mi Tarea"
    description: "Descripción de la tarea"
    status: PENDING
    priority: MEDIUM
    projectId: "ID_DEL_PROYECTO"
  }) {
    id
    title
    status
    priority
  }
}
```

### Get All Tasks
```graphql
query GetAllTasks {
  tasks {
    id
    title
    description
    status
    priority
    project {
      id
      title
    }
  }
}
```

### Get Tasks By Project
```graphql
query GetTasksByProject {
  tasksByProject(projectId: "ID_DEL_PROYECTO") {
    id
    title
    status
    priority
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

### Error: "Task not found"
- Verifica que el `task_id` esté correcto
- Asegúrate de haber creado una tarea primero

### Error: "No tienes permiso para agregar tareas a este proyecto"
- Verifica que el proyecto pertenezca al usuario autenticado
- Solo puedes agregar tareas a tus propios proyectos (o ser superadmin)

### Error: "Connection refused"
- Verifica que el servidor esté corriendo en `http://localhost:3000`
- Revisa que Docker Compose esté activo

## 📚 Estados y Prioridades

### Estados de Proyecto
Los proyectos pueden tener los siguientes estados:
- `PENDING` - Pendiente
- `IN_PROGRESS` - En progreso
- `COMPLETED` - Completado

### Estados de Tarea
Las tareas pueden tener los siguientes estados:
- `PENDING` - Pendiente
- `IN_PROGRESS` - En progreso
- `COMPLETED` - Completada
- `CANCELLED` - Cancelada

### Prioridades de Tarea
Las tareas pueden tener las siguientes prioridades:
- `LOW` - Baja
- `MEDIUM` - Media (por defecto)
- `HIGH` - Alta

## 🔗 Relaciones

- **Proyecto → Tareas**: Un proyecto puede tener múltiples tareas
- **Tarea → Proyecto**: Cada tarea pertenece a un proyecto
- **Tarea → Usuario**: Una tarea puede estar asignada a un usuario (opcional)
- **Usuario → Proyectos**: Un usuario puede tener múltiples proyectos
- **Usuario → Tareas Asignadas**: Un usuario puede tener múltiples tareas asignadas

