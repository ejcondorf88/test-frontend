# React Scalable App

Estructura de proyecto React escalable con TypeScript, Axios, PrimeReact y Tailwind CSS.

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Configuración y endpoints de API
│   ├── client.ts          # Configuración de Axios
│   └── endpoints.ts       # Endpoints de la API
├── assets/                # Recursos estáticos
│   ├── fonts/
│   ├── images/
│   └── styles/
│       └── index.css     # Estilos globales con Tailwind
├── components/            # Componentes React
│   ├── common/           # Componentes reutilizables
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DataTable.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── forms/            # Componentes de formularios
│   │   ├── LoginForm.tsx
│   │   └── index.ts
│   └── layout/           # Componentes de layout
│       ├── Layout.tsx
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Footer.tsx
│       └── index.ts
├── constants/             # Constantes de la aplicación
│   ├── api.config.ts
│   └── app.config.ts
├── contexts/              # React Contexts
├── hooks/                 # Custom Hooks
│   ├── useFetch.ts
│   ├── useForm.ts
│   ├── useUtils.ts
│   ├── useLifecycle.ts
│   └── index.ts
├── pages/                 # Páginas/Vistas
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── UsersPage.tsx
│   ├── UserDetailPage.tsx
│   ├── NotFoundPage.tsx
│   └── UnauthorizedPage.tsx
├── router/                # Configuración de rutas
│   ├── AppRoutes.tsx
│   └── ProtectedRoute.tsx
├── services/              # Servicios de negocio
├── store/                 # Redux Store
│   ├── store.ts
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── uiSlice.ts
│   └── actions/
├── types/                 # TypeScript types/interfaces
│   ├── common.types.ts
│   └── router.types.ts
├── utils/                 # Utilidades
│   └── common.utils.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar tests
npm run test
```

## 🛠️ Características

- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **PrimeReact** para componentes UI
- **Axios** para peticiones HTTP
- **Redux Toolkit** para estado global
- **React Router** para navegación
- **Custom Hooks** reutilizables
- **Path aliases** configurados
- **ESLint** y **Prettier** configurados

## 📦 Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta tests con Vitest |
| `npm run test:coverage` | Ejecuta tests con cobertura |

## 🔧 Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3001/api
```

### Path Aliases

Los siguientes alias están configurados en `tsconfig.json`:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@hooks/` → `src/hooks/`
- `@services/` → `src/services/`
- `@utils/` → `src/utils/`
- `@types/` → `src/types/`
- `@constants/` → `src/constants/`
- `@assets/` → `src/assets/`
- `@store/` → `src/store/`
- `@api/` → `src/api/`

## 📝 Convenciones

### Componentes

- Usar FC (Functional Component) de React
- Props interfaces definidas inline
- Export default al final del archivo

### Hooks

- Prefijo `use` para hooks personalizados
- Barrel exports en `index.ts`

### Estilos

- Usar clases de Tailwind CSS
- Override de PrimeReact con !important en config

## 🏗️ Arquitectura

### Store (Redux)

- **Slices**: auth, ui
- **Actions**: async actions usando thunks
- **Selectors**: tipados con useAppSelector

### API

- Cliente Axios configurado con interceptores
- Endpoints organizados por dominio
- Manejo automático de tokens

### Router

- Configuración centralizada en AppRoutes
- ProtectedRoute para rutas autenticadas
- Role-based access control

## 🎨 Componentes Reutilizables

### Common Components

- **Button**: Variantes primary, secondary, danger, ghost
- **Input**: Con icono, label, error message
- **Card**: Contenedor con título, subtítulo, footer
- **DataTable**: Tabla con paginación, ordenamiento
- **Alert**: Mensajes de info, success, warning, error
- **LoadingSpinner**: Con variantes de tamaño
- **Modal**: Con backdrop, título, footer

### Form Components

- **LoginForm**: Ejemplo de formulario con validación
- useForm hook para manejo de estado y validación

## 🔒 Autenticación

- JWT tokens almacenados en localStorage
- Interceptor de Axios para añadir token
- Refresh token automático
- Rutas protegidas con ProtectedRoute

## 📱 Responsive

- Layout responsive con sidebar colapsable
- Tailwind breakpoints configurados
- PrimeReact responsive por defecto

## 🧪 Testing

- Vitest para tests unitarios
- React Testing Library
- Mocks de Axios y Router

## 📄 Licencia

MIT
