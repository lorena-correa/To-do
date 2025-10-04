// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut,onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Aqui se pone la configuración que da firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGfBtYVm73dkvCwXQDwqzHSnIs8CiATzU",
  authDomain: "studio-9038381483-10fa8.firebaseapp.com",
  projectId: "studio-9038381483-10fa8",
  storageBucket: "studio-9038381483-10fa8.firebasestorage.app",
  messagingSenderId: "802159808866",
  appId: "1:802159808866:web:03694475c404c3681bdc3b"
};

// inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const landingPage = document.getElementById('landing-page');
const appSection = document.getElementById('app');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const taskCategory = document.getElementById('task-category');
const categoryFilter = document.getElementById('category-filter');
const manageCategoriesBtn = document.getElementById('manage-categories-btn');
const categoriesModal = document.getElementById('categories-modal');
const closeModal = document.querySelector('.close-modal');
const addCategoryBtn = document.getElementById('add-category-btn');
const categoryName = document.getElementById('category-name');
const categoryIcon = document.getElementById('category-icon');
const categoryColor = document.getElementById('category-color');
const categoriesList = document.getElementById('categories-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Variables globales
let currentUser = null;
let currentFilter = 'all';
let currentCategoryFilter = 'all';
let categories = [];

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        showApp(user);
        loadCategories(user.uid);
        loadTasks(user.uid);
    } else {
        currentUser = null;
        showLanding();
    }
});

// Login with Google
loginBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Error al iniciar sesión. Intenta nuevamente.');
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Show landing page
function showLanding() {
    landingPage.style.display = 'block';
    appSection.style.display = 'none';
    userInfo.style.display = 'none';
    loginBtn.style.display = 'inline-flex';
}

// Show app section
function showApp(user) {
    landingPage.style.display = 'none';
    appSection.style.display = 'block';
    userInfo.style.display = 'flex';
    loginBtn.style.display = 'none';
    
    // Set user info
    userName.textContent = user.displayName || 'Usuario';
    userAvatar.src = user.photoURL || 'img/default.png';
}

//Categories from Firestore
function loadCategories(userId) {
    const categoriesQuery = query(
        collection(db, 'categories'),
        where('uid', '==', userId),
        orderBy('createdAt', 'asc')
    );
    
    onSnapshot(categoriesQuery, (snapshot) => {
        categories = [];
        taskCategory.innerHTML = '<option value="">Sin categoría</option>';
        categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';
        
        snapshot.forEach((doc) => {
            const category = { id: doc.id, ...doc.data() };
            categories.push(category);
            
            // Add to task category dropdown
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = category.name;
            taskCategory.appendChild(option);
            
            // Add to category filter dropdown
            const filterOption = document.createElement('option');
            filterOption.value = doc.id;
            filterOption.textContent = category.name;
            categoryFilter.appendChild(filterOption);
        });
        
        updateCategoriesList();
    });
}

