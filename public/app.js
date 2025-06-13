// DOM Elements
const hobbyList = document.getElementById('hobbyList');
const addHobbyBtn = document.getElementById('addHobbyBtn');
const hobbyModal = document.getElementById('hobbyModal');
const hobbyForm = document.getElementById('hobbyForm');
const modalTitle = document.getElementById('modalTitle');
const closeBtn = document.querySelector('.close');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const detailModal = document.getElementById('detailModal');
const detailBody = document.getElementById('detailBody');
const closeDetailModal = document.getElementById('closeDetailModal');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');

// State
let hobbies = [];
let editingHobbyId = null;
let currentUser = null;

// Thêm nút đăng nhập/đăng xuất vào header
const header = document.querySelector('header');
const userInfoDiv = document.createElement('div');
userInfoDiv.id = 'userInfo';
header.appendChild(userInfoDiv);

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchHobbies();
    setupEventListeners();
});

function setupEventListeners() {
    addHobbyBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);
    hobbyForm.addEventListener('submit', handleFormSubmit);
    categoryFilter.addEventListener('change', filterHobbies);
    searchInput.addEventListener('input', filterHobbies);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === hobbyModal) {
            closeModal();
        }
        if (e.target === detailModal) {
            closeDetail();
        }
        if (e.target === loginModal) closeLogin();
        if (e.target === registerModal) closeRegister();
    });
    closeDetailModal.addEventListener('click', closeDetail);
    closeLoginModal.addEventListener('click', closeLogin);
    closeRegisterModal.addEventListener('click', closeRegister);
    showRegisterBtn.addEventListener('click', () => {
        closeLogin();
        openRegisterModal();
    });
    showLoginBtn.addEventListener('click', () => {
        closeRegister();
        openLoginModal();
    });
}

// API Calls
async function fetchHobbies() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const response = await fetch('/api/hobbies', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        hobbies = await response.json();
        renderHobbies(hobbies);
    } catch (error) {
        console.error('Error fetching hobbies:', error);
        showNotification('Lỗi khi tải danh sách sở thích', 'error');
    }
}

async function createHobby(hobbyData) {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const response = await fetch('/api/hobbies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(hobbyData),
        });
        const newHobby = await response.json();
        hobbies.unshift(newHobby);
        renderHobbies(hobbies);
        showNotification('Thêm sở thích thành công!', 'success');
    } catch (error) {
        console.error('Error creating hobby:', error);
        showNotification('Lỗi khi thêm sở thích', 'error');
    }
}

async function updateHobby(id, hobbyData) {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const response = await fetch(`/api/hobbies/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(hobbyData),
        });
        const updatedHobby = await response.json();
        hobbies = hobbies.map(hobby => 
            hobby._id === id ? updatedHobby : hobby
        );
        renderHobbies(hobbies);
        showNotification('Cập nhật sở thích thành công!', 'success');
    } catch (error) {
        console.error('Error updating hobby:', error);
        showNotification('Lỗi khi cập nhật sở thích', 'error');
    }
}

async function deleteHobby(id) {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!confirm('Bạn có chắc chắn muốn xóa sở thích này?')) return;

    try {
        await fetch(`/api/hobbies/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        hobbies = hobbies.filter(hobby => hobby._id !== id);
        renderHobbies(hobbies);
        showNotification('Xóa sở thích thành công!', 'success');
    } catch (error) {
        console.error('Error deleting hobby:', error);
        showNotification('Lỗi khi xóa sở thích', 'error');
    }
}

