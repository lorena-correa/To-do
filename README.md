🚀 Guía Rápida de Instalación
Una aplicación web de tareas con autenticación de Google y base de datos en tiempo real.

📋 Prerrequisitos
Cuenta de Google
Node.js instalado
Editor de código (VS Code recomendado)

⚡ Instalación Express
# 1. Instalar Firebase CLI (una vez)
npm install -g firebase-tools

# 2. Login con Firebase
firebase login

# 3. Inicializar proyecto (seleccionar Firestore)
firebase init firestore

# 4. Instalar SDK
npm install firebase

# 5. Probar localmente
python -m http.server 8000
# o si no tienes Python:
npx serve

📖 Manual Detallado Documentación Completa
Para una guía visual paso a paso con capturas de pantalla, descarga el manual completo:
Manual para to-do.pdf

🔧 Configuración Firebase
1. Crear Proyecto Firebase
Ve a Firebase Console
Haz clic en "Agregar proyecto"
Asigna nombre y configura Analytics

2. Configurar Autenticación Google
En el menú lateral ve a Authentication
Haz clic en Comenzar
Selecciona Google como proveedor
Habilita y guarda los cambios

3. Configurar Firestore Database
Ve a Firestore Database
En pestaña Reglas, pega:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

Crea colecciones: categories y tasks


🌐 Para probar la Aplicación
En caso de no tener python deberas instalarlo
# Servidor local
En caso de no tener python deberas instalarlo

python -m http.server 8000
# Abrir en navegador: http://localhost:8000
