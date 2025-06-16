// Sample data for planting activities
let plantingActivities = [
  { id: 1, date: '2024-05-01', farm: 'Farm 1', paddock: 'Field A', crop: 'Corn', variety: 'Hybrid A', activity: 'Direct Seeding', seedAmount: 250, responsable: 'John Doe', status: 'Completed' },
  { id: 2, date: '2024-05-03', farm: 'Farm 2', paddock: 'Field B', crop: 'Soybean', variety: 'Variety X', activity: 'Transplanting', seedAmount: 180, responsable: 'Jane Smith', status: 'Completed' },
  { id: 3, date: '2024-05-05', farm: 'Farm 1', paddock: 'Field C', crop: 'Corn', variety: 'Hybrid B', activity: 'Direct Seeding', seedAmount: 300, responsable: 'Carlos Ruiz', status: 'In Progress' },
  { id: 4, date: '2024-05-07', farm: 'Farm 3', paddock: 'Field A', crop: 'Wheat', variety: 'Spring', activity: 'Transplanting', seedAmount: 220, responsable: 'Amina Patel', status: 'Pending' },
  { id: 5, date: '2024-05-10', farm: 'Farm 2', paddock: 'Field B', crop: 'Soybean', variety: 'Variety X', activity: 'Direct Seeding', seedAmount: 200, responsable: 'John Doe', status: 'Completed' },
  { id: 6, date: '2024-05-12', farm: 'Farm 4', paddock: 'Field C', crop: 'Corn', variety: 'Hybrid A', activity: 'Transplanting', seedAmount: 270, responsable: 'Jane Smith', status: 'Completed' },
  { id: 7, date: '2024-05-15', farm: 'Farm 3', paddock: 'Field A', crop: 'Wheat', variety: 'Spring', activity: 'Direct Seeding', seedAmount: 150, responsable: 'Carlos Ruiz', status: 'Completed' },
  { id: 8, date: '2024-05-18', farm: 'Farm 1', paddock: 'Field B', crop: 'Corn', variety: 'Hybrid B', activity: 'Transplanting', seedAmount: 230, responsable: 'Amina Patel', status: 'In Progress' }
];

let currentSort = { column: 'date', direction: 'desc' };
let seedRate = 100; // Default seed rate in kg/ha

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // plantingActivities.forEach(activity => {
    //     activity.seedAmount = (activity.area * seedRate).toFixed(2);
    // });
    updateFilters();
    renderPlantingActivitiesTable();
    updateCharts();
    setupEventListeners();
    loadSettings();
});

// Setup event listeners
function setupEventListeners() {
    // Activities tab filter buttons
    const applyActivitiesBtn = document.getElementById('applyActivitiesFilters');
    const resetActivitiesBtn = document.getElementById('resetActivitiesFilters');
    if (applyActivitiesBtn) {
        applyActivitiesBtn.addEventListener('click', filterActivities);
    }
    if (resetActivitiesBtn) {
        resetActivitiesBtn.addEventListener('click', function() {
            ['activitiesFarmFilter','activitiesPaddockFilter','activitiesResponsableFilter','activitiesDateRangeFilter','activitiesCropFilter','activitiesVarietyFilter'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            filterActivities();
        });
    }
    // Reports tab filter buttons
    const applyReportBtn = document.getElementById('applyFilters');
    const resetReportBtn = document.getElementById('resetFilters');
    if (applyReportBtn) {
        applyReportBtn.addEventListener('click', updateCharts);
    }
    if (resetReportBtn) {
        resetReportBtn.addEventListener('click', function() {
            ['farmFilter','paddockFilter','responsableFilter','dateRangeFilter','cropFilter','varietyFilter'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            updateCharts();
        });
    }
    // Table sorting
    document.querySelectorAll('#plantingActivitiesTable th.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }
            renderPlantingActivitiesTable();
        });
    });
}

