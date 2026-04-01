# 🚀 Frontend - UQ AI (Credit Card Service)

Aplicación frontend para gestionar tarjetas de crédito y operaciones financieras.

---

## 📡 APIs del Backend

| Servicio | Puerto | Endpoints |
|----------|--------|-----------|
| **Credit Card Service** | 9000 | `/api/v1/creditcards/*` |
| **Operations Service** | 9093 | `/api/v1/credit-cards/active`, `/api/v1/operations` |

---

## 📋 Endpoints del Backend

### Credit Card Service (Puerto 9000)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/creditcards` | Listar todas las tarjetas |
| `GET` | `/api/v1/creditcards/{id}` | Obtener tarjeta por ID |
| `POST` | `/api/v1/creditcards` | Crear nueva tarjeta |
| `PATCH` | `/api/v1/creditcards/{id}/status` | Actualizar estado (ACTIVA/BLOQUEADA) |
| `PATCH` | `/api/v1/creditcards/{id}/balance` | Actualizar saldo (CONSUMO/PAGO) |

### Operations Service (Puerto 9093)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/credit-cards/active` | Listar solo tarjetas activas |
| `POST` | `/api/v1/operations` | Procesar operación (CONSUMO/PAGO) |

---

## ⚡ Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar proyecto
npm run dev
```

---

## 🔧 Puertos

- **Frontend**: http://localhost:3001
- **Credit Card Service**: http://localhost:9000
- **Operations Service**: http://localhost:9093

---

## 📱 Funcionalidades

### 🧑‍💼 Tarjetas de Crédito
- ✅ Ver todas las tarjetas
- ✅ Crear nuevas tarjetas
- ✅ Cambiar estado (Activa/Bloqueada)
- ✅ Buscar por nombre o número
- ✅ Ver detalles con efecto flip

### 💳 Operaciones
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

---

## 📦 Estructura

```
src/
├── api/
│   ├── endpoints.ts    # Credit Card + Operations APIs
│   └── client.ts      # Axios clients
├── hooks/
│   ├── useCreditCards.ts    # Tarjetas
│   └── useOperations.ts     # Operaciones
├── pages/
│   ├── CreditCardsPage.tsx  # Lista de tarjetas
│   └── OperationsPage.tsx   # Operaciones
└── types/
    └── credit-card.types.ts
```

---

## 🔄 Proxies (Vite)

```typescript
proxy: {
  '/api':              → http://localhost:9000   // Credit Card Service
  '/operations-api':   → http://localhost:9093  // Operations Service
}
```

---

**¡Listo!** `npm run dev` → http://localhost:3001