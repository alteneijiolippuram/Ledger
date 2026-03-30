/** 
 * Mosque Management Application - app.js
 * Vanilla JS, LocalStorage for state persistence, Tailwind CSS classes for styling.
 */

// --- 1. CONFIG & SEED DATA ---
const PASS = "160126";
const USERS = [
  { name: 'Ashraf V', phone: '9946629197', role: 'user' },
  { name: 'Muhammed Shareef K', phone: '9048487191', role: 'admin' },
  { name: 'Cheriyaman Kappil', phone: '9447307912', role: 'user' },
  { name: 'Maqbool P', phone: '9747114850', role: 'user' },
  { name: 'Anvar KP', phone: '6238622077', role: 'admin' },
  { name: 'Abdul Gafoor K', phone: '7025520335', role: 'user' },
  { name: 'Ramshad Nechiyan', phone: '8086002007', role: 'user' },
  { name: 'Fiyas Papatta', phone: '8078718551', role: 'user' },
  { name: 'Arif Babu KT', phone: '9656319805', role: 'user' },
  { name: 'Abdul Nasar O', phone: '6282529858', role: 'user' },
  { name: 'Abdul Jaleel K', phone: '9961703255', role: 'user' }
];

const MEMBER_SEED = [
    [1, "KHALID HAJI VALASHERI", "971556715545", 250], [2, "ABDUL RASAK NEERMUNDA", "919656325030", null], [3, "LATHEEF KURIKKAL", null, null], [4, "MUSTHAFA KOLOTHUM THODIKA", null, null], [5, "HASEENA PULIKKAL", null, null], [6, "FAISAL PAPATTA", "918078075265", null], [7, "FIYAS PAPATTA", "918078718551", null], [8, "NM STORE", null, null], [9, "BAPUTTY KAKKA", "919747114850", null], [10, "HAKEEM KAKKA", "919946629197", null], [11, "RIYAS PP", "919447300080", null], [12, "ARIF KT", null, null], [13, "KUNJANI KAKKA OROMPURATH", null, null], [14, "JUNAISE VADAKKE THODIKA", "919020357418", null], [15, "MUHAMMED KUNJI EP", null, null], [16, "RAHEEM PP", "966531693696", null], [17, "SHOUKATH VADAKKE THODIKA", null, null], [18, "NABEEL JAFAR OROMPURATH", "919061400850", null], [19, "RAHMATHULLA MUNNALINGAL", null, null], [20, "HASRATH ALI OROMPURATH", null, null], [21, "JUNAISE KT", null, null], [22, "ANEES KT", "916282756921", null], [23, "HAMEED KT", null, null], [24, "SALEEM KT", null, null], [25, "AZEES VADAKKE THODIKA", null, null], [26, "NOUSHAD KT", null, null], [27, "SALIM KAPPAKKUNNAN", null, 300], [28, "SHAREEF KAPPAKKUNNAN", "919048487191", 200], [29, "HASEENA KAPPAKKUNNAN", null, null], [30, "JABIR KAPPAKKUNNAN", "919745878410", null], [31, "SHIHABUDHEEN KAPPAKKUNNAN", null, null], [32, "SULAIKHA KAPPAKKUNNAN", null, null], [33, "RAHOOF KAPPAKKUNNAN", "919539520750", null], [34, "RAHMATH KAPPAKKUNNAN", null, null], [35, "ABDUL NASAR OROMPURATH", "916282529858", null], [36, "JASMAL CK", "919605684153", null], [37, "SALEEM THALAPPIL", null, 150], [38, "NASAR THALAPPIL", "918078027434", null], [39, "HAMSA KOZHUVAMMAL", null, null], [40, "JALEEL KAPPAKKUNNAN", "919961703255", null], [41, "MOIDEEN VIDIYATH", null, null], [42, "ANEES BABU KP", "919526816002", 200], [43, "CHERIYAPPU KAPPIL", null, null], [44, "MUHAMMED NELLENGARA", null, null], [45, "ABDUL MAJEED KP", "919947718452", 200], [46, "SALAM KAPPAKKUNNAN", null, null], [47, "GAFOOR KAPPAKKUNNAN", "917025520335", null], [48, "CHERIYAMAN KAPPIL", "919447307912", null], [49, "MAJEED VADAKKE THODIKA", null, null], [50, "BASHEER VADAKKE THODIKA", null, null], [51, "SULAIKHA VADAKKE THODIKA", null, null], [52, "AZEES KT", null, null], [53, "SHANAVAS VADAKKE THODIKA", "966502632648", null], [54, "ILYAS VA", "918547325453", null], [55, "KADHEER VA", "919447681996", null], [56, "ABUL AHLA VA", null, null], [57, "RAMSHAD NACHIYAN", "918086002007", null], [58, "FAISAL MUKKANNAN", null, null], [59, "LATHEEF PULIKKAL", "919446705536", null], [60, "MUSTHAFA PULIKKAL", "919496905720", null], [61, "JAMEELA PULIKKAL", null, null], [62, "MUJEEB PULIKKAL", null, null]
];

// --- 2. DB LAYER (Local Storage) ---
function getDb(key, defaultVal) {
    const data = localStorage.getItem(`mosque_${key}`);
    return data ? JSON.parse(data) : defaultVal;
}

function setDb(key, val) {
    localStorage.setItem(`mosque_${key}`, JSON.stringify(val));
}

// Ensure seeded members exist
if (!localStorage.getItem('mosque_members')) {
    const formatted = MEMBER_SEED.map(m => ({
        id: m[0],
        name: m[1],
        phone: m[2] || '',
        amount: m[3] || 0,
        subscriptions: {} // { '2024-0': true, '2024-1': false } etc
    }));
    setDb('members', formatted);
}
if (!localStorage.getItem('mosque_income')) setDb('income', []);
if (!localStorage.getItem('mosque_expense')) setDb('expense', []);
if (!localStorage.getItem('mosque_users')) setDb('users', USERS);

