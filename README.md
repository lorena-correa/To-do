To-Do App con Firebase
🚀 Guía Rápida de Instalación
Una aplicación web de tareas con autenticación de Google y base de datos en tiempo real, si quieres saber el maual completo detallado revisar el archivo nombrado como Manual para to-do.pdf

📋 Prerrequisitos
Cuenta de Google
Node.js instalado
Editor de código (VS Code recomendado)

⚡ Instalación Express
bash
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
📚 Documentación Completa
📖 Manual Detallado
Para una guía visual paso a paso con capturas de pantalla, descarga el manual completo:
Descargar Manual PDF

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
javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
Crea colecciones: categories y tasks

🎯 Estructura del Proyecto
text
to-do/
├── index.html          # Interfaz principal
├── main.js             # Lógica de la aplicación
├── style.css           # Estilos
├── .gitignore          # Archivos ignorados por Git
└── manual-to-do-app.pdf # Manual completo
🌐 Probar la Aplicación
bash
# Servidor local
En caso de no tener python deberas instalarlo
python -m http.server 8000
# Abrir en navegador: http://localhost:8000

✅ Funcionalidades que podras ver
✅ Autenticación con Google
✅ Crear, editar y eliminar tareas
✅ Categorizar tareas
✅ Almacenamiento en tiempo real
✅ Interfaz responsive

