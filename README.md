# 🚀 Frontend - Tarjetas de Crédito

Aplicación frontend para gestionar tarjetas de crédito y operaciones financieras.

## 📋 Requisitos Previos

Antes de comenzar, necesitas tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descarga: https://nodejs.org/
   - Verifica con: `node -v` en tu terminal

2. **npm** (incluido con Node.js)
   - Verifica con: `npm -v`

## ⚡ Instalación Rápida

```bash
# 1. Entra a la carpeta del proyecto
cd frontend

# 2. Instala las dependencias
npm install

# 3. Inicia el proyecto
npm run dev
```

## 🎯 Cómo Ejecutar

### Modo Desarrollo (recomendado)

```bash
npm run dev
```

Esto abrirá el proyecto en tu navegador en: **http://localhost:5173**

### Para Producción

```bash
# Construir el proyecto
npm run build

# Previsualizar el build
npm run preview
```

## 🔗 Conectar con el Backend

El frontend está configurado para conectarse al backend en:

```
http://localhost:8080/api/v1
```

Si tu backend está en otro puerto, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

Luego reinicia el servidor de desarrollo.

## 📱 Funcionalidades

### 🧑‍💼 Tarjetas de Crédito
- ✅ Ver todas las tarjetas
- ✅ Crear nuevas tarjetas
- ✅ Cambiar estado (Activa/Bloqueada)
- ✅ Buscar por nombre o número
- ✅ Ver detalles de cada tarjeta (efecto flip)

### 💳 Operaciones
- ✅ Registrar consumos
- ✅ Registrar pagos
- ✅ Seleccionar tarjeta activa
- ✅ Ver historial de operaciones

## 🛠️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/           # Conexiones al backend
│   ├── components/    # Componentes visuales
│   ├── hooks/         # Lógica de la aplicación
│   ├── pages/         # Páginas principales
│   ├── types/         # Tipos de TypeScript
│   └── utils/         # Funciones útiles
├── public/            # Archivos estáticos
├── package.json      # Dependencias
├── vite.config.ts    # Configuración de Vite
└── README.md         # Este archivo
```

## 📦 Dependencias Principales

| Paquete | Descripción |
|---------|-------------|
| React | Framework de UI |
| TypeScript | Lenguaje con tipos |
| PrimeReact | Componentes UI |
| Tailwind CSS | Estilos |
| Axios | Peticiones HTTP |
| TanStack Query | Gestión de datos |
| React Router | Navegación |

## ❓ Problemas Comunes

### "npm install" falla
```bash
# Limpia la caché e intenta de nuevo
rm -rf node_modules package-lock.json
npm install
```

### El puerto 5173 está en uso
El servidor te dirá qué puerto usar (ej: 5174, 5175)

### No conecta al backend
1. Verifica que el backend esté corriendo
2. Revisa la URL en `src/constants/api.config.ts`
3. Crea el archivo `.env` con la URL correcta

## 📞 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instalar dependencias |
| `npm run dev` | Iniciar desarrollo |
| `npm run build` | Construir para producción |
| `npm run lint` | Revisar código |
| `npm run preview` | Ver build de producción |

---

## 🐳 Ejecutar con Docker (Opcional)

```bash
# Construir imagen
docker build -t frontend:latest .

# Ejecutar
docker run -p 8080:8080 frontend:latest
```

---

**¡Listo!** Abre http://localhost:5173 en tu navegador y empieza a usar la aplicación.