// Update filters
function updateFilters() {
    const farms = [...new Set(plantingActivities.map(a => a.farm))];
    const paddocks = [...new Set(plantingActivities.map(a => a.paddock))];
    const responsables = [...new Set(plantingActivities.map(a => a.responsable))];
    const crops = [...new Set(plantingActivities.map(a => a.crop))];
    const varieties = [...new Set(plantingActivities.map(a => a.variety))];
    // Activities tab
    updateFilterDropdown('activitiesFarmFilter', farms);
    updateFilterDropdown('activitiesPaddockFilter', paddocks);
    updateFilterDropdown('activitiesResponsableFilter', responsables);
    updateFilterDropdown('activitiesCropFilter', crops);
    updateFilterDropdown('activitiesVarietyFilter', varieties);
    // Reports tab
    updateFilterDropdown('farmFilter', farms);
    updateFilterDropdown('paddockFilter', paddocks);
    updateFilterDropdown('responsableFilter', responsables);
    updateFilterDropdown('cropFilter', crops);
    updateFilterDropdown('varietyFilter', varieties);
}

function updateFilterDropdown(id, values) {
    const select = document.getElementById(id);
    if (!select) return;
    let currentValue = select.value;
    select.innerHTML = '<option value="">All</option>';
    values.sort().forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
    if (!currentValue) currentValue = '';
    select.value = currentValue;
}

