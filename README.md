# 🚀 Frontend - UQ AI (Credit Card Service)

Aplicación frontend para gestionar tarjetas de crédito y operaciones financieras.
Conecta con el **Credit Card Service** en puerto **9000**.

---

## 📋 Endpoints del Backend

**Base URL:** `http://localhost:9000/api/v1/creditcards`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/creditcards` | Listar todas las tarjetas |
| GET | `/creditcards/{id}` | Obtener tarjeta por ID |
| POST | `/creditcards` | Crear nueva tarjeta |
| PATCH | `/creditcards/{id}/status` | Actualizar estado (ACTIVA/BLOQUEADA) |
| PATCH | `/creditcards/{id}/balance` | Operar saldo (CONSUMO/PAGO) |
| DELETE | `/creditcards/{id}` | Eliminar tarjeta |

---

## 📋 Requisitos Previos

1. **Node.js** (versión 18 o superior) - https://nodejs.org/
2. **Credit Card Service** corriendo en `http://localhost:9000`

---

## ⚡ Instalación Rápida

```bash
# 1. Entra a la carpeta del proyecto
cd frontend

# 2. Instala las dependencias
npm install

# 3. Crea un archivo .env
cp .env.example .env

# 4. Inicia el proyecto
npm run dev
```

---

## 🔧 Configuración

### Desarrollo

Edita `.env`:
```env
VITE_CREDIT_CARD_URL=http://localhost:9000/api/v1
```

### Producción (Docker)

```bash
# Levantar todo
docker-compose up -d
```

- **Frontend**: http://localhost:3000
- **Credit Card API**: http://localhost:9000

---

## 📱 Funcionalidades

### 🧑‍💼 Tarjetas de Crédito
- ✅ Ver todas las tarjetas
- ✅ Crear nuevas tarjetas
- ✅ Cambiar estado (Activa/Bloqueada)
- ✅ Buscar por nombre o número
- ✅ Ver detalles con efecto flip

### 💳 Operaciones (CONSUMO/PAGO)
- ✅ Seleccionar tarjeta activa
- ✅ Registrar consumo (resta del saldo)
- ✅ Registrar pago (suma al saldo)
- ✅ Ver tarjetas activas con saldo disponible

---

## 🛠️ Comandos

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instalar dependencias |
| `npm run dev` | Iniciar desarrollo |
| `npm run build` | Construir para producción |
| `docker-compose up -d` | Levantar con Docker |

---

**¡Listo!** 
- Desarrollo: `npm run dev` → http://localhost:5173
- Docker: `docker-compose up` → http://localhost:3000