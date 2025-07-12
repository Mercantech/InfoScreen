class WeekSchedule {
    constructor() {
        this.scheduleData = null;
        this.currentWeek = null;
        this.availableWeeks = [];
        this.init();
    }

    async init() {
        try {
            await this.loadScheduleData();
            this.setupEventListeners();
            this.findCurrentWeek();
            this.renderSchedule();
        } catch (error) {
            console.error('Fejl ved indlæsning af ugeprogram:', error);
            this.showError('Der opstod en fejl ved indlæsning af ugeprogrammet.');
        }
    }

    async loadScheduleData() {
        try {
            // Add cache busting parameter to prevent caching
            const timestamp = new Date().getTime();
            const response = await fetch(`data/schedule.json?v=${timestamp}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.scheduleData = await response.json();
            this.availableWeeks = Object.keys(this.scheduleData.weeks);
            this.updateLastUpdated();
        } catch (error) {
            throw new Error('Kunne ikke indlæse ugeprogram data');
        }
    }

    findCurrentWeek() {
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Find the current or next available week
        let selectedWeek = null;
        
        for (const week of this.availableWeeks) {
            const weekData = this.scheduleData.weeks[week];
            const startDate = weekData.dates.start;
            const endDate = weekData.dates.end;
            
            if (currentDate >= startDate && currentDate <= endDate) {
                selectedWeek = week;
                break;
            } else if (currentDate < startDate) {
                selectedWeek = week;
                break;
            }
        }
        
        // If no week found, use the first available week
        if (!selectedWeek && this.availableWeeks.length > 0) {
            selectedWeek = this.availableWeeks[0];
        }
        
        this.currentWeek = selectedWeek;
        this.updateWeekDisplay();
    }

    updateWeekDisplay() {
        if (!this.currentWeek || !this.scheduleData.weeks[this.currentWeek]) {
            return;
        }

        const weekData = this.scheduleData.weeks[this.currentWeek];
        const startDate = new Date(weekData.dates.start);
        const endDate = new Date(weekData.dates.end);

        // Update week selector
        const weekSelect = document.getElementById('weekSelect');
        weekSelect.value = this.currentWeek;

        // Update week badge and date range
        document.getElementById('currentWeek').textContent = `Uge ${this.currentWeek}`;
        document.getElementById('dateRange').textContent = this.formatDateRange(startDate, endDate);

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    formatDateRange(startDate, endDate) {
        const options = { day: 'numeric', month: 'short' };
        const start = startDate.toLocaleDateString('da-DK', options);
        const end = endDate.toLocaleDateString('da-DK', options);
        const year = startDate.getFullYear();
        return `${start} - ${end} ${year}`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevWeek');
        const nextBtn = document.getElementById('nextWeek');
        
        const currentIndex = this.availableWeeks.indexOf(this.currentWeek);
        
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= this.availableWeeks.length - 1;
    }

    renderSchedule() {
        const scheduleGrid = document.getElementById('scheduleGrid');
        const loading = document.getElementById('loading');
        const noData = document.getElementById('noData');

        if (!this.currentWeek || !this.scheduleData.weeks[this.currentWeek]) {
            loading.style.display = 'none';
            noData.style.display = 'block';
            scheduleGrid.innerHTML = '';
            return;
        }

        loading.style.display = 'none';
        noData.style.display = 'none';

        const weekData = this.scheduleData.weeks[this.currentWeek];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const dayNames = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag'];
        const dayIcons = ['fas fa-sun', 'fas fa-cloud-sun', 'fas fa-cloud', 'fas fa-cloud-rain', 'fas fa-star'];
        const timeSlots = ['08:00-09:30', '10:00-11:30', '12:00-13:30', '13:45-15:15'];

        scheduleGrid.innerHTML = '';

        // Create table structure
        const table = document.createElement('div');
        table.className = 'schedule-table';

        // Create table header
        const tableHeader = document.createElement('div');
        tableHeader.className = 'table-header';
        
        // Add time column header
        const timeHeader = document.createElement('div');
        timeHeader.className = 'header-cell time-header';
        timeHeader.innerHTML = 'Tid';
        tableHeader.appendChild(timeHeader);

        // Add day headers
        days.forEach((day, index) => {
            const dayDate = new Date(weekData.dates.start);
            dayDate.setDate(dayDate.getDate() + index);
            const formattedDate = dayDate.toLocaleDateString('da-DK', { 
                day: 'numeric', 
                month: 'short' 
            });

            // Determine if this day is past, present, or future
            const today = new Date();
            const dayStatus = this.getDayStatus(dayDate, today);

            const dayHeader = document.createElement('div');
            dayHeader.className = 'header-cell day-header';
            dayHeader.innerHTML = `
                <div class="day-info">
                    <i class="${this.getStatusIcon(dayStatus)}" title="${this.getStatusText(dayStatus)}"></i>
                    <span class="day-name">${dayNames[index]}</span>
                    <span class="day-date">${formattedDate}</span>
                </div>
            `;
            tableHeader.appendChild(dayHeader);
        });

        table.appendChild(tableHeader);

        // Create table rows for each time slot
        timeSlots.forEach(timeSlot => {
            const tableRow = document.createElement('div');
            tableRow.className = 'table-row';

            // Add time cell
            const timeCell = document.createElement('div');
            timeCell.className = 'table-cell time-cell';
            timeCell.innerHTML = `
                <div class="time-slot-label">
                    <i class="fas fa-clock"></i>
                    ${timeSlot}
                </div>
            `;
            tableRow.appendChild(timeCell);

            // Add activity cells for each day
            days.forEach(day => {
                const dayData = weekData[day];
                const activity = dayData ? dayData[timeSlot] : '';
                
                const activityCell = document.createElement('div');
                activityCell.className = 'table-cell activity-cell';
                
                const isEmpty = !activity || activity.trim() === '';
                const isFree = activity && activity.toUpperCase() === 'FRI';
                
                const cellClass = isEmpty ? 'empty' : isFree ? 'free' : 'filled';
                activityCell.className = `table-cell activity-cell ${cellClass}`;
                
                const activityText = isEmpty ? 'Projekt Arbejde ⚒️' : 
                                   isFree ? 'FRI' : activity;
                
                activityCell.innerHTML = `
                    <div class="activity-content">
                        ${activityText}
                    </div>
                `;
                
                tableRow.appendChild(activityCell);
            });

            table.appendChild(tableRow);
        });

        scheduleGrid.appendChild(table);
    }

    getDayStatus(dayDate, today) {
        // Reset time to compare only dates
        const dayStart = new Date(dayDate);
        dayStart.setHours(0, 0, 0, 0);
        
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        
        if (dayStart < todayStart) {
            return 'past';
        } else if (dayStart.getTime() === todayStart.getTime()) {
            return 'present';
        } else {
            return 'future';
        }
    }

    getStatusIcon(status) {
        switch (status) {
            case 'past':
                return 'fas fa-check-circle';
            case 'present':
                return 'fas fa-play-circle';
            case 'future':
                return 'fas fa-clock';
            default:
                return 'fas fa-question-circle';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'past':
                return 'Afsluttet';
            case 'present':
                return 'I dag';
            case 'future':
                return 'Kommende';
            default:
                return 'Ukendt';
        }
    }


    setupEventListeners() {
        // Week selector
        document.getElementById('weekSelect').addEventListener('change', (e) => {
            this.currentWeek = e.target.value;
            this.updateWeekDisplay();
            this.renderSchedule();
        });

        // Navigation buttons
        document.getElementById('prevWeek').addEventListener('click', () => {
            this.navigateWeek(-1);
        });

        document.getElementById('nextWeek').addEventListener('click', () => {
            this.navigateWeek(1);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only handle arrow keys when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return;
            }

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateWeek(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateWeek(1);
                    break;
            }
        });
    }

    navigateWeek(direction) {
        const currentIndex = this.availableWeeks.indexOf(this.currentWeek);
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.availableWeeks.length) {
            this.currentWeek = this.availableWeeks[newIndex];
            this.updateWeekDisplay();
            this.renderSchedule();
        }
    }

    updateLastUpdated() {
        if (this.scheduleData.metadata && this.scheduleData.metadata.lastUpdated) {
            const date = new Date(this.scheduleData.metadata.lastUpdated);
            const formattedDate = date.toLocaleDateString('da-DK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            document.getElementById('lastUpdated').textContent = formattedDate;
        }
    }

    showError(message) {
        const loading = document.getElementById('loading');
        const noData = document.getElementById('noData');
        
        loading.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Fejl</h3>
            <p>${message}</p>
        `;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeekSchedule();
}); 