// --- 3. STATE ---
let currentUser = getDb('auth_user', null);
let currentModal = null;

// --- 4. CORE UTILS ---
const $ = (id) => document.getElementById(id);
const formatMoney = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

function navigate(page) {
    if (!currentUser && page !== 'login') {
        page = 'login';
    } else if (currentUser && page === 'login') {
        page = 'dashboard';
    }
    
    const appEl = $('app');
    appEl.innerHTML = '';
    
    // Add layout wrappers if not login
    if (page !== 'login') {
        appEl.innerHTML = `
            ${renderHeader(page)}
            <div id="page-content" class="flex-1 overflow-y-auto pb-24 fade-in"></div>
            ${renderTabBar(page)}
            ${renderMenuOverlay()}
        `;
        const content = $('page-content');
        if (page === 'dashboard') renderDashboard(content);
        if (page === 'income') renderIncome(content);
        if (page === 'expense') renderExpense(content);
        if (page === 'members') renderMembers(content);
        if (page === 'reports') renderReports(content);
        if (page === 'committee') renderCommittee(content);
    } else {
        renderLogin(appEl);
    }
}

// --- 5. UI COMPONENTS ---

function renderHeader(page) {
    const titles = {
        'dashboard': `Welcome, <span class="text-brand-600 font-bold">${currentUser?.name}</span>`,
        'income': 'Income Management',
        'expense': 'Expense Management',
        'members': 'Member Directory',
        'reports': 'Financial Reports',
        'committee': 'Committee Members'
    };
    return `
        <header class="glass sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
            <div class="flex items-center gap-3">
                ${currentUser ? `
                <button onclick="toggleMenu()" class="text-gray-600 hover:text-brand-600 transition-colors active:scale-95">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>
                ` : ''}
                <h1 class="text-lg font-semibold text-gray-800">${titles[page] || 'Mosque App'}</h1>
            </div>
            <div class="flex items-center gap-3">
                ${currentUser?.role === 'admin' ? '<span class="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-bold rounded-full">ADMIN</span>' : ''}
            </div>
        </header>
    `;
}

function renderMenuOverlay() {
    return `
        <div id="side-menu" class="fixed inset-0 z-50 pointer-events-none fade-in" style="opacity: 1;">
            <div id="menu-backdrop" onclick="toggleMenu()" class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300"></div>
            <div id="menu-panel" class="absolute top-0 left-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl transform -translate-x-full transition-transform duration-300 flex flex-col pointer-events-auto">
                <div class="p-6 border-b border-gray-100 bg-brand-50 flex flex-col justify-end min-h-[160px]">
                    <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-600 text-2xl mb-4 shadow-sm border border-brand-100">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <h3 class="font-bold text-gray-800 text-lg">${currentUser?.name}</h3>
                    <p class="text-brand-600 text-sm font-medium">${currentUser?.phone}</p>
                </div>
                <div class="p-4 space-y-2 flex-1 overflow-y-auto">
                    <button onclick="toggleMenu(); navigate('dashboard')" class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-left">
                        <div class="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                            <i class="fa-solid fa-house"></i>
                        </div>
                        <span class="font-medium text-gray-700">Home</span>
                    </button>
                    <button onclick="toggleMenu(); navigate('committee')" class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-left">
                        <div class="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                            <i class="fa-solid fa-users-gear"></i>
                        </div>
                        <span class="font-medium text-gray-700">Committee Members</span>
                    </button>
                </div>
                <div class="p-6 border-t border-gray-100 bg-gray-50 mt-auto pointer-events-auto">
                    <button onclick="toggleMenu(); logout()" class="w-full flex justify-center items-center gap-2 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-semibold shadow-sm active:scale-95 transition-transform">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
                    </button>
                </div>
            </div>
        </div>
    `;
}

window.toggleMenu = function() {
    const menu = $('side-menu');
    const backdrop = $('menu-backdrop');
    const panel = $('menu-panel');
    
    if (menu.classList.contains('pointer-events-none')) {
        menu.classList.remove('pointer-events-none');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
            panel.classList.remove('-translate-x-full');
        }, 10);
    } else {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
        panel.classList.add('-translate-x-full');
        setTimeout(() => {
            menu.classList.add('pointer-events-none');
        }, 300);
    }
};


function renderTabBar(active) {
    const tabs = [
        { id: 'dashboard', icon: 'fa-house', label: 'Home' },
        { id: 'income', icon: 'fa-arrow-down', label: 'Income' },
        { id: 'expense', icon: 'fa-arrow-up', label: 'Expense' },
        { id: 'members', icon: 'fa-users', label: 'Members' },
        { id: 'reports', icon: 'fa-chart-pie', label: 'Reports' },
    ];
    
    let html = `<nav class="glass fixed bottom-0 w-full max-w-md border-t border-gray-200 flex justify-around items-center pb-safe pt-2 pb-2 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">`;
    
    tabs.forEach(t => {
        const isActive = active === t.id;
        html += `
            <button onclick="navigate('${t.id}')" class="flex flex-col items-center justify-center w-16 h-12 relative transition-all duration-200 ${isActive ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'}">
                <i class="fa-solid ${t.icon} text-xl mb-1 ${isActive ? 'transform scale-110 mb-0' : ''}"></i>
                <span class="text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}">${t.label}</span>
                ${isActive ? '<div class="absolute -top-2 w-8 h-1 bg-brand-500 rounded-b-full"></div>' : ''}
            </button>
        `;
    });
    
    html += `</nav>`;
    return html;
}

// --- 6. PAGES ---

