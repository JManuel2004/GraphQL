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
- `admin_email`, `admin_password`: Credenciales del administrador (por defecto: admin@example.com / Admin123!)
- `user1_email`, `user1_password`: Credenciales del usuario 1 (por defecto: usuario1@example.com / User123!)
- `user2_email`, `user2_password`: Credenciales del usuario 2 (por defecto: usuario2@example.com / User123!)
- `admin_token`, `user1_token`, `user2_token`: Tokens JWT (se guardan automáticamente después del login)
- `user1_id`, `user2_id`: IDs de usuarios (se guardan automáticamente)
- `project_id_user1`, `project_id_user2`, `project2_id_user1`: IDs de proyectos (se guardan automáticamente)
- `task_id_user1`: ID de tareas (se guarda automáticamente)

### Variables de Entorno (Opcional):
Puedes crear un entorno en Postman con estas variables:
- `base_url`: `http://localhost:3000`
- `jwt_token`: (se llena automáticamente)

## 📋 Orden Recomendado para Probar

### 0. Seed (Datos Iniciales)
1. **Initial data** - Ejecuta el seed para poblar la base de datos con usuarios, proyectos y tareas de prueba
   - ⚠️ **Importante**: Esto elimina todos los datos existentes y crea datos nuevos
   - Crea 4 usuarios (admin, usuario1, usuario2, usuario3)
   - Crea 4 proyectos y 8 tareas de ejemplo

### 1. Autenticación
2. **Register** - Registra usuarios de prueba (opcional si ya ejecutaste el seed)
3. **Login - Admin** - Inicia sesión como administrador
   - El token se guarda en `admin_token`
4. **Login - User1** - Inicia sesión como usuario 1
   - El token se guarda en `user1_token`
5. **Login - User2** - Inicia sesión como usuario 2
   - El token se guarda en `user2_token`

### 2. Usuarios (Solo Admin)
6. **List Users (admin)** - Lista todos los usuarios (solo superadmin)
   - Guarda automáticamente `user1_id` y `user2_id`
7. **Get User by Id (admin -> user1)** - Obtiene un usuario específico
8. **Update User (admin -> user2)** - Actualiza un usuario
9. **Delete User (admin -> user2)** - Elimina un usuario

### 3. Proyectos
10. **Create Project (user1)** - Crea un proyecto para user1
    - Guarda `project_id_user1`
11. **Create Project (user2)** - Crea un proyecto para user2
    - Guarda `project_id_user2`
12. **Create Project to delete (user1)** - Crea un proyecto adicional para pruebas
    - Guarda `project2_id_user1`
13. **Get All Projects (user1)** - Lista proyectos del usuario
14. **Get Project By ID (user1 -> own)** - Obtiene un proyecto propio
15. **Update Project (user1 -> own)** - Actualiza un proyecto propio
16. **Delete Project (user1 -> own)** - Elimina un proyecto propio

### 4. Tareas
17. **Create Task (user1 on project1)** - Crea una tarea en el proyecto de user1
    - Guarda `task_id_user1`
18. **Get All Tasks (user1)** - Lista todas las tareas del usuario
19. **Get Tasks By Project (user1)** - Lista tareas de un proyecto
20. **Get Task By ID (user1 -> own)** - Obtiene una tarea propia
21. **Update Task (user1 -> own)** - Actualiza una tarea propia
22. **Delete Task (user1 -> own)** - Elimina una tarea propia

### 5. Validaciones de Permisos (Forbidden cases)
23. **User2 DELETE Project of User1 → 403** - Intenta eliminar proyecto ajeno (debe fallar)
24. **User1 DELETE Project of User2 → 403** - Intenta eliminar proyecto ajeno (debe fallar)
25. **User2 DELETE Task of User1 → 403** - Intenta eliminar tarea ajena (debe fallar)
26. **User1 UPDATE Project of User2 → 403** - Intenta actualizar proyecto ajeno (debe fallar)
27. **User2 UPDATE Task of User1 → 403** - Intenta actualizar tarea ajena (debe fallar)
28. **User1 List Users → 403** - Usuario normal intenta listar usuarios (debe fallar)

