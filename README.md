📝 To-Do App con Firebase

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

# 5. Probar localmente la Aplicación 🌐 
# Servidor local
En caso de no tener python deberas instalarlo

python -m http.server 8000
# Abrir en navegador: http://localhost:8000

📝 Nota sobre Python
Si no tienes Python instalado:
Usa npx serve como alternativa

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
En pestaña Reglas, puedes dejar las reglas por defecto o crear nuevas
Crea colecciones: categories y tasks


¡Listo! 🎉 Ahora tienes tu propia aplicación de tareas funcionando con Firebase.

Este proyecto fue creado para aprendizaje y desarrollo de habilidades en Firebase y desarrollo web.