// Filter activities
function filterActivities() {
    const filters = {
        farm: document.getElementById('activitiesFarmFilter').value,
        paddock: document.getElementById('activitiesPaddockFilter').value,
        responsable: document.getElementById('activitiesResponsableFilter').value,
        dateRange: document.getElementById('activitiesDateRangeFilter').value,
        crop: document.getElementById('activitiesCropFilter').value,
        variety: document.getElementById('activitiesVarietyFilter').value
    };
    let filtered = plantingActivities.filter(activity => {
        if (filters.farm && activity.farm !== filters.farm) return false;
        if (filters.paddock && activity.paddock !== filters.paddock) return false;
        if (filters.responsable && activity.responsable !== filters.responsable) return false;
        if (filters.crop && activity.crop !== filters.crop) return false;
        if (filters.variety && activity.variety !== filters.variety) return false;
        if (filters.dateRange !== 'all') {
            const activityDate = new Date(activity.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            switch (filters.dateRange) {
                case 'today': return activityDate.getTime() === today.getTime();
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return activityDate.getTime() === yesterday.getTime();
                case 'last7':
                    const last7 = new Date(today);
                    last7.setDate(last7.getDate() - 7);
                    return activityDate >= last7;
                case 'last30':
                    const last30 = new Date(today);
                    last30.setDate(last30.getDate() - 30);
                    return activityDate >= last30;
                case 'last90':
                    const last90 = new Date(today);
                    last90.setDate(last90.getDate() - 90);
                    return activityDate >= last90;
            }
        }
        return true;
    });
    renderPlantingActivitiesTable(filtered);
}

// Render table
function renderPlantingActivitiesTable(activities = plantingActivities) {
    const tbody = document.querySelector('#plantingActivitiesTable tbody');
    tbody.innerHTML = '';

    activities.sort((a, b) => {
        let aVal = a[currentSort.column];
        let bVal = b[currentSort.column];

        if (currentSort.column === 'date') {
            aVal = new Date(a.date);
            bVal = new Date(b.date);
        } else if (currentSort.column === 'seedAmount') {
            aVal = parseFloat(a.seedAmount);
            bVal = parseFloat(b.seedAmount);
        }

        return currentSort.direction === 'asc' ? 
            (aVal > bVal ? 1 : -1) : 
            (aVal < bVal ? 1 : -1);
    });

    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(activity.date).toLocaleDateString()}</td>
            <td>${activity.farm}</td>
            <td>${activity.paddock}</td>
            <td>${activity.crop}</td>
            <td>${activity.variety}</td>
            <td>${activity.seedAmount} kg</td>
            <td><span class="badge bg-success">${activity.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-success view-activity" data-id="${activity.id}">
                    View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add view button handlers
    document.querySelectorAll('.view-activity').forEach(button => {
        button.addEventListener('click', () => {
            const activityId = button.dataset.id;
            const activity = plantingActivities.find(a => a.id === activityId);
            if (activity) {
                // TODO: Implement view modal
                alert(`Viewing activity: ${activity.activity} on ${activity.date}`);
            }
        });
    });
}

// Update charts
function updateCharts() {
    const filters = {
        farm: document.getElementById('farmFilter').value,
        paddock: document.getElementById('paddockFilter').value,
        responsable: document.getElementById('responsableFilter').value,
        dateRange: document.getElementById('dateRangeFilter').value,
        crop: document.getElementById('cropFilter').value,
        variety: document.getElementById('varietyFilter').value
    };
    let filtered = plantingActivities.filter(activity => {
        if (filters.farm && activity.farm !== filters.farm) return false;
        if (filters.paddock && activity.paddock !== filters.paddock) return false;
        if (filters.responsable && activity.responsable !== filters.responsable) return false;
        if (filters.crop && activity.crop !== filters.crop) return false;
        if (filters.variety && activity.variety !== filters.variety) return false;
        if (filters.dateRange !== 'all') {
            const activityDate = new Date(activity.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            switch (filters.dateRange) {
                case 'today': return activityDate.getTime() === today.getTime();
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return activityDate.getTime() === yesterday.getTime();
                case 'last7':
                    const last7 = new Date(today);
                    last7.setDate(last7.getDate() - 7);
                    return activityDate >= last7;
                case 'last30':
                    const last30 = new Date(today);
                    last30.setDate(last30.getDate() - 30);
                    return activityDate >= last30;
                case 'last90':
                    const last90 = new Date(today);
                    last90.setDate(last90.getDate() - 90);
                    return activityDate >= last90;
            }
        }
        return true;
    });

    // Monthly Planted Chart (Time Series)
    updateMonthlyPlantedChart(filtered);
    // Pie Charts
    updatePieChart(filtered, 'paddock', 'paddockDistributionChart');
    updatePieChart(filtered, 'farm', 'farmDistributionChart');
    updatePieChart(filtered, 'responsable', 'responsableDistributionChart');
    updatePieChart(filtered, 'crop', 'cropDistributionChart');
    updatePieChart(filtered, 'variety', 'varietyDistributionChart');
    updatePieChart(filtered, 'seedType', 'seedTypeDistributionChart');
}

function updateMonthlyPlantedChart(activities) {
    const ctx = document.getElementById('monthlyPlantedChart').getContext('2d');
    if (window.monthlyPlantedChartInstance) window.monthlyPlantedChartInstance.destroy();
    // Group by month
    const monthMap = {};
    activities.forEach(a => {
        const d = new Date(a.date);
        const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (!monthMap[ym]) monthMap[ym] = 0;
        monthMap[ym] += parseFloat(a.seedAmount);
    });
    const months = Object.keys(monthMap).sort();
    const labels = months.map(ym => {
        const [y, m] = ym.split('-');
        return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m)-1]} ${y}`;
    });
    const data = months.map(ym => monthMap[ym]);
    window.monthlyPlantedChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Planted (kg)',
                data: data,
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255,152,0,0.15)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Planted (kg)' } } }
        }
    });
}

function updatePieChart(activities, groupBy, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window[canvasId + 'Instance']) window[canvasId + 'Instance'].destroy();
    let groupMap = {};
    activities.forEach(a => {
        const key = a[groupBy];
        if (!groupMap[key]) groupMap[key] = 0;
        groupMap[key] += parseFloat(a.seedAmount);
    });
    const labels = Object.keys(groupMap);
    const data = Object.values(groupMap);
    const colors = [
        '#ffd23f','#6ec6ff','#ff6f91','#8bc34a','#ffb300','#ab47bc','#ff7043','#00bcd4','#f06292','#cddc39','#ff8a65'
    ];
    window[canvasId + 'Instance'] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.parsed || 0;
                            return label + ': ' + value + ' kg';
                        }
                    }
                }
            }
        }
    });
}

// Load settings from localStorage
function loadSettings() {
    const savedSeedRate = localStorage.getItem('plantingSeedRate');
    if (savedSeedRate) {
        seedRate = parseFloat(savedSeedRate);
        document.getElementById('seedRate').value = seedRate;
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('plantingSeedRate', seedRate.toString());
} 