// Update categories list in modal
function updateCategoriesList() {
    categoriesList.innerHTML = '';
    
    if (categories.length === 0) {
        categoriesList.innerHTML = '<p class="empty-state">No hay categorías creadas</p>';
        return;
    }
    
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-info">
                <div class="category-preview" style="background-color: ${category.color}20; color: ${category.color}; border: 1px solid ${category.color}40;">
                    <i class="${category.icon}"></i>
                    <span>${category.name}</span>
                </div>
            </div>
            <button class="btn btn-danger btn-small delete-category-btn" data-id="${category.id}">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        `;
        
        categoriesList.appendChild(categoryItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const categoryId = e.target.closest('.delete-category-btn').dataset.id;
            deleteCategory(categoryId);
        });
    });
}

// Add new category
addCategoryBtn.addEventListener('click', async () => {
    const name = categoryName.value.trim();
    const icon = categoryIcon.value;
    const color = categoryColor.value;
    
    if (!name) {
        alert('Por favor ingresa un nombre para la categoría');
        return;
    }
    
    if (!currentUser) return;
    
    try {
        await addDoc(collection(db, 'categories'), {
            name: name,
            icon: icon,
            color: color,
            uid: currentUser.uid,
            createdAt: serverTimestamp()
        });
        
        categoryName.value = '';
        categoryColor.value = '#57A4A6';
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Error al agregar la categoría. Intenta nuevamente.');
    }
});

// Delete category
async function deleteCategory(categoryId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Las tareas asociadas no se eliminarán, pero perderán su categoría.')) {
        try {
            await deleteDoc(doc(db, 'categories', categoryId));
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error al eliminar la categoría. Intenta nuevamente.');
        }
    }
}

// Modal functionality
manageCategoriesBtn.addEventListener('click', () => {
    categoriesModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    categoriesModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === categoriesModal) {
        categoriesModal.style.display = 'none';
    }
});

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        filterTasks();
    });
});

categoryFilter.addEventListener('change', () => {
    currentCategoryFilter = categoryFilter.value;
    filterTasks();
});

function filterTasks() {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        const isCompleted = item.querySelector('.task-checkbox').checked;
        const categoryId = item.dataset.category || '';
        
        let show = true;
        
        // Apply status filter
        if (currentFilter === 'pending' && isCompleted) show = false;
        if (currentFilter === 'completed' && !isCompleted) show = false;
        
        // Apply category filter
        if (currentCategoryFilter !== 'all' && categoryId !== currentCategoryFilter) show = false;
        
        item.style.display = show ? 'flex' : 'none';
    });
}

// Load tasks from Firestore
function loadTasks(userId) {
    const tasksQuery = query(
        collection(db, 'tasks'),
        where('uid', '==', userId),
        orderBy('createdAt', 'desc')
    );
    
    onSnapshot(tasksQuery, (snapshot) => {
        taskList.innerHTML = '';
        let tasksCount = 0;
        
        if (snapshot.empty) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No hay tareas</h3>
                    <p>Agrega tu primera tarea para comenzar</p>
                </div>
            `;
        } else {
            snapshot.forEach((doc) => {
                tasksCount++;
                const task = doc.data();
                const taskItem = createTaskElement(doc.id, task);
                taskList.appendChild(taskItem);
            });
        }
        
        taskCount.textContent = `${tasksCount} tarea${tasksCount !== 1 ? 's' : ''}`;
        filterTasks();
    });
}

// Create task element
function createTaskElement(id, task) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.dataset.category = task.categoryId || '';
    
    const category = categories.find(c => c.id === task.categoryId);
    const categoryBadge = category ? `
        <div class="task-category-badge" style="background-color: ${category.color}20; color: ${category.color}; border: 1px solid ${category.color}40;">
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
        </div>
    ` : '';
    
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
        <div class="task-content">
            <span class="task-text ${task.done ? 'completed' : ''}">${task.text}</span>
            ${categoryBadge}
        </div>
        <div class="task-actions">
            <button class="task-action-btn edit-btn" title="Editar tarea">
                <i class="fas fa-edit"></i>
            </button>
            <button class="task-action-btn delete-btn" title="Eliminar tarea">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Checkbox event
    const checkbox = taskItem.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => {
        updateTaskStatus(id, checkbox.checked);
    });
    
    // Edit button event
    const editBtn = taskItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        editTask(id, task.text, task.categoryId);
    });
    
    // Delete button event
    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        deleteTask(id);
    });
    
    return taskItem;
}

// Add new task
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

async function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    
    if (!currentUser) return;
    
    try {
        await addDoc(collection(db, 'tasks'), {
            text: text,
            done: false,
            categoryId: taskCategory.value || null,
            uid: currentUser.uid,
            createdAt: serverTimestamp()
        });
        
        taskInput.value = '';
        taskCategory.value = '';
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Error al agregar la tarea. Intenta nuevamente.');
    }
}

// Update task status
async function updateTaskStatus(id, done) {
    try {
        await updateDoc(doc(db, 'tasks', id), {
            done: done
        });
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Edit task
function editTask(id, currentText, currentCategoryId) {
    const newText = prompt('Editar tarea:', currentText);
    if (newText !== null && newText.trim() !== '') {
        // Simple edit - just update text
        // For a more advanced edit, you could create a modal with category selection
        updateTaskText(id, newText.trim());
    }
}

async function updateTaskText(id, text) {
    try {
        await updateDoc(doc(db, 'tasks', id), {
            text: text
        });
    } catch (error) {
        console.error('Error updating task text:', error);
    }
}

// Delete task
async function deleteTask(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        try {
            await deleteDoc(doc(db, 'tasks', id));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error al eliminar la tarea. Intenta nuevamente.');
        }
    }
}