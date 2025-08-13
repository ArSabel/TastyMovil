# TastyFood Mobile App

Aplicación móvil React Native con Expo para el sistema de delivery TastyFood.

## 🚀 Características

- ✅ Autenticación con Supabase (Login/Registro/Logout)
- ✅ Navegación con React Navigation
- ✅ Estilizado con TailwindCSS (twrnc)
- ✅ Integración con base de datos Supabase
- ✅ Cámara con permisos
- ✅ Notificaciones push
- ✅ Lista de restaurantes
- ✅ Arquitectura modular y escalable

## 📱 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- Expo CLI
- Expo Go app en tu dispositivo móvil

### Pasos de instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Las credenciales de Supabase se toman automáticamente del proyecto web padre
   - Ubicadas en: `../env.local`

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```

4. **Ejecutar en dispositivo:**
   - **Android:** Escanea el código QR con Expo Go
   - **iOS:** Escanea el código QR con la app Cámara
   - **Web:** Presiona `w` en la terminal

## 📁 Estructura del Proyecto

```
tastyfood-mobile/
├── context/
│   └── AuthContext.tsx          # Contexto de autenticación
├── hooks/
│   └── useProducts.ts           # Hooks para productos y restaurantes
├── lib/
│   └── supabase.ts             # Configuración de Supabase
├── navigation/
│   └── AppNavigator.tsx        # Configuración de navegación
├── screens/
│   ├── LoginScreen.tsx         # Pantalla de login
│   ├── RegisterScreen.tsx      # Pantalla de registro
│   ├── HomeScreen.tsx          # Pantalla principal
│   ├── RestaurantsScreen.tsx   # Lista de restaurantes
│   └── CameraScreen.tsx        # Pantalla de cámara
├── services/
│   └── NotificationService.ts  # Servicio de notificaciones
└── App.tsx                     # Componente principal
```

## 🔧 Tecnologías Utilizadas

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Supabase** - Backend como servicio
- **React Navigation** - Navegación
- **TailwindCSS (twrnc)** - Estilizado
- **Expo Camera** - Funcionalidad de cámara
- **Expo Notifications** - Notificaciones push

## 📱 Funcionalidades Principales

### Autenticación
- Login con email y contraseña
- Registro de nuevos usuarios
- Logout seguro
- Persistencia de sesión

### Navegación
- Stack navigation entre pantallas
- Navegación condicional (autenticado/no autenticado)
- Transiciones suaves

### Restaurantes
- Lista de restaurantes desde Supabase
- Refresh para actualizar datos
- Estados de carga y error

### Cámara
- Acceso a cámara frontal y trasera
- Captura de fotos
- Previsualización de imágenes
- Permisos manejados automáticamente

### Notificaciones
- Configuración automática de permisos
- Notificaciones locales
- Soporte para notificaciones push
- Listeners para eventos de notificación

## 🔐 Permisos

La aplicación solicita los siguientes permisos:

- **Cámara:** Para tomar fotos de productos
- **Notificaciones:** Para recibir actualizaciones
- **Micrófono:** Para funciones de video (futuro)

## 🚀 Comandos Disponibles

```bash
# Iniciar servidor de desarrollo
npx expo start

# Ejecutar en Android
npx expo start --android

# Ejecutar en iOS
npx expo start --ios

# Ejecutar en web
npx expo start --web

# Limpiar cache
npx expo start --clear

# Construir para producción
npx expo build
```

## 🔄 Integración con Backend Web

Esta aplicación móvil reutiliza:
- Configuración de Supabase del proyecto web
- Estructura de base de datos
- Tipos de TypeScript
- Lógica de negocio adaptada

## 📝 Notas de Desarrollo

- La aplicación está configurada para funcionar tanto en Android como iOS
- Se incluyen permisos básicos para cámara y notificaciones
- El proyecto utiliza la nueva arquitectura de React Native cuando está disponible
- TailwindCSS está configurado via `twrnc` para compatibilidad móvil

## 🐛 Solución de Problemas

### Error de dependencias
Si aparecen warnings sobre versiones de paquetes:
```bash
npx expo install --fix
```

### Problemas de cache
```bash
npx expo start --clear
```

### Problemas de permisos
- Asegúrate de que los permisos estén configurados en `app.json`
- Reinicia la aplicación después de otorgar permisos

## 📞 Soporte

Para problemas o preguntas sobre la aplicación móvil, consulta la documentación del proyecto principal o revisa los logs de Expo.