function renderLogin(container) {
    container.innerHTML = `
        <div class="flex flex-col h-screen justify-center items-center p-6 bg-gradient-to-br from-brand-50 to-gray-50 fade-in">
            <div class="w-20 h-20 bg-brand-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-500/30">
                <i class="fa-solid fa-mosque text-3xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p class="text-gray-500 mb-8 text-center text-sm">Sign in to manage mosque operations</p>
            
            <div class="w-full bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 card-glass">
                <form id="login-form" onsubmit="handleLogin(event)" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i class="fa-solid fa-phone"></i></span>
                            <input type="tel" id="login-phone" required class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-gray-300" placeholder="10-digit number">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i class="fa-solid fa-lock"></i></span>
                            <input type="password" id="login-pass" required class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-gray-300" placeholder="••••••">
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]">Login</button>
                    <p id="login-error" class="text-red-500 text-sm text-center hidden"></p>
                </form>
            </div>
        </div>
    `;
}

function handleLogin(e) {
    e.preventDefault();
    const phone = $('login-phone').value.trim();
    const pass = $('login-pass').value.trim();
    const err = $('login-error');
    
    if (pass !== PASS) {
        err.textContent = "Invalid password.";
        err.classList.remove('hidden');
        return;
    }
    
    // Check user
    if (phone === "6238622077") { // Override for Anvar KP just in case it's entered without country code, it matches
        // Exact match in USERS
    }
    
    const users = getDb('users', USERS);
    const user = users.find(u => u.phone.includes(phone) || phone.includes(u.phone));
    if (!user) {
        err.textContent = "User not found or access denied.";
        err.classList.remove('hidden');
        return;
    }
    
    setDb('auth_user', user);
    currentUser = user;
    navigate('dashboard');
}

function logout() {
    localStorage.removeItem('mosque_auth_user');
    currentUser = null;
    navigate('login');
}

function renderDashboard(container) {
    const incomes = getDb('income', []);
    const expenses = getDb('expense', []);
    
    const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const balance = totalIncome - totalExpense;
    
    container.innerHTML = `
        <div class="p-6 space-y-6">
            <!-- Hero Balance Card -->
            <div class="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
                <div class="absolute -right-4 -top-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div class="absolute -left-8 -bottom-8 w-24 h-24 bg-brand-400/20 rounded-full blur-xl"></div>
                
                <p class="text-brand-100 text-sm font-medium mb-1">Total Balance Amount</p>
                <h2 class="text-4xl font-bold tracking-tight mb-4">${formatMoney(balance)}</h2>
                
                <div class="flex justify-between items-center pt-4 border-t border-white/20">
                    <div>
                        <p class="text-brand-200 text-xs">Total Income</p>
                        <p class="font-semibold">${formatMoney(totalIncome)}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-brand-200 text-xs">Total Expense</p>
                        <p class="font-semibold">${formatMoney(totalExpense)}</p>
                    </div>
                </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="grid grid-cols-2 gap-4">
                <div onclick="navigate('income')" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 active:scale-95 transition-transform">
                    <div class="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                        <i class="fa-solid fa-arrow-down"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 font-medium">Income</p>
                        <p class="text-sm font-bold text-gray-800">${incomes.length} records</p>
                    </div>
                </div>
                <div onclick="navigate('expense')" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 active:scale-95 transition-transform">
                    <div class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                        <i class="fa-solid fa-arrow-up"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 font-medium">Expense</p>
                        <p class="text-sm font-bold text-gray-800">${expenses.length} records</p>
                    </div>
                </div>
            </div>

            <!-- Recent Transactions -->
            <div>
                <div class="flex justify-between items-end mb-4">
                    <h3 class="text-base font-bold text-gray-800">Recent Transactions</h3>
                </div>
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    ${renderRecentTransactions(incomes, expenses)}
                </div>
            </div>
        </div>
    `;
}

function renderRecentTransactions(incomes, expenses) {
    const sortFn = (a, b) => {
        const dDiff = new Date(b.date) - new Date(a.date);
        if (dDiff !== 0 && !isNaN(dDiff)) return dDiff;
        return Number(b.id || 0) - Number(a.id || 0);
    };

    const topIncomes = [...incomes].sort(sortFn).slice(0, 3).map(i => ({...i, isIncome: true}));
    const topExpenses = [...expenses].sort(sortFn).slice(0, 3).map(e => ({...e, isIncome: false}));
    const all = [...topIncomes, ...topExpenses];
    
    if(all.length === 0) return `<div class="p-6 text-center text-gray-400 text-sm">No recent transactions</div>`;
    
    return all.map(t => `
        <div class="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center ${t.isIncome ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}">
                    <i class="fa-solid ${t.isIncome ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                </div>
                <div>
                    <p class="font-medium text-gray-800 text-sm">${t.name || t.description}</p>
                    <p class="text-xs text-gray-500">${formatDate(t.date)}</p>
                </div>
            </div>
            <span class="font-bold text-sm ${t.isIncome ? 'text-green-600' : 'text-gray-800'}">
                ${t.isIncome ? '+' : '-'}${formatMoney(t.amount)}
            </span>
        </div>
    `).join('');
}


