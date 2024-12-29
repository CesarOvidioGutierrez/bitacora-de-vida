document.addEventListener('DOMContentLoaded', (event) => {
    lucide.createIcons();
    
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-btn');
    const content = document.querySelector('.content');

    function updateSidebarState(collapsed) {
        if (collapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
        
        toggleBtn.innerHTML = !collapsed ? '<i data-lucide="chevron-right"></i>' : '<i data-lucide="chevron-left"></i>';
        lucide.createIcons();
    }

    toggleBtn.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.contains('collapsed');
        updateSidebarState(!isCollapsed);
    });

    // Inicializar el estado del sidebar
    
});
    
    
    /*mis emociones y notas*/
    
    document.addEventListener('DOMContentLoaded', function() {
        // Variables globales
        let selectedEmotion = '';
    
        // Elementos DOM para emociones
        const emojiButtons = document.querySelectorAll('.emoji');
        const addEmotionBtn = document.getElementById('addEmotion');
        const showEmotionProgressBtn = document.getElementById('showEmotionProgress');
        const emotionProgress = document.getElementById('emotionProgress');
        const messageDisplay = document.getElementById('messageDisplay');
    
        // Elementos DOM para notas
        const noteInput = document.getElementById('noteInput');
        const saveNoteBtn = document.getElementById('saveNote');
        const showSavedNotesBtn = document.getElementById('showSavedNotes');
        const savedNotesDiv = document.getElementById('savedNotes');
        let editingNoteId = null;
    
        // Función para mostrar mensajes
        function showMessage(message, isError = false) {
            messageDisplay.textContent = message;
            messageDisplay.className = 'message-display ' + (isError ? 'message-error' : 'message-success');
            setTimeout(() => {
                messageDisplay.textContent = '';
                messageDisplay.className = 'message-display';
            }, 3000);
        }
    
        // Event Listeners para emociones
        emojiButtons.forEach(button => {
            button.addEventListener('click', function() {
                selectedEmotion = this.dataset.emotion;
                // Actualizar visual feedback
                emojiButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    
        // Agregar emoción
        addEmotionBtn.addEventListener('click', function() {
            if (!selectedEmotion) {
                showMessage('Por favor selecciona una emoción', true);
                return;
            }
    
            const emotions = JSON.parse(localStorage.getItem('emotions') || '[]');
            emotions.push({
                emotion: selectedEmotion,
                date: new Date().toISOString()
            });
    
            localStorage.setItem('emotions', JSON.stringify(emotions));
            showMessage(`Emoción "${selectedEmotion}" registrada correctamente`);
    
            // Reset selection
            selectedEmotion = '';
            emojiButtons.forEach(btn => btn.classList.remove('selected'));
    
            // Update chart if visible
            if (!emotionProgress.classList.contains('hidden')) {
                updateEmotionChart();
            }
        });
    
        // Mostrar/ocultar gráfico
        showEmotionProgressBtn.addEventListener('click', function() {
            emotionProgress.classList.toggle('hidden');
            this.textContent = emotionProgress.classList.contains('hidden') 
                ? 'Ver Progreso de Emociones' 
                : 'Ocultar Progreso';
            
            if (!emotionProgress.classList.contains('hidden')) {
                updateEmotionChart();
            }
        });
    
        // Función para actualizar el gráfico
        function updateEmotionChart() {
            const emotions = JSON.parse(localStorage.getItem('emotions') || '[]');
            const emotionCounts = {};
            
            emotions.forEach(entry => {
                emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
            });
    
            const ctx = document.getElementById('emotionChart').getContext('2d');
            
            // Destruir gráfico existente si hay uno
            if (window.emotionChart instanceof Chart) {
                window.emotionChart.destroy();
            }
    
            window.emotionChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(emotionCounts),
                    datasets: [{
                        label: 'Frecuencia de Emociones',
                        data: Object.values(emotionCounts),
                        backgroundColor: [
                            '#2a9d8f',
                            '#e76f51',
                            '#264653',
                            '#f4a261',
                            '#e9c46a'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    
        // === Código de notas (sin cambios) ===
        saveNoteBtn.addEventListener('click', function() {
            const noteText = noteInput.value.trim();
            if (!noteText) {
                alert('Por favor escribe una nota');
                return;
            }
    
            const notes = JSON.parse(localStorage.getItem('notes') || '[]');
            
            if (editingNoteId !== null) {
                const noteIndex = notes.findIndex(note => note.id === editingNoteId);
                if (noteIndex !== -1) {
                    notes[noteIndex].text = noteText;
                }
                editingNoteId = null;
                saveNoteBtn.textContent = 'Guardar Nota';
            } else {
                notes.push({
                    id: Date.now(),
                    text: noteText,
                    date: new Date().toISOString()
                });
            }
    
            localStorage.setItem('notes', JSON.stringify(notes));
            noteInput.value = '';
            displayNotes();
        });
    
        showSavedNotesBtn.addEventListener('click', function() {
            savedNotesDiv.classList.toggle('hidden');
            if (!savedNotesDiv.classList.contains('hidden')) {
                displayNotes();
            }
        });
    
        function displayNotes() {
            const notes = JSON.parse(localStorage.getItem('notes') || '[]');
            savedNotesDiv.innerHTML = notes.map(note => `
                <div class="note-card">
                    <p>${note.text}</p>
                    <small>${new Date(note.date).toLocaleString()}</small>
                    <div class="note-actions">
                        <button onclick="editNote(${note.id})" class="edit-btn">Editar</button>
                        <button onclick="deleteNote(${note.id})" class="delete-btn">Eliminar</button>
                    </div>
                </div>
            `).join('');
        }
    
        window.editNote = function(id) {
            const notes = JSON.parse(localStorage.getItem('notes') || '[]');
            const note = notes.find(note => note.id === id);
            if (note) {
                noteInput.value = note.text;
                editingNoteId = id;
                saveNoteBtn.textContent = 'Actualizar Nota';
                noteInput.focus();
            }
        };
    
        window.deleteNote = function(id) {
            if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
                const notes = JSON.parse(localStorage.getItem('notes') || '[]');
                const filteredNotes = notes.filter(note => note.id !== id);
                localStorage.setItem('notes', JSON.stringify(filteredNotes));
                displayNotes();
            }
        };
    
        // Cargar notas al iniciar
        displayNotes();
    });
      
    /*mis importantes*/
    document.addEventListener('DOMContentLoaded', () => {
        // Funcionalidad para las pestañas
        const tabs = document.querySelectorAll('.u-tab-link');
        const tabContents = document.querySelectorAll('.u-tab-pane');
    
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('u-tab-active'));
                tab.classList.add('active');
                document.querySelector(tab.getAttribute('href')).classList.add('u-tab-active');
            });
        });
    
        // Horas de sueño
        const sleepHoursInput = document.getElementById('sleepHours');
        const addSleepHoursBtn = document.getElementById('addSleepHours');
        const sleepChart = new Chart(document.getElementById('sleepChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Horas de sueño',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    
        addSleepHoursBtn.addEventListener('click', () => {
            const hours = parseFloat(sleepHoursInput.value);
            if (!isNaN(hours)) {
                const date = new Date().toLocaleDateString();
                sleepChart.data.labels.push(date);
                sleepChart.data.datasets[0].data.push(hours);
                sleepChart.update();
                sleepHoursInput.value = '';
                if (hours >= 8) {
                    alert('¡Felicidades! Has dormido 8 horas o más. ¡Sigue así!');
                }
            }
        });
    
        // Ejercicios
        const exerciseNameInput = document.getElementById('exerciseName');
        const exerciseDurationInput = document.getElementById('exerciseDuration');
        const addExerciseBtn = document.getElementById('addExercise');
        const exerciseList = document.getElementById('exerciseList');
    
        addExerciseBtn.addEventListener('click', () => {
            const name = exerciseNameInput.value;
            const duration = exerciseDurationInput.value;
            if (name && duration) {
                const li = document.createElement('li');
                li.textContent = `${name} - ${duration} minutos`;
                const favoriteBtn = document.createElement('button');
                favoriteBtn.textContent = '★';
                favoriteBtn.addEventListener('click', () => {
                    li.classList.toggle('favorite');
                });
                li.appendChild(favoriteBtn);
                exerciseList.appendChild(li);
                exerciseNameInput.value = '';
                exerciseDurationInput.value = '';
            }
        });
    
        // Gastos
        const expenseAmountInput = document.getElementById('expenseAmount');
        const expenseCategoryInput = document.getElementById('expenseCategory');
        const expenseTypeSelect = document.getElementById('expenseType');
        const addExpenseBtn = document.getElementById('addExpense');
        const expenseChart = new Chart(document.getElementById('expenseChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: []
                }]
            }
        });
    
        addExpenseBtn.addEventListener('click', () => {
            const amount = parseFloat(expenseAmountInput.value);
            const category = expenseCategoryInput.value;
            const type = expenseTypeSelect.value;
            if (!isNaN(amount) && category) {
                const index = expenseChart.data.labels.indexOf(category);
                if (index === -1) {
                    expenseChart.data.labels.push(category);
                    expenseChart.data.datasets[0].data.push(amount);
                    expenseChart.data.datasets[0].backgroundColor.push(getRandomColor());
                } else {
                    expenseChart.data.datasets[0].data[index] += type === 'expense' ? amount : -amount;
                }
                expenseChart.update();
                expenseAmountInput.value = '';
                expenseCategoryInput.value = '';
            }
        });
    
        function getRandomColor() {
            return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
        }
    
        // Comidas
        const mealTypeSelect = document.getElementById('mealType');
        const mealDescriptionInput = document.getElementById('mealDescription');
        const addMealBtn = document.getElementById('addMeal');
        const mealList = document.getElementById('mealList');
    
        addMealBtn.addEventListener('click', () => {
            const type = mealTypeSelect.value;
            const description = mealDescriptionInput.value;
            if (description) {
                const li = document.createElement('li');
                li.textContent = `${type}: ${description}`;
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.addEventListener('click', () => {
                    li.remove();
                });
                li.appendChild(deleteBtn);
                mealList.appendChild(li);
                mealDescriptionInput.value = '';
            }
        });
    
        // Check List
        const checklistNameInput = document.getElementById('checklistName');
        const createChecklistBtn = document.getElementById('createChecklist');
        const checklistsContainer = document.getElementById('checklists');
    
        createChecklistBtn.addEventListener('click', () => {
            const name = checklistNameInput.value;
            if (name) {
                const checklist = document.createElement('div');
                checklist.classList.add('checklist');
                checklist.innerHTML = `
                    <h5>${name}</h5>
                    <input type="text" placeholder="Nueva tarea">
                    <button class="add-task">Agregar tarea</button>
                    <ul></ul>
                    <button class="delete-checklist">Eliminar lista</button>
                `;
                checklistsContainer.appendChild(checklist);
                checklistNameInput.value = '';
    
                const taskInput = checklist.querySelector('input');
                const addTaskBtn = checklist.querySelector('.add-task');
                const taskList = checklist.querySelector('ul');
                const deleteChecklistBtn = checklist.querySelector('.delete-checklist');
    
                addTaskBtn.addEventListener('click', () => {
                    const taskText = taskInput.value;
                    if (taskText) {
                        const li = document.createElement('li');
                        li.textContent = taskText;
                        li.addEventListener('click', () => {
                            li.classList.toggle('completed');
                        });
                        const deleteTaskBtn = document.createElement('button');
                        deleteTaskBtn.textContent = 'Eliminar';
                        deleteTaskBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            li.remove();
                        });
                        li.appendChild(deleteTaskBtn);
                        taskList.appendChild(li);
                        taskInput.value = '';
                    }
                });
    
                deleteChecklistBtn.addEventListener('click', () => {
                    checklist.remove();
                });
            }
        });
    });
    