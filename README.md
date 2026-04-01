# React Scalable App

Estructura de proyecto React escalable con TypeScript, Axios, PrimeReact y Tailwind CSS.

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Configuración y endpoints de API
├── assets/                # Recursos estáticos
│   ├── fonts/
│   ├── images/
│   └── styles/
│       └── index.css     # Estilos globales con Tailwind
├── components/            # Componentes React
│   ├── common/           # Componentes reutilizables
│   ├── forms/            # Componentes de formularios
│   └── layout/           # Componentes de layout
├── constants/             # Constantes de la aplicación
├── contexts/              # React Contexts
├── hooks/                 # Custom Hooks
├── pages/                 # Páginas/Vistas
├── router/                # Configuración de rutas
├── services/              # Servicios de negocio
├── store/                 # Redux Store
├── types/                 # TypeScript types/interfaces
└── utils/                 # Utilidades
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🐳 Docker

### Construir imagen (Multi-stage)

```bash
docker build -t react-app:latest .
```

### Ejecutar contenedor

```bash
docker run -p 8080:8080 --name react-app react-app:latest
```

### Docker Compose

```bash
docker-compose up -d
```

## 🛠️ Características

- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **PrimeReact** para componentes UI
- **Axios** para peticiones HTTP
- **Redux Toolkit** para estado global
- **React Router** para navegación
- **Multi-stage Docker build** optimizado
- **Nginx Alpine** sin root para producción
- **Security headers** configurados
- **Health checks** incluidos

## 📦 Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta ESLint |

## 🔧 Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3001/api
```

### Path Aliases

Los siguientes alias están configurados:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@hooks/` → `src/hooks/`
- `@store/` → `src/store/`
- `@assets/` → `src/assets/`

## 🐳 Dockerfile (Multi-stage)

El Dockerfile incluye 3 stages:

1. **deps**: Instala dependencias de producción
2. **builder**: Compila la aplicación con dependencias de desarrollo
3. **production**: Imagen final con Nginx Alpine, sin root, optimizada

### Características de seguridad:

- ✅ Ejecución como usuario no-root (`appuser`)
- ✅ Imagen base Alpine (ligera)
- ✅ Dependencias actualizadas automáticamente
- ✅ Headers de seguridad configurados
- ✅ Health checks
- ✅ Solo archivos necesarios en imagen final

## 📝 Licencia

MIT