// --- 7. INCOME & EXPENSE ---
function renderIncome(container) {
    const incomes = getDb('income', []).sort((a,b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800">Income Log</h2>
                ${currentUser.role === 'admin' ? `
                    <button onclick="openAddIncomeModal()" class="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        <i class="fa-solid fa-plus mr-1"></i> Add Income
                    </button>
                ` : ''}
            </div>
            
            <div class="space-y-3">
                ${incomes.length === 0 ? '<p class="text-gray-500 text-center py-8">No income records found.</p>' : ''}
                ${incomes.map(inc => `
                    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-semibold text-gray-800">${inc.name}</p>
                                <div class="flex gap-2 text-xs text-gray-500 mt-1">
                                    <span>${formatDate(inc.date)}</span>
                                    <span>•</span>
                                    <span class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">${inc.purpose}</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-green-600 text-lg">+${formatMoney(inc.amount)}</p>
                                ${inc.receiptNo ? `<p class="text-[10px] text-gray-400">Rec: #${inc.receiptNo}</p>` : ''}
                            </div>
                        </div>
                        ${currentUser.role === 'admin' ? `
                            <div class="pt-3 mt-1 border-t border-gray-50 flex justify-end gap-4 text-xs">
                                <button onclick="openAddIncomeModal('${inc.id}')" class="text-brand-600 font-medium active:scale-95"><i class="fa-solid fa-pen mr-1"></i> Edit</button>
                                <button onclick="deleteIncome('${inc.id}')" class="text-red-500 font-medium active:scale-95"><i class="fa-solid fa-trash mr-1"></i> Delete</button>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openAddIncomeModal(editId = null) {
    const members = getDb('members', []);
    
    let inc = null;
    if (editId) {
        const incomes = getDb('income', []);
        inc = incomes.find(i => i.id === editId);
    }
    
    const defDate = inc ? inc.date : new Date().toISOString().split('T')[0];
    const defName = inc ? inc.name : '';
    const defPurpose = inc ? inc.purpose : 'Subscription';
    const defAmount = inc ? inc.amount : '';
    const defReceipt = inc ? (inc.receiptNo || '') : '';
    
    let selectedYear = new Date().getFullYear();
    let checkedMonths = [];
    if (inc && inc.coveredMonths && inc.coveredMonths.length > 0) {
        const parts = inc.coveredMonths[0].split('-');
        selectedYear = parts[0];
        checkedMonths = inc.coveredMonths.filter(cm => cm.startsWith(selectedYear)).map(cm => parseInt(cm.split('-')[1]));
    }
    
    const html = `
        <div class="bg-white w-full rounded-t-3xl p-6 slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800">${inc ? 'Edit Income' : 'Add New Income'}</h3>
                <button onclick="closeModal()" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <form onsubmit="saveIncome(event, ${inc ? `'${inc.id}'` : 'null'})" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Date</label>
                    <input type="date" id="inc-date" required value="${defDate}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Name / Member</label>
                    <input type="text" id="inc-name" required value="${defName}" oninput="autoCalcMonths()" list="member-list" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="Type name or select...">
                    <datalist id="member-list">
                        ${members.map(m => `<option value="${m.name}"></option>`).join('')}
                    </datalist>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Purpose</label>
                    <select id="inc-purpose" required onchange="document.getElementById('inc-months-container').classList.toggle('hidden', this.value !== 'Subscription'); autoCalcMonths();" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white">
                        <option value="Subscription" ${defPurpose === 'Subscription' ? 'selected' : ''}>Subscription</option>
                        <option value="Donation" ${defPurpose === 'Donation' ? 'selected' : ''}>Donation</option>
                        <option value="For Salary" ${defPurpose === 'For Salary' ? 'selected' : ''}>For Salary</option>
                        <option value="Other" ${defPurpose === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div id="inc-months-container" class="${defPurpose === 'Subscription' ? '' : 'hidden'}">
                    <label class="block text-xs font-medium text-gray-500 mb-2 pointer-events-none">Select Months</label>
                    <div class="flex gap-2 mb-2">
                        <select id="inc-sub-year" onchange="autoCalcMonths()" class="p-2 border border-gray-200 rounded-lg text-xs outline-none bg-gray-50 flex-1 focus:ring-2 focus:ring-brand-500">
                            ${Array.from({length: 2050 - 2025 + 1}, (_, i) => 2025 + i).map(year => 
                                `<option value="${year}" ${selectedYear == year ? 'selected' : ''}>${year}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                        ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => `
                            <label class="flex items-center justify-center text-xs border border-gray-200 rounded-lg py-1.5 cursor-pointer hover:bg-gray-50 transition-all select-none relative overflow-hidden">
                                <input type="checkbox" name="inc-month-cb" value="${i}" ${checkedMonths.includes(i) ? 'checked' : ''} class="peer absolute opacity-0 w-0 h-0">
                                <span class="text-gray-600 font-medium peer-checked:text-brand-700 w-full text-center z-10">${m}</span>
                                <div class="absolute inset-0 bg-brand-50 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
                                <div class="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500 transform scale-x-0 peer-checked:scale-x-100 transition-transform origin-left pointer-events-none z-10"></div>
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Amount</label>
                        <input type="number" id="inc-amount" required min="1" value="${defAmount}" oninput="autoCalcMonths()" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-semibold" placeholder="₹0">
                    </div>
                    <div class="flex-1">
                        <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Receipt No</label>
                        <input type="text" id="inc-receipt" value="${defReceipt}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="Optional">
                    </div>
                </div>
                <button type="submit" class="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl mt-4 active:scale-[0.98] transition-transform">${inc ? 'Update Income' : 'Save Income'}</button>
            </form>
        </div>
    `;
    showModal(html);
}

window.autoCalcMonths = function() {
    if ($('inc-purpose').value !== 'Subscription') return;
    const members = getDb('members', []);
    const memName = $('inc-name').value;
    const mem = members.find(m => m.name === memName);
    if (mem && mem.amount && mem.amount > 0) {
        const total = Number($('inc-amount').value) || 0;
        const months = Math.floor(total / mem.amount);
        if (months > 0) {
            document.querySelectorAll('input[name="inc-month-cb"]').forEach(cb => cb.checked = false);
            const year = $('inc-sub-year').value;
            let checkedCount = 0;
            document.querySelectorAll('input[name="inc-month-cb"]').forEach(cb => {
                if (checkedCount < months) {
                    const monthIdx = cb.value;
                    const key = `${year}-${monthIdx}`;
                    if (!mem.subscriptions[key]) {
                        cb.checked = true;
                        checkedCount++;
                    }
                }
            });
        }
    }
};

window.rebuildSubscriptions = function() {
    const incomes = getDb('income', []);
    let members = getDb('members', []);
    
    members.forEach(m => m.subscriptions = {});
    
    incomes.forEach(inc => {
        if (inc.purpose === 'Subscription') {
            const mem = members.find(m => m.name === inc.name);
            if (mem) {
                if (!inc.coveredMonths) {
                    const incYear = new Date(inc.date).getFullYear();
                    const monthsCount = Math.max(1, mem.amount ? Math.floor(inc.amount / mem.amount) : 1);
                    const ticked = [];
                    let checkY = incYear;
                    let checkM = 0;
                    let left = monthsCount;
                    while (left > 0 && checkY < incYear + 10) {
                        if (!mem.subscriptions[`${checkY}-${checkM}`]) {
                            mem.subscriptions[`${checkY}-${checkM}`] = true;
                            ticked.push(`${checkY}-${checkM}`);
                            left--;
                        }
                        checkM++;
                        if (checkM > 11) { checkM = 0; checkY++; }
                    }
                    inc.coveredMonths = ticked;
                } else {
                    inc.coveredMonths.forEach(cm => {
                        mem.subscriptions[cm] = true;
                    });
                }
            }
        }
    });
    
    setDb('members', members);
    setDb('income', incomes);
};

function saveIncome(e, editId) {
    e.preventDefault();
    const purpose = $('inc-purpose').value;
    
    const ticked = [];
    if (purpose === 'Subscription') {
        const year = $('inc-sub-year').value;
        document.querySelectorAll('input[name="inc-month-cb"]:checked').forEach(cb => {
            ticked.push(`${year}-${cb.value}`);
        });
    }

    const data = {
        id: editId || Date.now().toString(),
        date: $('inc-date').value,
        name: $('inc-name').value,
        purpose: purpose,
        amount: Number($('inc-amount').value),
        receiptNo: $('inc-receipt').value
    };
    
    if (purpose === 'Subscription') {
        data.coveredMonths = ticked;
    }
    
    let incomes = getDb('income', []);
    if (editId) {
        incomes = incomes.map(i => i.id === editId ? data : i);
    } else {
        incomes.push(data);
    }
    setDb('income', incomes);
    
    rebuildSubscriptions();
    
    closeModal();
    navigate('income'); 
}

function deleteIncome(id) {
    if(!confirm('Are you sure you want to delete this record?')) return;
    let incomes = getDb('income', []);
    incomes = incomes.filter(i => i.id !== id);
    setDb('income', incomes);
    
    rebuildSubscriptions();
    navigate('income');
}

function renderExpense(container) {
    const expenses = getDb('expense', []).sort((a,b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800">Expense Log</h2>
                ${currentUser.role === 'admin' ? `
                    <button onclick="openAddExpenseModal()" class="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        <i class="fa-solid fa-plus mr-1"></i> Add Expense
                    </button>
                ` : ''}
            </div>
            
            <div class="space-y-3">
                ${expenses.length === 0 ? '<p class="text-gray-500 text-center py-8">No expense records found.</p>' : ''}
                ${expenses.map(exp => `
                    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-semibold text-gray-800">${exp.description}</p>
                                <div class="flex gap-2 text-xs text-gray-500 mt-1">
                                    <span>${formatDate(exp.date)}</span>
                                    <span>•</span>
                                    <span class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">${exp.type}</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-red-600 text-lg">-${formatMoney(exp.amount)}</p>
                                ${exp.billNo ? `<p class="text-[10px] text-gray-400">Bill: #${exp.billNo}</p>` : ''}
                            </div>
                        </div>
                        ${currentUser.role === 'admin' ? `
                            <div class="pt-3 mt-1 border-t border-gray-50 flex justify-end gap-4 text-xs">
                                <button onclick="openAddExpenseModal('${exp.id}')" class="text-brand-600 font-medium active:scale-95"><i class="fa-solid fa-pen mr-1"></i> Edit</button>
                                <button onclick="deleteExpense('${exp.id}')" class="text-red-500 font-medium active:scale-95"><i class="fa-solid fa-trash mr-1"></i> Delete</button>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openAddExpenseModal(editId = null) {
    let exp = null;
    if (editId) {
        const expenses = getDb('expense', []);
        exp = expenses.find(i => i.id === editId);
    }
    
    const defDate = exp ? exp.date : new Date().toISOString().split('T')[0];
    const defDesc = exp ? exp.description : '';
    const defType = exp ? exp.type : 'Purchase';
    const defAmount = exp ? exp.amount : '';
    const defBill = exp ? (exp.billNo || '') : '';

    const html = `
        <div class="bg-white w-full rounded-t-3xl p-6 slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800">${exp ? 'Edit Expense' : 'Add New Expense'}</h3>
                <button onclick="closeModal()" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <form onsubmit="saveExpense(event, ${exp ? `'${exp.id}'` : 'null'})" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Date</label>
                    <input type="date" id="exp-date" required value="${defDate}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Description / Name</label>
                    <input type="text" id="exp-desc" required value="${defDesc}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="What was purchased?">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Expense Type</label>
                    <select id="exp-type" required class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white">
                        <option value="Purchase" ${defType === 'Purchase' ? 'selected' : ''}>Purchase</option>
                        <option value="Salary" ${defType === 'Salary' ? 'selected' : ''}>Salary</option>
                        <option value="Electricity Bill" ${defType === 'Electricity Bill' ? 'selected' : ''}>Electricity Bill</option>
                        <option value="Other Expense" ${defType === 'Other Expense' ? 'selected' : ''}>Other Expense</option>
                    </select>
                </div>
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Amount</label>
                        <input type="number" id="exp-amount" required min="1" value="${defAmount}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold" placeholder="₹0">
                    </div>
                    <div class="flex-1">
                        <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Bill No</label>
                        <input type="text" id="exp-bill" value="${defBill}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm" placeholder="Optional">
                    </div>
                </div>
                <button type="submit" class="w-full bg-red-500 text-white font-semibold py-3 rounded-xl mt-4 active:scale-[0.98] transition-transform">${exp ? 'Update Expense' : 'Save Expense'}</button>
            </form>
        </div>
    `;
    showModal(html);
}

function saveExpense(e, editId) {
    e.preventDefault();
    const data = {
        id: editId || Date.now().toString(),
        date: $('exp-date').value,
        description: $('exp-desc').value,
        type: $('exp-type').value,
        amount: Number($('exp-amount').value),
        billNo: $('exp-bill').value
    };
    
    let expenses = getDb('expense', []);
    if (editId) {
        expenses = expenses.map(i => i.id === editId ? data : i);
    } else {
        expenses.push(data);
    }
    
    setDb('expense', expenses);
    closeModal();
    navigate('expense');
}

function deleteExpense(id) {
    if(!confirm('Are you sure you want to delete this record?')) return;
    let expenses = getDb('expense', []);
    expenses = expenses.filter(i => i.id !== id);
    setDb('expense', expenses);
    navigate('expense');
}

// --- 8. MEMBERS & SUBSCRIPTIONS ---
function renderMembers(container) {
    const members = getDb('members', []);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const renderCard = (m) => {
        let dotsHtml = '';
        for(let i=0; i<12; i++) {
            const isPaid = m.subscriptions[`${currentYear}-${i}`];
            dotsHtml += `
            <div class="flex flex-col items-center gap-1">
                <div class="w-4 h-4 rounded-full transition-all duration-300 ${isPaid ? 'bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-200 border border-gray-300'}"></div>
                <span class="text-[9px] text-gray-400 font-medium">${months[i]}</span>
            </div>`;
        }
        
        return `
            <div class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-4">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1 pr-2">
                        <h4 class="font-bold text-gray-800 leading-tight">${m.name}</h4>
                        <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            ${m.phone ? `
                                <a href="tel:${m.phone}" class="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors" onclick="event.stopPropagation()"><i class="fa-solid fa-phone text-[10px]"></i></a>
                                <a href="https://wa.me/${m.phone}?text=${encodeURIComponent(`Assalamu Alaikum ${m.name}, kindly pay your mosque subscription fee for the month of ${new Date().toLocaleString('default', { month: 'long' })}.`)}" target="_blank" class="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors" onclick="event.stopPropagation()"><i class="fa-brands fa-whatsapp text-sm"></i></a>
                                <span>${m.phone}</span>
                            ` : '<span><i class="fa-solid fa-phone mr-1"></i> N/A</span>'}
                        </div>
                    </div>
                    <div class="text-right flex flex-col items-end gap-2">
                        <span class="text-[10px] text-brand-600 bg-brand-50 px-2 py-1 rounded-md font-bold whitespace-nowrap">₹${m.amount || 0}/mo</span>
                        ${currentUser.role === 'admin' ? `
                            <button onclick="openEditMemberModal('${m.id}')" class="text-[10px] text-gray-500 border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition-colors flex items-center gap-1 active:scale-95"><i class="fa-solid fa-pen"></i> Edit</button>
                        ` : ''}
                    </div>
                </div>
                <div class="pt-3 border-t border-gray-100 flex justify-between">
                    ${dotsHtml}
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800">Members List</h2>
                <span class="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">${members.length} Members</span>
            </div>
            
            <div class="relative mb-6">
                <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input type="text" id="member-search" placeholder="Search members..." oninput="filterMembers()" class="w-full bg-white border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm shadow-sm">
            </div>
            
            <div id="members-list">
                ${members.map(renderCard).join('')}
            </div>
        </div>
    `;
    
    // Store globally for search filtering
    window.__membersRenderCard = renderCard;
}

function filterMembers() {
    const term = $('member-search').value.toLowerCase();
    const members = getDb('members', []);
    const filtered = members.filter(m => m.name.toLowerCase().includes(term) || (m.phone && m.phone.includes(term)));
    $('members-list').innerHTML = filtered.map(window.__membersRenderCard).join('');
}


window.openEditMemberModal = function(id) {
    const members = getDb('members', []);
    // Using loose equality in case id is string vs number
    const m = members.find(x => x.id == id);
    if(!m) return;
    
    const html = `
        <div class="bg-white w-full rounded-t-3xl p-6 slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800">Edit Member</h3>
                <button onclick="closeModal()" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <form onsubmit="saveMember(event, '${id}')" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Name</label>
                    <input type="text" id="mem-name" required value="${m.name}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Phone Number (with country code, e.g., 919876543210)</label>
                    <input type="text" id="mem-phone" value="${m.phone || ''}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1 pointer-events-none">Subscription Fee / Month (₹)</label>
                    <input type="number" id="mem-fee" value="${m.amount || 0}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-semibold">
                </div>
                <button type="submit" class="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl mt-4 active:scale-[0.98] transition-transform">Update Member</button>
            </form>
        </div>
    `;
    showModal(html);
}

window.saveMember = function(e, id) {
    e.preventDefault();
    const members = getDb('members', []);
    const idx = members.findIndex(x => x.id == id);
    if(idx !== -1) {
        members[idx].name = $('mem-name').value;
        members[idx].phone = $('mem-phone').value;
        members[idx].amount = Number($('mem-fee').value);
        setDb('members', members);
    }
    closeModal();
    // Re-render members list, maintaining search if needed
    const term = $('member-search') ? $('member-search').value.toLowerCase() : '';
    if (term) {
        filterMembers();
    } else {
        navigate('members');
    }
}


// --- 9. REPORTS ---
function renderReports(container) {
    container.innerHTML = `
        <div class="p-6 pb-24">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800">Financial Overview</h2>
                <button onclick="exportToExcel()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition-all outline-none flex items-center gap-1.5">
                    <i class="fa-solid fa-file-excel text-green-600"></i> Export
                </button>
            </div>
            
            <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6 flex gap-3">
                <div class="flex-1">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Filter Type</label>
                    <select id="rep-filter-type" onchange="updateReport()" class="w-full text-sm font-semibold p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 text-gray-800">
                        <option value="all">All Time</option>
                        <option value="month">By Month</option>
                        <option value="date">Specific Date</option>
                    </select>
                </div>
                <div id="filter-val-container" class="flex-1 hidden">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Value</label>
                    <input type="month" id="rep-filter-val" onchange="updateReport()" class="w-full text-sm font-semibold p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 text-gray-800">
                </div>
            </div>
            
            <div id="report-content"></div>
        </div>
    `;
    
    // Initial global setup
    window.updateReport = function() {
        const type = $('rep-filter-type').value;
        const valInput = $('rep-filter-val');
        const vBox = $('filter-val-container');
        
        let filterVal = null;
        if(type === 'month') {
            vBox.classList.remove('hidden');
            valInput.type = 'month';
            if(!valInput.value) valInput.value = new Date().toISOString().slice(0, 7);
            filterVal = valInput.value;
        } else if(type === 'date') {
            vBox.classList.remove('hidden');
            valInput.type = 'date';
            if(!valInput.value) valInput.value = new Date().toISOString().split('T')[0];
            filterVal = valInput.value;
        } else {
            vBox.classList.add('hidden');
        }
        
        const allIncomes = getDb('income', []);
        const allExpenses = getDb('expense', []);
        
        const incomes = allIncomes.filter(i => {
            if(type === 'all') return true;
            if(type === 'month') return i.date.startsWith(filterVal);
            if(type === 'date') return i.date === filterVal;
        });
        
        const expenses = allExpenses.filter(i => {
            if(type === 'all') return true;
            if(type === 'month') return i.date.startsWith(filterVal);
            if(type === 'date') return i.date === filterVal;
        });
        
        const totals = {
            income: incomes.reduce((s,i) => s + i.amount, 0),
            expense: expenses.reduce((s,i) => s + i.amount, 0),
            get balance() { return this.income - this.expense; },
            
            inc_sub: incomes.filter(i=>i.purpose==='Subscription').reduce((s,i) => s + i.amount, 0),
            inc_don: incomes.filter(i=>i.purpose==='Donation').reduce((s,i) => s + i.amount, 0),
            inc_sal: incomes.filter(i=>i.purpose==='For Salary').reduce((s,i) => s + i.amount, 0),
            inc_oth: incomes.filter(i=>i.purpose==='Other').reduce((s,i) => s + i.amount, 0),
            
            exp_pur: expenses.filter(i=>i.type==='Purchase').reduce((s,i) => s + i.amount, 0),
            exp_sal: expenses.filter(i=>i.type==='Salary').reduce((s,i) => s + i.amount, 0),
            exp_ele: expenses.filter(i=>i.type==='Electricity Bill').reduce((s,i) => s + i.amount, 0),
            exp_oth: expenses.filter(i=>i.type==='Other Expense').reduce((s,i) => s + i.amount, 0),
        };
        
        $('report-content').innerHTML = `
            <!-- Master Summary -->
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white mb-6 shadow-lg shadow-gray-900/20 relative overflow-hidden">
                <div class="absolute -right-4 -top-12 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <p class="text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">Net Balance</p>
                <h3 class="text-3xl font-bold mb-4 ${totals.balance >= 0 ? 'text-brand-400' : 'text-red-400'}">${formatMoney(totals.balance)}</h3>
                <div class="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-gray-700">
                    <div>
                        <p class="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">Total Income</p>
                        <p class="font-bold text-green-400 text-lg">${formatMoney(totals.income)}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">Total Expense</p>
                        <p class="font-bold text-red-400 text-lg">${formatMoney(totals.expense)}</p>
                    </div>
                </div>
            </div>
            
            <!-- Details Breakdown -->
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Income Categories</h3>
            <div class="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm mb-6 space-y-1">
                ${renderBreakdownRow('Subscriptions', totals.inc_sub, 'text-green-600', 'bg-green-50')}
                ${renderBreakdownRow('Donations', totals.inc_don, 'text-green-600', 'bg-green-50')}
                ${renderBreakdownRow('For Salary', totals.inc_sal, 'text-green-600', 'bg-green-50')}
                ${renderBreakdownRow('Other', totals.inc_oth, 'text-green-600', 'bg-green-50')}
                ${Object.values(totals).slice(3,7).every(v=>v===0) ? '<p class="text-gray-400 text-sm text-center py-4">No income data matching filter.</p>' : ''}
            </div>

            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Expense Categories</h3>
            <div class="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm mb-6 space-y-1">
                ${renderBreakdownRow('Purchases', totals.exp_pur, 'text-red-500', 'bg-red-50')}
                ${renderBreakdownRow('Salary', totals.exp_sal, 'text-red-500', 'bg-red-50')}
                ${renderBreakdownRow('Electricity', totals.exp_ele, 'text-red-500', 'bg-red-50')}
                ${renderBreakdownRow('Other', totals.exp_oth, 'text-red-500', 'bg-red-50')}
                ${Object.values(totals).slice(7).every(v=>v===0) ? '<p class="text-gray-400 text-sm text-center py-4">No expense data matching filter.</p>' : ''}
            </div>
        `;
    };
    
    // Initial call to render the default "all" state
    updateReport();
}

function renderBreakdownRow(label, amount, textClass, bgClass) {
    if(!amount) return '';
    return `
        <div class="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50">
            <span class="text-sm font-medium text-gray-700">${label}</span>
            <span class="text-sm font-bold ${textClass} ${bgClass} px-2 py-1 rounded-lg">${formatMoney(amount)}</span>
        </div>
    `;
}


// --- MODAL UTILS ---
function showModal(htmlContent) {
    const container = $('modal-container');
    container.innerHTML = `
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm pointer-events-auto transition-opacity duration-300" onclick="closeModal()"></div>
        <div class="relative w-full max-w-md mx-auto pointer-events-auto z-10">
            ${htmlContent}
        </div>
    `;
    container.classList.remove('pointer-events-none');
    currentModal = container;
}

window.closeModal = function() {
    if (!currentModal) return;
    const content = currentModal.lastElementChild;
    const overlay = currentModal.firstElementChild;
    
    // Animation out
    content.firstElementChild.classList.remove('slide-up');
    content.firstElementChild.classList.add('slide-down');
    overlay.style.opacity = '0';
    
    setTimeout(() => {
        currentModal.innerHTML = '';
        currentModal.classList.add('pointer-events-none');
        currentModal = null;
    }, 250); // wait for animation
}

// --- EXPORT EXPERIMENTAL ---
window.exportToExcel = function() {
    if (typeof XLSX === 'undefined') {
        alert("Excel export library is still loading. Please try again in a moment.");
        return;
    }
    
    const incomes = getDb('income', []);
    const expenses = getDb('expense', []);
    
    const incData = incomes.sort((a,b) => new Date(b.date) - new Date(a.date)).map(i => ({
        Date: formatDate(i.date),
        Name: i.name,
        Purpose: i.purpose,
        Amount: i.amount,
        ReceiptNo: i.receiptNo || 'N/A'
    }));
    
    const expData = expenses.sort((a,b) => new Date(b.date) - new Date(a.date)).map(i => ({
        Date: formatDate(i.date),
        Description: i.description,
        Type: i.type,
        Amount: i.amount,
        BillNo: i.billNo || 'N/A'
    }));
    
    const wb = XLSX.utils.book_new();
    
    const wsInc = XLSX.utils.json_to_sheet(incData.length ? incData : [{Message: "No Income"}]);
    XLSX.utils.book_append_sheet(wb, wsInc, "Income");
    
    const wsExp = XLSX.utils.json_to_sheet(expData.length ? expData : [{Message: "No Expense"}]);
    XLSX.utils.book_append_sheet(wb, wsExp, "Expense");
    
    XLSX.writeFile(wb, `Mosque_Transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// --- COMMITTEE MANAGEMENT ---

function renderCommittee(container) {
    const users = getDb('users', USERS);
    
    container.innerHTML = `
        <div class="p-6 slide-up">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800">Committee Members</h2>
                ${currentUser.role === 'admin' ? `
                    <button onclick="openAddCommitteeModal()" class="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        <i class="fa-solid fa-plus mr-1"></i> Add Member
                    </button>
                ` : ''}
            </div>
            
            <div class="space-y-3">
                ${users.map(u => `
                    <div class="bg-white p-4 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full overflow-hidden bg-brand-50 text-brand-500 font-bold flex items-center justify-center text-lg uppercase shadow-inner">
                                ${u.name.substring(0,2)}
                            </div>
                            <div>
                                <p class="font-bold text-gray-800">${u.name}</p>
                                <p class="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <i class="fa-solid fa-phone"></i> ${u.phone || 'N/A'}
                                </p>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'}">${u.role.toUpperCase()}</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-2 flex-wrap justify-end">
                            ${u.phone ? `
                            <a href="tel:${u.phone}" class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                                <i class="fa-solid fa-phone text-xs"></i>
                            </a>
                            <a href="https://wa.me/${u.phone}" target="_blank" class="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors">
                                <i class="fa-brands fa-whatsapp text-sm"></i>
                            </a>
                            ` : ''}
                            ${currentUser.role === 'admin' ? `
                            <button onclick="openAddCommitteeModal('${u.phone}')" class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                                <i class="fa-solid fa-pen text-xs"></i>
                            </button>
                            ${u.phone !== currentUser.phone ? `
                            <button onclick="deleteCommitteeUser('${u.phone}')" class="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                                <i class="fa-solid fa-trash text-xs"></i>
                            </button>
                            ` : ''}
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.openAddCommitteeModal = function(editPhone = null) {
    let u = null;
    if (editPhone && editPhone !== 'undefined' && editPhone !== 'null') {
        const users = getDb('users', USERS);
        u = users.find(x => x.phone === editPhone);
    }
    
    const defName = u ? u.name : '';
    const defPhone = u ? u.phone : '';
    const defRole = u ? u.role : 'user';

    const html = `
        <div class="bg-white w-full rounded-t-3xl p-6 slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-800">${u ? 'Edit Committee Member' : 'Add Committee Member'}</h3>
                <button onclick="closeModal()" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <form onsubmit="saveCommitteeUser(event, ${u ? `'${u.phone}'` : 'null'})" class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                    <input type="text" id="com-name" required value="${defName}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Mobile Number (Login ID)</label>
                    <input type="tel" id="com-phone" required value="${defPhone}" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="10-digit primary number">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Role</label>
                    <select id="com-role" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm bg-white">
                        <option value="user" ${defRole === 'user' ? 'selected' : ''}>User (Can view)</option>
                        <option value="admin" ${defRole === 'admin' ? 'selected' : ''}>Admin (Can edit)</option>
                    </select>
                </div>
                
                <button type="submit" class="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl mt-4 active:scale-[0.98] transition-transform">${u ? 'Update Member' : 'Save Member'}</button>
            </form>
        </div>
    `;
    showModal(html);
};

window.saveCommitteeUser = function(e, editPhone) {
    e.preventDefault();
    const data = {
        name: $('com-name').value.trim(),
        phone: $('com-phone').value.trim(),
        role: $('com-role').value
    };
    
    let users = getDb('users', USERS);
    
    if (editPhone) {
        users = users.map(u => u.phone === editPhone ? data : u);
        if (currentUser.phone === editPhone) {
            currentUser = data;
            setDb('auth_user', data);
        }
    } else {
        if (users.find(u => u.phone === data.phone)) {
            alert("A user with this phone number already exists.");
            return;
        }
        users.push(data);
    }
    
    setDb('users', users);
    closeModal();
    navigate('committee');
};

window.deleteCommitteeUser = function(phone) {
    if (phone === currentUser.phone) {
        alert("You cannot delete your own account.");
        return;
    }
    if (!confirm('Are you sure you want to remove this committee member?')) return;
    
    let users = getDb('users', USERS);
    users = users.filter(u => u.phone !== phone);
    setDb('users', users);
    navigate('committee');
};


// --- INIT APP ---
window.addEventListener('DOMContentLoaded', () => {
    navigate('dashboard');
});