### 6. Admin Overrides
29. **Admin DELETE Project of User1 → 200** - Admin puede eliminar proyecto de otro usuario
30. **Admin DELETE Task of User1 → 200** - Admin puede eliminar tarea de otro usuario

## 🔐 Autenticación y Permisos

### Autenticación
Todas las requests de **Projects**, **Tasks** y **Users** requieren autenticación. El token JWT se envía automáticamente en el header `Authorization: Bearer {{token}}`.

**Nota:** Asegúrate de ejecutar los **Login** correspondientes primero para obtener los tokens.

### Permisos

#### Usuarios Normales (USUARIO):
- ✅ Pueden crear, ver, actualizar y eliminar **sus propios** proyectos
- ✅ Pueden crear, ver, actualizar y eliminar **sus propias** tareas
- ❌ **NO pueden** eliminar proyectos/tareas de otros usuarios
- ❌ **NO pueden** listar, actualizar o eliminar usuarios (solo admin)

#### Administradores (SUPERADMIN):
- ✅ Pueden hacer **todo lo que los usuarios normales**
- ✅ Pueden eliminar proyectos/tareas de **cualquier usuario**
- ✅ Pueden listar, ver, actualizar y eliminar usuarios
- ✅ Pueden ver todos los proyectos y tareas del sistema

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

### List Users (Solo Admin)
```graphql
query GetAllUsers {
  users {
    id
    email
    fullname
    role
    isActive
  }
}
```

### Update User (Solo Admin)
```graphql
mutation UpdateUser {
  updateUser(
    id: "ID_DEL_USUARIO"
    updateUserInput: {
      fullname: "Nombre Actualizado"
      isActive: true
    }
  ) {
    id
    email
    fullname
    role
    isActive
  }
}
```

### Delete User (Solo Admin)
```graphql
mutation DeleteUser {
  deleteUser(id: "ID_DEL_USUARIO") {
    message
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

### Error: "Solo los administradores pueden realizar esta acción"
- Estás intentando acceder a una funcionalidad solo para administradores
- Usa el token de administrador (`admin_token`) en lugar del token de usuario normal

### Error: "No tienes permiso para eliminar este proyecto/tarea"
- Solo puedes eliminar tus propios proyectos/tareas
- Los administradores pueden eliminar cualquier proyecto/tarea

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

## 🧪 Casos de Prueba de Permisos

La colección incluye casos de prueba para validar el sistema de permisos:

### Casos de Éxito (200):
- ✅ Usuario puede eliminar su propio proyecto
- ✅ Usuario puede eliminar su propia tarea
- ✅ Admin puede eliminar proyecto de cualquier usuario
- ✅ Admin puede eliminar tarea de cualquier usuario
- ✅ Admin puede listar, actualizar y eliminar usuarios

### Casos de Error (403 - Forbidden):
- ❌ Usuario NO puede eliminar proyecto de otro usuario
- ❌ Usuario NO puede eliminar tarea de otro usuario
- ❌ Usuario NO puede actualizar proyecto de otro usuario
- ❌ Usuario NO puede actualizar tarea de otro usuario
- ❌ Usuario normal NO puede listar usuarios (solo admin)

**Nota:** En GraphQL, los errores siempre devuelven status 200, pero incluyen un objeto `errors` en la respuesta. Los tests verifican la presencia de errores de permisos.

## 📊 Estructura de la Colección

1. **Seed** - Ejecutar seed para poblar datos iniciales
2. **Auth** - Autenticación (Register, Login para Admin, User1, User2)
3. **Users (Admin Only)** - Gestión de usuarios (solo superadmin)
4. **Projects** - CRUD de proyectos
5. **Tasks** - CRUD de tareas
6. **Permissions (Forbidden cases)** - Casos de prueba de permisos denegados
7. **Admin Overrides** - Casos donde el admin puede hacer todo

