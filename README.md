
# Crypto Dashboard 🚀

Un dashboard moderno de criptomonedas construido con React, TypeScript y Tailwind CSS que proporciona herramientas completas para el seguimiento y análisis de criptomendas.

## ✨ Características

- **Dashboard Principal**: Vista general del mercado con estadísticas en tiempo real
- **Lista de Seguimiento**: Gestiona tus criptomonedas favoritas con funciones de búsqueda y filtrado
- **Convertidor de Cryptos**: Convierte entre diferentes criptomonedas y monedas fiat con tasas actualizadas
- **Mercados**: Explora todos los mercados disponibles con información detallada
- **Tema Oscuro/Claro**: Alterna entre temas con persistencia local
- **Diseño Responsivo**: Optimizado para todos los dispositivos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS + Shadcn/UI
- **Gestión de Estado**: TanStack Query (React Query)
- **Navegación**: React Router DOM
- **Gráficos**: TradingView Widget + Recharts
- **Iconos**: Lucide React
- **Formularios**: React Hook Form + Zod

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js (versión 18 o superior)
- npm, yarn, pnpm o bun

### Pasos de instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd crypto-dashboard
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   # o
   bun install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   # o
   bun dev
   ```

4. **Abre tu navegador**
   
   Visita `http://localhost:8080` para ver la aplicación

## 📱 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── converter/       # Componentes del convertidor
│   ├── crypto/          # Componentes de información cripto
│   ├── ui/              # Componentes base de UI (Shadcn)
│   └── watchlist/       # Componentes de lista de seguimiento
├── data/                # Datos estáticos y configuraciones
├── hooks/               # Custom hooks
├── lib/                 # Utilidades y configuraciones
├── pages/               # Páginas principales de la aplicación
├── types/               # Definiciones de tipos TypeScript
└── utils/               # Funciones utilitarias
```

## 🎯 Funcionalidades Principales

### Dashboard Principal (`/`)
- Estadísticas del mercado en tiempo real
- Lista de criptomonedas populares
- Gráfico interactivo de Bitcoin
- Tarjetas de información rápida

### Lista de Seguimiento (`/watchlist`)
- Añade/elimina criptomonedas de tu lista personal
- Búsqueda y filtrado avanzado
- Ordenamiento por diferentes criterios
- Información detallada de cada moneda

### Convertidor (`/converter`)
- Conversión entre múltiples criptomonedas
- Soporte para monedas fiat
- Tasas de cambio en tiempo real
- Conversiones rápidas predefinidas

### Mercados (`/markets`)
- Vista completa de todos los mercados
- Información detallada de trading
- Análisis de tendencias
- Datos históricos

## 🎨 Personalización de Tema

La aplicación incluye soporte completo para temas oscuro y claro:

- **Cambio automático**: Detecta la preferencia del sistema
- **Persistencia**: Recuerda tu elección en el navegador
- **Transiciones suaves**: Animaciones fluidas entre temas

## 📊 Integración de APIs

El proyecto está preparado para integrarse con APIs de criptomonedas populares como:

- CoinGecko API
- CoinMarketCap API
- Binance API
- Custom WebSocket connections

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Vista previa de la construcción local

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run type-check   # Verifica tipos TypeScript
```

## 🌐 Despliegue

### Producción Local
```bash
npm run build
npm run preview
```

### Plataformas de Hosting
La aplicación es compatible con:

- **Vercel**: Despliegue automático desde Git
- **Netlify**: Build automático con configuración cero
- **GitHub Pages**: Hosting estático gratuito
- **AWS S3 + CloudFront**: Solución escalable en la nube
