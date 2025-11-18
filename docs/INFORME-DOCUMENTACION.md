# Documentación Completa - API GraphQL

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Ejecución del Proyecto](#ejecución-del-proyecto)
5. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Autenticación](#autenticación)
8. [Endpoints - Queries](#endpoints---queries)
9. [Endpoints - Mutations](#endpoints---mutations)
10. [Tipos de Datos](#tipos-de-datos)
11. [Inputs y Validaciones](#inputs-y-validaciones)
12. [Sistema de Permisos](#sistema-de-permisos)
13. [Manejo de Errores](#manejo-de-errores)
14. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Introducción

Este proyecto es una API GraphQL desarrollada con NestJS que gestiona usuarios, proyectos y tareas. La API implementa un sistema de autenticación basado en JWT y un sistema de permisos que diferencia entre usuarios normales y administradores.

### Tecnologías Utilizadas

- NestJS: Framework de Node.js para aplicaciones del lado del servidor
- GraphQL: Lenguaje de consulta para APIs
- TypeORM: ORM para TypeScript/JavaScript
- PostgreSQL: Base de datos relacional
- JWT: Autenticación mediante tokens
- Bcrypt: Cifrado de contraseñas
- class-validator: Validación de datos

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js (versión 18 o superior)
- npm o yarn
- Docker y Docker Compose (para la base de datos)
- PostgreSQL 15 (si no usas Docker)

---

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Proyecto-graphql/GraphQL
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos con Docker

El proyecto incluye un archivo `docker-compose.yml` para facilitar la configuración de la base de datos:

```bash
docker-compose up -d
```

Esto iniciará un contenedor de PostgreSQL en el puerto 5434.

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=password123
DB_NAME=graphql_auth_db

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=tu-secret-key-super-segura-aqui-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10
```

---

## Ejecución del Proyecto

### Modo Desarrollo

```bash
npm run start:dev
```

El servidor se ejecutará en `http://localhost:3000` y el GraphQL Playground estará disponible en `http://localhost:3000/graphql`.

### Modo Producción

```bash
npm run build
npm run start:prod
```

### Otros Comandos Disponibles

```bash
# Compilar el proyecto
npm run build

# Ejecutar tests
npm run test

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests end-to-end
npm run test:e2e

# Linting
npm run lint

# Formatear código
npm run format
```

---

## Configuración de Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Valor por Defecto | Ejemplo |
|----------|-------------|-------------------|---------|
| DB_HOST | Host de la base de datos | localhost | localhost |
| DB_PORT | Puerto de la base de datos | 5434 | 5434 |
| DB_USER | Usuario de la base de datos | postgres | postgres |
| DB_PASSWORD | Contraseña de la base de datos | - | password123 |
| DB_NAME | Nombre de la base de datos | graphql_auth_db | graphql_auth_db |
| PORT | Puerto del servidor | 3000 | 3000 |
| JWT_SECRET | Clave secreta para JWT | - | tu-secret-key |
| JWT_EXPIRES_IN | Tiempo de expiración del token | 24h | 24h |
| BCRYPT_SALT_ROUNDS | Rondas de cifrado para bcrypt | 10 | 10 |

---

## Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── dto/                 # Data Transfer Objects
│   │   └── auth.inputs.ts   # Inputs para register y login
│   ├── guards/              # Guards de autenticación
│   │   └── gql-auth.guard.ts
│   ├── resolvers/           # Resolvers de GraphQL
│   │   └── auth.resolver.ts
│   ├── strategies/          # Estrategias de Passport
│   │   └── jwt.strategy.ts
│   ├── types/               # Tipos de respuesta
│   │   └── auth-response.type.ts
│   └── auth.module.ts
├── users/                   # Módulo de usuarios
│   ├── dto/
│   │   └── user.inputs.ts   # Inputs para actualizar usuarios
│   ├── entities/
│   │   └── user.entity.ts   # Entidad User
│   ├── guards/
│   │   └── superadmin.guard.ts  # Guard para superadmin
│   ├── resolvers/
│   │   └── users.resolver.ts
│   ├── services/
│   │   └── users.service.ts
│   └── users.module.ts
├── projects/                # Módulo de proyectos
│   ├── dto/
│   │   └── project.inputs.ts
│   ├── entities/
│   │   └── project.entity.ts
│   ├── resolvers/
│   │   └── projects.resolver.ts
│   ├── services/
│   │   └── projects.service.ts
│   └── projects.module.ts
├── tasks/                   # Módulo de tareas
│   ├── dto/
│   │   └── task.inputs.ts
│   ├── entities/
│   │   └── task.entity.ts
│   ├── resolvers/
│   │   └── tasks.resolver.ts
│   ├── services/
│   │   └── tasks.service.ts
│   └── tasks.module.ts
├── seed/                    # Módulo de seed
│   ├── seed.service.ts
│   ├── seed.resolver.ts
│   └── seed.module.ts
├── app.module.ts            # Módulo raíz
├── main.ts                  # Punto de entrada
└── schema.gql               # Schema generado automáticamente
```

---

## Autenticación

La API utiliza autenticación basada en JWT (JSON Web Tokens). Todas las operaciones, excepto `register`, `login` y `seed`, requieren un token de autenticación válido.

### Obtener Token

Para obtener un token, se debe realizar una mutación de login:

```graphql
mutation Login {
  login(loginInput: {
    email: "admin@example.com"
    password: "Admin123!"
  }) {
    token
    user {
      id
      email
      fullname
      role
    }
  }
}
```

### Usar el Token

El token debe enviarse en el header `Authorization` de todas las requests:

```
Authorization: Bearer <token>
```

### Renovar Token

Para renovar un token existente:

```graphql
query RenewToken {
  renewToken {
    token
    user {
      id
      email
    }
  }
}
```

---

## Endpoints - Queries

Las queries son operaciones de lectura en GraphQL. Todas las queries, excepto `seed`, requieren autenticación.

### Autenticación

#### me

Obtiene la información del usuario autenticado.

**Autenticación:** Requerida

**Respuesta:**
```graphql
type User {
  id: ID!
  email: String!
  fullname: String!
  role: UserRole!
  isActive: Boolean!
  projects: [Project!]
  assignedTasks: [Task!]
}
```

**Ejemplo:**
```graphql
query Me {
  me {
    id
    email
    fullname
    role
    isActive
  }
}
```

#### renewToken

Renueva el token JWT del usuario autenticado.

**Autenticación:** Requerida

**Respuesta:**
```graphql
type AuthResponse {
  token: String!
  user: User!
}
```

**Ejemplo:**
```graphql
query RenewToken {
  renewToken {
    token
    user {
      id
      email
    }
  }
}
```

### Usuarios

#### users

Obtiene todos los usuarios del sistema.

**Autenticación:** Requerida (solo superadmin)

**Permisos:** Solo usuarios con rol `SUPERADMIN`

**Respuesta:**
```graphql
[User!]!
```

**Ejemplo:**
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

#### user

Obtiene un usuario específico por su ID.

**Autenticación:** Requerida (solo superadmin)

**Permisos:** Solo usuarios con rol `SUPERADMIN`

**Argumentos:**
- `id: ID!` - ID del usuario a obtener

**Respuesta:**
```graphql
User!
```

**Ejemplo:**
```graphql
query GetUser {
  user(id: "user-id-here") {
    id
    email
    fullname
    role
    isActive
  }
}
```

### Proyectos

#### projects

Obtiene todos los proyectos del usuario autenticado. Los administradores pueden ver todos los proyectos.

**Autenticación:** Requerida

**Respuesta:**
```graphql
[Project!]!
```

**Ejemplo:**
```graphql
query GetAllProjects {
  projects {
    id
    title
    description
    status
    createdAt
    updatedAt
    user {
      id
      email
      fullname
    }
  }
}
```

#### project

Obtiene un proyecto específico por su ID.

**Autenticación:** Requerida

**Permisos:** Solo puede ver proyectos propios o ser superadmin

**Argumentos:**
- `id: ID!` - ID del proyecto a obtener

**Respuesta:**
```graphql
Project!
```

**Ejemplo:**
```graphql
query GetProject {
  project(id: "project-id-here") {
    id
    title
    description
    status
    createdAt
    updatedAt
    user {
      id
      email
      fullname
    }
    tasks {
      id
      title
      status
    }
  }
}
```

### Tareas

#### tasks

Obtiene todas las tareas del usuario autenticado. Incluye tareas de todos los proyectos del usuario. Los administradores pueden ver todas las tareas.

**Autenticación:** Requerida

**Respuesta:**
```graphql
[Task!]!
```

**Ejemplo:**
```graphql
query GetAllTasks {
  tasks {
    id
    title
    description
    status
    priority
    dueDate
    createdAt
    project {
      id
      title
    }
    assignedTo {
      id
      email
      fullname
    }
  }
}
```

#### task

Obtiene una tarea específica por su ID.

**Autenticación:** Requerida

**Permisos:** Solo puede ver tareas de proyectos propios o ser superadmin

**Argumentos:**
- `id: ID!` - ID de la tarea a obtener

**Respuesta:**
```graphql
Task!
```

**Ejemplo:**
```graphql
query GetTask {
  task(id: "task-id-here") {
    id
    title
    description
    status
    priority
    dueDate
    createdAt
    updatedAt
    project {
      id
      title
      description
    }
    assignedTo {
      id
      email
      fullname
    }
  }
}
```

#### tasksByProject

Obtiene todas las tareas de un proyecto específico.

**Autenticación:** Requerida

**Permisos:** Solo puede ver tareas de proyectos propios o ser superadmin

**Argumentos:**
- `projectId: ID!` - ID del proyecto

**Respuesta:**
```graphql
[Task!]!
```

**Ejemplo:**
```graphql
query GetTasksByProject {
  tasksByProject(projectId: "project-id-here") {
    id
    title
    description
    status
    priority
    dueDate
    assignedTo {
      id
      email
      fullname
    }
  }
}
```

### Seed

#### seed

Ejecuta el seed para poblar la base de datos con datos iniciales. Elimina todos los datos existentes y crea nuevos usuarios, proyectos y tareas de prueba.

**Autenticación:** No requerida

**Respuesta:**
```graphql
type SeedResponse {
  message: String!
  data: SeedData!
}

type SeedData {
  users: Float!
  projects: Float!
  tasks: Float!
}
```

**Ejemplo:**
```graphql
query Seed {
  seed {
    message
    data {
      users
      projects
      tasks
    }
  }
}
```

**Datos Creados:**
- 4 usuarios (1 admin, 3 usuarios normales)
- 4 proyectos
- 8 tareas

---

## Endpoints - Mutations

Las mutations son operaciones de escritura en GraphQL. Todas las mutations, excepto `register` y `login`, requieren autenticación.

### Autenticación

#### register

Registra un nuevo usuario en el sistema.

**Autenticación:** No requerida

**Argumentos:**
```graphql
registerInput: RegisterInput!
```

**Input:**
```graphql
input RegisterInput {
  email: String!
  password: String!
  fullname: String!
  role: UserRole  # Opcional, por defecto USUARIO
}
```

**Respuesta:**
```graphql
User!
```

**Ejemplo:**
```graphql
mutation Register {
  register(registerInput: {
    email: "nuevo@example.com"
    password: "password123"
    fullname: "Usuario Nuevo"
    role: USUARIO
  }) {
    id
    email
    fullname
    role
    isActive
  }
}
```

#### login

Inicia sesión y obtiene un token JWT.

**Autenticación:** No requerida

**Argumentos:**
```graphql
loginInput: LoginInput!
```

**Input:**
```graphql
input LoginInput {
  email: String!
  password: String!
}
```

**Respuesta:**
```graphql
type AuthResponse {
  token: String!
  user: User!
}
```

**Ejemplo:**
```graphql
mutation Login {
  login(loginInput: {
    email: "admin@example.com"
    password: "Admin123!"
  }) {
    token
    user {
      id
      email
      fullname
      role
    }
  }
}
```

#### logout

Cierra sesión (operación del lado del cliente).

**Autenticación:** Requerida

**Respuesta:**
```graphql
type MessageResponse {
  message: String!
}
```

**Ejemplo:**
```graphql
mutation Logout {
  logout {
    message
  }
}
```

### Usuarios

#### updateUser

Actualiza un usuario existente.

**Autenticación:** Requerida (solo superadmin)

**Permisos:** Solo usuarios con rol `SUPERADMIN`

**Argumentos:**
- `id: ID!` - ID del usuario a actualizar
- `updateUserInput: UpdateUserInput!` - Datos a actualizar

**Input:**
```graphql
input UpdateUserInput {
  email: String
  password: String
  fullname: String
  role: UserRole
  isActive: Boolean
}
```

**Respuesta:**
```graphql
User!
```

**Ejemplo:**
```graphql
mutation UpdateUser {
  updateUser(
    id: "user-id-here"
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

#### deleteUser

Elimina un usuario (soft delete).

**Autenticación:** Requerida (solo superadmin)

**Permisos:** Solo usuarios con rol `SUPERADMIN`

**Argumentos:**
- `id: ID!` - ID del usuario a eliminar

**Respuesta:**
```graphql
type DeleteUserResponse {
  message: String!
}
```

**Ejemplo:**
```graphql
mutation DeleteUser {
  deleteUser(id: "user-id-here") {
    message
  }
}
```

### Proyectos

#### createProject

Crea un nuevo proyecto.

**Autenticación:** Requerida

**Argumentos:**
```graphql
createProjectInput: CreateProjectInput!
```

**Input:**
```graphql
input CreateProjectInput {
  title: String!
  description: String
  status: ProjectStatus  # Opcional, por defecto PENDING
}
```

**Respuesta:**
```graphql
Project!
```

**Ejemplo:**
```graphql
mutation CreateProject {
  createProject(createProjectInput: {
    title: "Mi Nuevo Proyecto"
    description: "Descripción del proyecto"
    status: PENDING
  }) {
    id
    title
    description
    status
    createdAt
    user {
      id
      email
    }
  }
}
```

#### updateProject

Actualiza un proyecto existente.

**Autenticación:** Requerida

**Permisos:** Solo puede actualizar proyectos propios o ser superadmin

**Argumentos:**
- `id: ID!` - ID del proyecto a actualizar
- `updateProjectInput: UpdateProjectInput!` - Datos a actualizar

**Input:**
```graphql
input UpdateProjectInput {
  title: String
  description: String
  status: ProjectStatus
}
```

**Respuesta:**
```graphql
Project!
```

**Ejemplo:**
```graphql
mutation UpdateProject {
  updateProject(
    id: "project-id-here"
    updateProjectInput: {
      title: "Título Actualizado"
      status: IN_PROGRESS
    }
  ) {
    id
    title
    description
    status
    updatedAt
  }
}
```

#### deleteProject

Elimina un proyecto.

**Autenticación:** Requerida

**Permisos:** Solo puede eliminar proyectos propios o ser superadmin

**Argumentos:**
- `id: ID!` - ID del proyecto a eliminar

**Respuesta:**
```graphql
type DeleteProjectResponse {
  message: String!
}
```

**Ejemplo:**
```graphql
mutation DeleteProject {
  deleteProject(id: "project-id-here") {
    message
  }
}
```

### Tareas

#### createTask

Crea una nueva tarea.

**Autenticación:** Requerida

**Permisos:** Solo puede crear tareas en proyectos propios o ser superadmin

**Argumentos:**
```graphql
createTaskInput: CreateTaskInput!
```

**Input:**
```graphql
input CreateTaskInput {
  title: String!
  description: String
  status: TaskStatus  # Opcional, por defecto PENDING
  priority: TaskPriority  # Opcional, por defecto MEDIUM
  dueDate: String  # Formato ISO 8601
  projectId: String!  # Requerido
  assignedToId: String  # Opcional
}
```

**Respuesta:**
```graphql
Task!
```

**Ejemplo:**
```graphql
mutation CreateTask {
  createTask(createTaskInput: {
    title: "Nueva Tarea"
    description: "Descripción de la tarea"
    status: PENDING
    priority: MEDIUM
    projectId: "project-id-here"
    assignedToId: "user-id-here"
  }) {
    id
    title
    description
    status
    priority
    project {
      id
      title
    }
    assignedTo {
      id
      email
    }
  }
}
```

#### updateTask

Actualiza una tarea existente.

**Autenticación:** Requerida

**Permisos:** Solo puede actualizar tareas de proyectos propios o ser superadmin

**Argumentos:**
- `id: ID!` - ID de la tarea a actualizar
- `updateTaskInput: UpdateTaskInput!` - Datos a actualizar

**Input:**
```graphql
input UpdateTaskInput {
  title: String
  description: String
  status: TaskStatus
  priority: TaskPriority
  dueDate: String
  assignedToId: String
}
```

**Respuesta:**
```graphql
Task!
```

**Ejemplo:**
```graphql
mutation UpdateTask {
  updateTask(
    id: "task-id-here"
    updateTaskInput: {
      title: "Título Actualizado"
      status: IN_PROGRESS
      priority: HIGH
    }
  ) {
    id
    title
    status
    priority
    updatedAt
  }
}
```

#### deleteTask

Elimina una tarea.

**Autenticación:** Requerida

**Permisos:** Solo puede eliminar tareas de proyectos propios o ser superadmin

**Argumentos:**
- `id: ID!` - ID de la tarea a eliminar

**Respuesta:**
```graphql
type DeleteTaskResponse {
  message: String!
}
```

**Ejemplo:**
```graphql
mutation DeleteTask {
  deleteTask(id: "task-id-here") {
    message
  }
}
```

---

## Tipos de Datos

### User

Representa un usuario del sistema.

```graphql
type User {
  id: ID!
  email: String!
  fullname: String!
  role: UserRole!
  isActive: Boolean!
  projects: [Project!]
  assignedTasks: [Task!]
}
```

**Campos:**
- `id`: Identificador único del usuario (UUID)
- `email`: Correo electrónico del usuario (único)
- `fullname`: Nombre completo del usuario
- `role`: Rol del usuario (SUPERADMIN o USUARIO)
- `isActive`: Indica si el usuario está activo
- `projects`: Lista de proyectos del usuario
- `assignedTasks`: Lista de tareas asignadas al usuario

### Project

Representa un proyecto.

```graphql
type Project {
  id: ID!
  title: String!
  description: String
  status: ProjectStatus!
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User
  tasks: [Task!]
}
```

**Campos:**
- `id`: Identificador único del proyecto (UUID)
- `title`: Título del proyecto
- `description`: Descripción del proyecto (opcional)
- `status`: Estado del proyecto (PENDING, IN_PROGRESS, COMPLETED)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización
- `user`: Usuario propietario del proyecto
- `tasks`: Lista de tareas del proyecto

### Task

Representa una tarea.

```graphql
type Task {
  id: ID!
  title: String!
  description: String
  status: TaskStatus!
  priority: TaskPriority!
  dueDate: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  project: Project
  assignedTo: User
}
```

**Campos:**
- `id`: Identificador único de la tarea (UUID)
- `title`: Título de la tarea
- `description`: Descripción de la tarea (opcional)
- `status`: Estado de la tarea (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority`: Prioridad de la tarea (LOW, MEDIUM, HIGH)
- `dueDate`: Fecha límite de la tarea (opcional)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización
- `project`: Proyecto al que pertenece la tarea
- `assignedTo`: Usuario asignado a la tarea (opcional)

### Enums

#### UserRole

Roles disponibles para usuarios.

```graphql
enum UserRole {
  SUPERADMIN
  USUARIO
}
```

#### ProjectStatus

Estados disponibles para proyectos.

```graphql
enum ProjectStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

#### TaskStatus

Estados disponibles para tareas.

```graphql
enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

#### TaskPriority

Prioridades disponibles para tareas.

```graphql
enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}
```

### Tipos de Respuesta

#### AuthResponse

Respuesta de autenticación.

```graphql
type AuthResponse {
  token: String!
  user: User!
}
```

#### MessageResponse

Respuesta con mensaje.

```graphql
type MessageResponse {
  message: String!
}
```

#### DeleteProjectResponse

Respuesta al eliminar un proyecto.

```graphql
type DeleteProjectResponse {
  message: String!
}
```

#### DeleteTaskResponse

Respuesta al eliminar una tarea.

```graphql
type DeleteTaskResponse {
  message: String!
}
```

#### DeleteUserResponse

Respuesta al eliminar un usuario.

```graphql
type DeleteUserResponse {
  message: String!
}
```

#### SeedResponse

Respuesta del seed.

```graphql
type SeedResponse {
  message: String!
  data: SeedData!
}

type SeedData {
  users: Float!
  projects: Float!
  tasks: Float!
}
```

---

## Inputs y Validaciones

### RegisterInput

Input para registrar un nuevo usuario.

```graphql
input RegisterInput {
  email: String!
  password: String!
  fullname: String!
  role: UserRole
}
```

**Validaciones:**
- `email`: Debe ser un email válido
- `password`: Mínimo 6 caracteres
- `fullname`: Requerido
- `role`: Opcional, debe ser SUPERADMIN o USUARIO

### LoginInput

Input para iniciar sesión.

```graphql
input LoginInput {
  email: String!
  password: String!
}
```

**Validaciones:**
- `email`: Debe ser un email válido
- `password`: Mínimo 6 caracteres

### CreateProjectInput

Input para crear un proyecto.

```graphql
input CreateProjectInput {
  title: String!
  description: String
  status: ProjectStatus
}
```

**Validaciones:**
- `title`: Requerido, debe ser un string
- `description`: Opcional, debe ser un string
- `status`: Opcional, debe ser PENDING, IN_PROGRESS o COMPLETED

### UpdateProjectInput

Input para actualizar un proyecto.

```graphql
input UpdateProjectInput {
  title: String
  description: String
  status: ProjectStatus
}
```

**Validaciones:**
- Todos los campos son opcionales
- `title`: Si se proporciona, debe ser un string
- `description`: Si se proporciona, debe ser un string
- `status`: Si se proporciona, debe ser PENDING, IN_PROGRESS o COMPLETED

### CreateTaskInput

Input para crear una tarea.

```graphql
input CreateTaskInput {
  title: String!
  description: String
  status: TaskStatus
  priority: TaskPriority
  dueDate: String
  projectId: String!
  assignedToId: String
}
```

**Validaciones:**
- `title`: Requerido, debe ser un string
- `description`: Opcional, debe ser un string
- `status`: Opcional, debe ser PENDING, IN_PROGRESS, COMPLETED o CANCELLED
- `priority`: Opcional, debe ser LOW, MEDIUM o HIGH
- `dueDate`: Opcional, debe ser una fecha válida en formato ISO 8601
- `projectId`: Requerido, debe ser un UUID válido
- `assignedToId`: Opcional, debe ser un UUID válido

### UpdateTaskInput

Input para actualizar una tarea.

```graphql
input UpdateTaskInput {
  title: String
  description: String
  status: TaskStatus
  priority: TaskPriority
  dueDate: String
  assignedToId: String
}
```

**Validaciones:**
- Todos los campos son opcionales
- `title`: Si se proporciona, debe ser un string
- `description`: Si se proporciona, debe ser un string
- `status`: Si se proporciona, debe ser PENDING, IN_PROGRESS, COMPLETED o CANCELLED
- `priority`: Si se proporciona, debe ser LOW, MEDIUM o HIGH
- `dueDate`: Si se proporciona, debe ser una fecha válida en formato ISO 8601
- `assignedToId`: Si se proporciona, debe ser un UUID válido

### UpdateUserInput

Input para actualizar un usuario.

```graphql
input UpdateUserInput {
  email: String
  password: String
  fullname: String
  role: UserRole
  isActive: Boolean
}
```

**Validaciones:**
- Todos los campos son opcionales
- `email`: Si se proporciona, debe ser un email válido
- `password`: Si se proporciona, mínimo 6 caracteres
- `fullname`: Si se proporciona, debe ser un string
- `role`: Si se proporciona, debe ser SUPERADMIN o USUARIO
- `isActive`: Si se proporciona, debe ser un booleano

---

## Sistema de Permisos

El sistema implementa un control de acceso basado en roles y propiedad de recursos.

### Roles

#### SUPERADMIN

Los usuarios con rol `SUPERADMIN` tienen acceso completo al sistema:

- Pueden ver, crear, actualizar y eliminar cualquier proyecto
- Pueden ver, crear, actualizar y eliminar cualquier tarea
- Pueden listar, ver, actualizar y eliminar usuarios
- Pueden ver todos los proyectos y tareas del sistema

#### USUARIO

Los usuarios con rol `USUARIO` tienen acceso limitado:

- Pueden ver, crear, actualizar y eliminar solo sus propios proyectos
- Pueden ver, crear, actualizar y eliminar solo tareas de sus propios proyectos
- No pueden acceder a operaciones de usuarios (solo administradores)

### Validaciones de Permisos

#### Proyectos

- **Crear**: Cualquier usuario autenticado puede crear proyectos (se asignan automáticamente al usuario)
- **Ver**: Solo puede ver proyectos propios o ser superadmin
- **Actualizar**: Solo puede actualizar proyectos propios o ser superadmin
- **Eliminar**: Solo puede eliminar proyectos propios o ser superadmin

#### Tareas

- **Crear**: Solo puede crear tareas en proyectos propios o ser superadmin
- **Ver**: Solo puede ver tareas de proyectos propios o ser superadmin
- **Actualizar**: Solo puede actualizar tareas de proyectos propios o ser superadmin
- **Eliminar**: Solo puede eliminar tareas de proyectos propios o ser superadmin

#### Usuarios

- **Listar**: Solo superadmin
- **Ver**: Solo superadmin
- **Actualizar**: Solo superadmin
- **Eliminar**: Solo superadmin

### Errores de Permisos

Cuando un usuario intenta realizar una operación para la cual no tiene permisos, se devuelve un error:

```json
{
  "errors": [
    {
      "message": "No tienes permiso para eliminar este proyecto",
      "statusCode": "FORBIDDEN",
      "timestamp": "2025-11-18T01:32:08.262Z"
    }
  ]
}
```

---

## Manejo de Errores

La API utiliza un formato estándar para los errores en GraphQL. Todos los errores devuelven un status HTTP 200, pero incluyen un objeto `errors` en la respuesta.

### Formato de Error

```json
{
  "errors": [
    {
      "message": "Mensaje de error descriptivo",
      "statusCode": "CÓDIGO_DE_ERROR",
      "timestamp": "2025-11-18T01:32:08.262Z"
    }
  ]
}
```

### Tipos de Errores

#### NotFoundException

Se lanza cuando un recurso no se encuentra.

**Código:** `NOT_FOUND`

**Ejemplo:**
```json
{
  "errors": [
    {
      "message": "Proyecto con ID abc-123 no encontrado",
      "statusCode": "NOT_FOUND",
      "timestamp": "2025-11-18T01:32:08.262Z"
    }
  ]
}
```

#### ForbiddenException

Se lanza cuando un usuario no tiene permisos para realizar una operación.

**Código:** `FORBIDDEN`

**Ejemplo:**
```json
{
  "errors": [
    {
      "message": "No tienes permiso para eliminar este proyecto",
      "statusCode": "FORBIDDEN",
      "timestamp": "2025-11-18T01:32:08.262Z"
    }
  ]
}
```

#### UnauthorizedException

Se lanza cuando un usuario no está autenticado o el token es inválido.

**Código:** `UNAUTHORIZED`

**Ejemplo:**
```json
{
  "errors": [
    {
      "message": "Usuario no autenticado",
      "statusCode": "UNAUTHORIZED",
      "timestamp": "2025-11-18T01:32:08.262Z"
    }
  ]
}
```

#### Validation Error

Se lanza cuando los datos enviados no pasan las validaciones.

**Código:** `BAD_USER_INPUT`

**Ejemplo:**
```json
{
  "errors": [
    {
      "message": "El título es requerido",
      "statusCode": "BAD_USER_INPUT",
      "timestamp": "2025-11-18T01:32:08.262Z"
    }
  ]
}
```

---

## Ejemplos de Uso

### Flujo Completo: Crear Proyecto y Tareas

#### 1. Login

```graphql
mutation Login {
  login(loginInput: {
    email: "usuario1@example.com"
    password: "User123!"
  }) {
    token
    user {
      id
      email
      role
    }
  }
}
```

#### 2. Crear Proyecto

```graphql
mutation CreateProject {
  createProject(createProjectInput: {
    title: "Mi Proyecto"
    description: "Descripción del proyecto"
    status: PENDING
  }) {
    id
    title
    status
  }
}
```

#### 3. Crear Tarea

```graphql
mutation CreateTask {
  createTask(createTaskInput: {
    title: "Primera Tarea"
    description: "Descripción de la tarea"
    status: PENDING
    priority: MEDIUM
    projectId: "project-id-from-step-2"
  }) {
    id
    title
    status
    priority
  }
}
```

#### 4. Obtener Proyecto con Tareas

```graphql
query GetProjectWithTasks {
  project(id: "project-id-from-step-2") {
    id
    title
    description
    status
    tasks {
      id
      title
      status
      priority
    }
  }
}
```

### Flujo de Administrador: Gestionar Usuarios

#### 1. Login como Admin

```graphql
mutation LoginAdmin {
  login(loginInput: {
    email: "admin@example.com"
    password: "Admin123!"
  }) {
    token
    user {
      id
      email
      role
    }
  }
}
```

#### 2. Listar Usuarios

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

#### 3. Actualizar Usuario

```graphql
mutation UpdateUser {
  updateUser(
    id: "user-id-from-step-2"
    updateUserInput: {
      fullname: "Nombre Actualizado"
      isActive: true
    }
  ) {
    id
    email
    fullname
    isActive
  }
}
```

#### 4. Eliminar Usuario

```graphql
mutation DeleteUser {
  deleteUser(id: "user-id-to-delete") {
    message
  }
}
```

### Ejecutar Seed

```graphql
query Seed {
  seed {
    message
    data {
      users
      projects
      tasks
    }
  }
}
```

---

## GraphQL Playground

El proyecto incluye GraphQL Playground habilitado en modo desarrollo. Puedes acceder a él en:

```
http://localhost:3000/graphql
```

El Playground proporciona:
- Documentación interactiva del schema
- Editor de queries con autocompletado
- Ejecución de queries y mutations
- Visualización de respuestas
- Historial de queries ejecutadas

### Usar Autenticación en Playground

Para usar autenticación en el Playground, debes configurar los headers HTTP. En la parte inferior del Playground, haz clic en "HTTP HEADERS" y agrega:

```json
{
  "Authorization": "Bearer tu-token-aqui"
}
```

---

## Colección de Postman

El proyecto incluye una colección de Postman completa en `docs/GraphQL-API.postman_collection.json` que incluye:

- Requests para todas las queries y mutations
- Configuración automática de tokens
- Variables de colección para IDs y tokens
- Tests automáticos
- Casos de prueba de permisos
- Documentación de uso

Para más información sobre cómo usar la colección, consulta `docs/README-Postman.md`.

---

## Consideraciones de Seguridad

1. **Contraseñas**: Las contraseñas se cifran usando bcrypt antes de almacenarse en la base de datos.

2. **Tokens JWT**: Los tokens tienen un tiempo de expiración configurable (por defecto 24 horas).

3. **Validación de Inputs**: Todos los inputs se validan usando class-validator antes de procesarse.

4. **Permisos**: El sistema valida permisos en cada operación para asegurar que solo usuarios autorizados puedan realizar acciones.

5. **Soft Delete**: Los usuarios se eliminan mediante soft delete, manteniendo los datos en la base de datos pero marcándolos como eliminados.

---

## Troubleshooting

### Error: "Cannot query field X on type Query"

Este error indica que el schema de GraphQL no se ha regenerado. Reinicia el servidor para que se regenere automáticamente.

### Error: "MissingDeleteDateColumnError"

Este error indica que una entidad está intentando usar soft delete pero no tiene la columna `deletedAt`. Asegúrate de que la entidad tenga el decorador `@DeleteDateColumn()`.

### Error: "Connection refused" o errores de base de datos

Verifica que:
- Docker Compose esté ejecutándose
- Las variables de entorno estén configuradas correctamente
- La base de datos esté accesible en el puerto configurado

### Error: "Unauthorized" o "Forbidden"

Verifica que:
- Estés enviando el token JWT en el header Authorization
- El token no haya expirado
- Tengas los permisos necesarios para la operación

---