// UI Functions
function renderHobbies(hobbiesToRender) {
    hobbyList.innerHTML = hobbiesToRender.map(hobby => `
        <div class="hobby-card" onclick="showDetail(event, '${hobby._id}')">
            <h3>${hobby.name}</h3>
            <span class="category">${hobby.category}</span>
            <p class="description">${hobby.description}</p>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${hobby.progress}%"></div>
            </div>
            <p>Tần suất: ${hobby.frequency}</p>
            ${hobby.notes ? `<p class="notes">Ghi chú: ${hobby.notes}</p>` : ''}
            <div class="actions" onclick="event.stopPropagation()">
                <button class="btn-edit" onclick="editHobby('${hobby._id}'); event.stopPropagation();">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn-delete" onclick="deleteHobby('${hobby._id}'); event.stopPropagation();">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

function openModal(hobby = null) {
    editingHobbyId = hobby ? hobby._id : null;
    modalTitle.textContent = hobby ? 'Chỉnh sửa sở thích' : 'Thêm sở thích mới';
    
    if (hobby) {
        document.getElementById('name').value = hobby.name;
        document.getElementById('category').value = hobby.category;
        document.getElementById('description').value = hobby.description;
        document.getElementById('frequency').value = hobby.frequency;
        document.getElementById('progress').value = hobby.progress;
        document.getElementById('notes').value = hobby.notes || '';
    } else {
        hobbyForm.reset();
    }
    
    hobbyModal.style.display = 'block';
}

function closeModal() {
    hobbyModal.style.display = 'none';
    hobbyForm.reset();
    editingHobbyId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const hobbyData = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        frequency: document.getElementById('frequency').value,
        progress: parseInt(document.getElementById('progress').value),
        notes: document.getElementById('notes').value
    };

    if (editingHobbyId) {
        updateHobby(editingHobbyId, hobbyData);
    } else {
        createHobby(hobbyData);
    }

    closeModal();
}

function editHobby(id) {
    const hobby = hobbies.find(h => h._id === id);
    if (hobby) {
        openModal(hobby);
    }
}

function filterHobbies() {
    const category = categoryFilter.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();

    const filteredHobbies = hobbies.filter(hobby => {
        const matchesCategory = !category || hobby.category.toLowerCase() === category;
        const matchesSearch = !searchTerm || 
            hobby.name.toLowerCase().includes(searchTerm) ||
            hobby.description.toLowerCase().includes(searchTerm) ||
            hobby.category.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesSearch;
    });

    renderHobbies(filteredHobbies);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

window.showDetail = function(event, id) {
    event.stopPropagation();
    const hobby = hobbies.find(h => h._id === id);
    if (hobby) {
        renderDetail(hobby);
        detailModal.style.display = 'block';
    }
}

function renderDetail(hobby) {
    detailBody.innerHTML = `
        <div class="detail-row"><span class="detail-label">Tên:</span><span class="detail-value">${hobby.name}</span></div>
        <div class="detail-row"><span class="detail-label">Danh mục:</span><span class="detail-value">${hobby.category}</span></div>
        <div class="detail-row"><span class="detail-label">Mô tả:</span><span class="detail-value">${hobby.description}</span></div>
        <div class="detail-row"><span class="detail-label">Tần suất:</span><span class="detail-value">${hobby.frequency}</span></div>
        <div class="detail-row"><span class="detail-label">Tiến độ:</span><span class="detail-value">${hobby.progress}%<div class='progress-bar'><div class='progress-bar-fill' style='width: ${hobby.progress}%'></div></div></span></div>
        ${hobby.notes ? `<div class="detail-row"><span class="detail-label">Ghi chú:</span><span class="detail-value">${hobby.notes}</span></div>` : ''}
        <div class="detail-row"><span class="detail-label">Ngày tạo:</span><span class="detail-value">${new Date(hobby.createdAt).toLocaleString()}</span></div>
    `;
}

function closeDetail() {
    detailModal.style.display = 'none';
    detailBody.innerHTML = '';
}

// User info
function updateUserInfo() {
    userInfoDiv.innerHTML = '';
    if (currentUser) {
        userInfoDiv.innerHTML = `<span>Xin chào, ${currentUser.name}</span><button id="logoutBtn">Đăng xuất</button>`;
        document.getElementById('logoutBtn').onclick = logout;
    } else {
        userInfoDiv.innerHTML = `<button id="loginBtn" class="btn-primary"><i class="fas fa-sign-in-alt"></i> Đăng nhập</button>`;
        document.getElementById('loginBtn').onclick = openLoginModal;
    }
}

// Hiển thị modal đăng nhập/đăng ký
function openLoginModal() {
    loginModal.style.display = 'block';
}
function openRegisterModal() {
    registerModal.style.display = 'block';
}
function closeLogin() {
    loginModal.style.display = 'none';
    loginForm.reset();
}
function closeRegister() {
    registerModal.style.display = 'none';
    registerForm.reset();
}

// Đăng ký
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            showNotification('Đăng ký thành công! Hãy đăng nhập.');
            closeRegister();
            openLoginModal();
        } else {
            showNotification(data.message || 'Đăng ký thất bại', 'error');
        }
    } catch {
        showNotification('Lỗi kết nối server', 'error');
    }
});

// Đăng nhập
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showNotification('Đăng nhập thành công!');
            closeLogin();
            updateUserInfo();
            fetchHobbies();
        } else {
            showNotification(data.message || 'Đăng nhập thất bại', 'error');
        }
    } catch {
        showNotification('Lỗi kết nối server', 'error');
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    updateUserInfo();
    hobbyList.innerHTML = '<div style="text-align:center;margin-top:40px;">Hãy đăng nhập để quản lý sở thích của bạn!</div>';
}

// Kiểm tra đăng nhập khi load trang
(function checkLogin() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        currentUser = JSON.parse(user);
        updateUserInfo();
        fetchHobbies();
    } else {
        currentUser = null;
        updateUserInfo();
        hobbyList.innerHTML = '<div style="text-align:center;margin-top:40px;">Hãy đăng nhập để quản lý sở thích của bạn!</div>';
    }
})();

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification.success {
        background-color: var(--success-color);
    }
    
    .notification.error {
        background-color: var(--danger-color);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 