/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";
const API_KEY = process.env.API_KEY;
document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('table-body');
    const linkModal = document.getElementById('link-modal');
    const notesModal = document.getElementById('notes-modal');
    const notesModalTitle = document.getElementById('notes-modal-title');
    const notesEditor = document.getElementById('notes-editor');
    const editorToolbar = notesModal.querySelector('.editor-toolbar');
    const linkInput = linkModal.querySelector('#link-input');
    const saveLinkBtn = linkModal.querySelector('#save-link-btn');
    const cancelLinkBtn = linkModal.querySelector('#cancel-link-btn');
    const openLinkPreviewBtn = linkModal.querySelector('#open-link-preview');
    const saveNoteBtn = notesModal.querySelector('#save-note-btn');
    const cancelNoteBtn = notesModal.querySelector('#cancel-note-btn');
    const printNoteBtn = document.getElementById('print-note-btn');
    const deleteNoteBtn = notesModal.querySelector('#delete-note-btn');
    const copyNoteTextBtn = document.getElementById('copy-note-text-btn');
    const searchBar = document.getElementById('search-bar');
    const progressBar = document.getElementById('progress-bar');
    const generateGeminiNotesBtn = document.getElementById('generate-gemini-notes');
    const improveTextBtn = document.getElementById('improve-text-btn');
    // AI Q&A Modal elements
    const askAiBtn = document.getElementById('ask-ai-btn');
    const aiQaModal = document.getElementById('ai-qa-modal');
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiQaLoader = document.getElementById('ai-qa-loader');
    const aiQuestionInput = document.getElementById('ai-question-input');
    const cancelAiQaBtn = document.getElementById('cancel-ai-qa-btn');
    const sendAiQaBtn = document.getElementById('send-ai-qa-btn');
    // Export/Import elements
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file-input');
    // --- Settings UI Elements ---
    const settingsBtn = document.getElementById('settings-btn');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const themeOptions = document.getElementById('theme-options');
    const iconStyleOptions = document.getElementById('icon-options');
    // Confidence Filters
    const confidenceFiltersContainer = document.getElementById('confidence-filters');
    let activeConfidenceFilter = 'all';
    let activeLinkAnchor = null;
    let activeNoteIcon = null;
    let selectedImage = null;
    const grandTotalSpans = {
        fuse: document.getElementById('total-fuse'),
        notion: document.getElementById('total-notion'),
        gemini: document.getElementById('total-gemini'),
        lectura: document.getElementById('total-lectura')
    };
    const grandPercentSpans = {
        fuse: document.getElementById('percent-fuse'),
        notion: document.getElementById('percent-notion'),
        gemini: document.getElementById('percent-gemini'),
        lectura: document.getElementById('percent-lectura')
    };
    const progressRings = {
        fuse: document.getElementById('progress-ring-fuse'),
        notion: document.getElementById('progress-ring-notion'),
        gemini: document.getElementById('progress-ring-gemini'),
        lectura: document.getElementById('progress-ring-lectura'),
    };
    const sections = {};
    document.querySelectorAll('[data-section-header]').forEach(headerEl => {
        const headerRow = headerEl;
        const sectionName = headerRow.dataset.sectionHeader;
        sections[sectionName] = {
            headerRow: headerRow,
            totalRow: document.getElementById(`total-row-${sectionName}`)
        };
    });
    function createLecturaCellContent() {
        const container = document.createElement('div');
        container.classList.add('flex', 'items-center', 'justify-center', 'space-x-1');
        const markSpan = document.createElement('span');
        markSpan.classList.add('mark');
        const greyIcon = document.createElement('span');
        greyIcon.classList.add('note-icon', 'grey-icon');
        greyIcon.dataset.noteType = 'grey';
        greyIcon.innerHTML = `<svg class="solid-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clip-rule="evenodd" /></svg><svg class="outline-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`;
        const blueIcon = document.createElement('span');
        blueIcon.classList.add('note-icon', 'blue-icon');
        blueIcon.dataset.noteType = 'blue';
        blueIcon.innerHTML = `<svg class="solid-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clip-rule="evenodd" /></svg><svg class="outline-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>`;
        container.appendChild(markSpan);
        container.appendChild(greyIcon);
        container.appendChild(blueIcon);
        return container;
    }
    function initializeCells() {
        document.querySelectorAll('td[data-col]').forEach(cellEl => {
            const cell = cellEl;
            const col = cell.dataset.col;
            if (col === 'fuse' || col === 'notion' || col === 'gemini') {
                const container = document.createElement('div');
                container.classList.add('flex', 'items-center', 'justify-center', 'space-x-1', 'h-full');
                const markSpan = document.createElement('span');
                markSpan.classList.add('mark');
                container.appendChild(markSpan);
                const linkAnchor = document.createElement('a');
                linkAnchor.href = '#';
                linkAnchor.target = '_blank';
                linkAnchor.classList.add('link-anchor');
                linkAnchor.style.display = 'none'; // hidden by default
                linkAnchor.title = "Abrir enlace";
                linkAnchor.innerHTML = `<svg class="link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.233 13.06a4.5 4.5 0 0 1 6.364-6.364l3.535 3.536a4.5 4.5 0 0 1-6.364 6.364l-1.06-1.06a.75.75 0 0 1 1.06-1.06l1.06 1.06a3 3 0 0 0 4.243-4.242l-3.536-3.536a3 3 0 0 0-4.242 0l-1.061 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06Zm-1.414-1.414a4.5 4.5 0 0 1-6.364 6.364L.919 14.475a4.5 4.5 0 0 1 6.364-6.364l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a3 3 0 0 0-4.243 4.242l3.536 3.536a3 3 0 0 0 4.242 0l1.061-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06Z" /></svg>`;
                container.appendChild(linkAnchor);
                const editIcon = document.createElement('span');
                editIcon.classList.add('edit-link-icon');
                editIcon.title = "Agregar/editar enlace";
                editIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="link-icon" style="color: #9ca3af" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>`;
                container.appendChild(editIcon);
                cell.appendChild(container);
            }
            else if (col === 'lectura') {
                cell.appendChild(createLecturaCellContent());
            }
        });
        document.querySelectorAll('tr[data-section] td:nth-child(2)').forEach((td) => {
            const topicTextSpan = document.createElement('span');
            topicTextSpan.className = 'topic-text';
            while (td.firstChild) {
                topicTextSpan.appendChild(td.firstChild);
            }
            td.appendChild(topicTextSpan);
            const confidenceContainer = document.createElement('span');
            confidenceContainer.classList.add('ml-2', 'inline-flex', 'items-center', 'align-middle');
            const confidenceDot = document.createElement('span');
            confidenceDot.className = 'confidence-dot';
            confidenceDot.dataset.confidenceLevel = '0'; // 0: none, 1: green, 2: yellow, 3: red
            confidenceDot.title = "Nivel de confianza";
            confidenceContainer.appendChild(confidenceDot);
            td.appendChild(confidenceContainer);
        });
    }
    function updateAllTotals() {
        Object.keys(sections).forEach(sectionName => {
            const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
            const totalRowTds = sections[sectionName].totalRow.querySelectorAll('td');
            let colIndex = 1;
            ['fuse', 'notion', 'gemini', 'lectura'].forEach(col => {
                let sectionCompletedCount = 0;
                sectionRows.forEach(row => {
                    const cell = row.querySelector(`td[data-col="${col}"]`);
                    if (!cell)
                        return;
                    const mark = cell.querySelector('.mark');
                    const valueStr = (mark?.textContent || cell.textContent).trim();
                    if (valueStr === '1' || (col === 'lectura' && valueStr !== '')) {
                        sectionCompletedCount++;
                    }
                });
                totalRowTds[colIndex].textContent = String(sectionCompletedCount);
                colIndex++;
            });
        });
        let totalCompleted = 0;
        ['fuse', 'notion', 'gemini', 'lectura'].forEach(col => {
            let completedCount = 0;
            let applicableCount = 0;
            const cells = document.querySelectorAll(`td[data-col="${col}"]`);
            cells.forEach(cell => {
                const mark = cell.querySelector('.mark');
                const valueStr = (mark?.textContent || cell.textContent).trim();
                if (col === 'lectura') {
                    if (valueStr !== '')
                        completedCount++;
                    applicableCount++;
                }
                else {
                    if (valueStr === '1') {
                        completedCount++;
                        applicableCount++;
                    }
                    else if (valueStr === '0') {
                        applicableCount++;
                    }
                }
            });
            totalCompleted += completedCount;
            const denominator = applicableCount;
            const percentage = denominator > 0 ? Math.round((completedCount / denominator) * 100) : 0;
            grandTotalSpans[col].textContent = String(completedCount);
            grandPercentSpans[col].textContent = `${percentage}%`;
            const ring = progressRings[col];
            if (ring) {
                const radius = ring.r.baseVal.value;
                const circumference = radius * 2 * Math.PI;
                ring.style.strokeDasharray = `${circumference} ${circumference}`;
                const offset = circumference - percentage / 100 * circumference;
                ring.style.strokeDashoffset = String(offset);
            }
        });
        const allCells = document.querySelectorAll('td[data-col]');
        const overallPercentage = allCells.length > 0 ? (totalCompleted / allCells.length) * 100 : 0;
        progressBar.style.width = overallPercentage + '%';
    }
    function updateSectionHeaderCounts() {
        Object.keys(sections).forEach(sectionName => {
            const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
            const count = sectionRows.length;
            const headerRow = sections[sectionName].headerRow;
            if (headerRow) {
                const countElement = headerRow.querySelector('.section-count');
                if (countElement) {
                    countElement.textContent = `(${count})`;
                }
            }
        });
    }
    const loadNote = (icon, noteData, defaultTitle) => {
        if (!noteData) {
            icon.title = defaultTitle;
            return;
        }
        let noteContent, lastModified;
        try {
            const parsed = JSON.parse(noteData);
            if (typeof parsed === 'object' && parsed !== null) {
                noteContent = parsed.content;
                lastModified = parsed.lastModified;
            }
            else {
                noteContent = noteData;
            } // old format
        }
        catch (e) {
            noteContent = noteData;
        } // old format
        icon.dataset.note = typeof noteData === 'string' ? noteData : JSON.stringify(noteData);
        icon.classList.toggle('has-note', !!noteContent && noteContent.trim() !== '');
        if (lastModified) {
            const d = new Date(lastModified);
            const formattedDate = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            icon.title = `${defaultTitle} (Modificado: ${formattedDate})`;
        }
        else {
            icon.title = defaultTitle;
        }
        return noteContent || '';
    };
    tableBody.addEventListener('click', function (e) {
        const target = e.target;
        const sectionHeader = target.closest('.section-header-row');
        if (sectionHeader) {
            const sectionName = sectionHeader.dataset.sectionHeader;
            if (!target.closest('.note-icon')) {
                toggleSection(sectionName);
                saveState();
            }
        }
        const confidenceDot = target.closest('.confidence-dot');
        if (confidenceDot) {
            e.stopPropagation();
            let level = parseInt(confidenceDot.dataset.confidenceLevel || '0', 10);
            level = (level + 1) % 4;
            confidenceDot.dataset.confidenceLevel = String(level);
            applyFiltersAndSearch();
            saveState();
            return;
        }
        const noteIcon = target.closest('.note-icon');
        if (noteIcon) {
            e.stopPropagation();
            activeNoteIcon = noteIcon;
            let topicTitle = '';
            let defaultTooltip = '';
            const noteData = activeNoteIcon.dataset.note || '';
            if (activeNoteIcon.classList.contains('section-note-icon')) {
                const sectionHeader = activeNoteIcon.closest('.section-header-row');
                const sectionTitleEl = sectionHeader?.querySelector('.section-title');
                const sectionTitle = sectionTitleEl ? sectionTitleEl.textContent : 'Sección';
                topicTitle = `Notas para la sección: ${sectionTitle}`;
                defaultTooltip = 'Notas de la sección';
            }
            else {
                const row = activeNoteIcon.closest('tr');
                const topicText = (row?.querySelector('.topic-text'))?.textContent || 'Tema';
                const noteType = activeNoteIcon.dataset.noteType;
                if (noteType === 'grey') {
                    topicTitle = `Esquema para: ${topicText}`;
                    defaultTooltip = 'Esquema';
                }
                else if (noteType === 'blue') {
                    topicTitle = `Desarrollo para: ${topicText}`;
                    defaultTooltip = 'Desarrollo';
                }
                else {
                    topicTitle = `Notas para: ${topicText}`;
                    defaultTooltip = 'Notas';
                }
            }
            notesModalTitle.textContent = topicTitle;
            const content = loadNote(activeNoteIcon, noteData, defaultTooltip);
            notesEditor.innerHTML = content;
            notesModal.classList.add('visible');
            notesEditor.focus();
            return;
        }
        const editLinkIcon = target.closest('.edit-link-icon');
        if (editLinkIcon) {
            e.stopPropagation();
            activeLinkAnchor = editLinkIcon.parentElement.querySelector('.link-anchor');
            if (activeLinkAnchor) {
                const currentHref = activeLinkAnchor.getAttribute('href');
                linkInput.value = (currentHref && currentHref !== '#') ? currentHref : '';
                openLinkPreviewBtn.href = linkInput.value || '#';
                linkModal.classList.add('visible');
                linkInput.focus();
            }
            return;
        }
        const cell = target.closest('td.fillable-cell');
        if (!cell)
            return;
        const col = cell.dataset.col;
        let markElement = cell.querySelector('.mark');
        if (col === 'fuse' || col === 'notion' || col === 'gemini') {
            let currentValue = markElement.textContent.trim();
            if (currentValue === "")
                markElement.textContent = "1";
            else if (currentValue === "1")
                markElement.textContent = "0";
            else
                markElement.textContent = "";
            cell.classList.remove('filled', 'not-done');
            if (markElement.textContent === "1")
                cell.classList.add('filled');
            else if (markElement.textContent === "0")
                cell.classList.add('not-done');
        }
        else if (col === 'lectura') {
            let currentValue = parseInt(markElement.textContent.trim(), 10) || 0;
            currentValue = (currentValue + 1) % 6;
            markElement.textContent = currentValue === 0 ? '' : String(currentValue);
            cell.classList.toggle('lectura-filled', currentValue > 0);
        }
        updateAllTotals();
        saveState();
    });
    // Editor Toolbar Logic
    if (editorToolbar) {
        // Clear and rebuild toolbar
        editorToolbar.innerHTML = `
            <button data-command="bold" title="Negrita"><b>B</b></button>
            <button data-command="italic" title="Cursiva"><i>I</i></button>
            <button data-command="underline" title="Subrayado"><u>U</u></button>
            <button data-command="strikeThrough" title="Tachado"><s>S</s></button>
            <select data-command="fontName" title="Tipo de Fuente" class="w-28 border dark:bg-slate-700 rounded p-1">
                <option>Arial</option><option>Verdana</option><option>Times New Roman</option><option>Georgia</option>
            </select>
            <select data-command="fontSize" title="Tamaño de Letra" class="border dark:bg-slate-700 rounded p-1">
                <option value="1">Pequeña</option><option value="3" selected>Normal</option><option value="5">Grande</option><option value="7">Enorme</option>
            </select>
            <div class="color-palette" data-command="foreColor" title="Color de Texto">
                <span class="color-swatch" style="background-color: #111827;" data-value="#111827"></span>
                <span class="color-swatch" style="background-color: #3B82F6;" data-value="#3B82F6"></span>
                <span class="color-swatch" style="background-color: #22C55E;" data-value="#22C55E"></span>
                <label class="color-swatch custom-color-picker">🎨<input type="color"></label>
            </div>
             <div class="color-palette" data-command="hiliteColor" title="Color de Resaltado">
                <span class="color-swatch" style="background-color: #FEF9C3;" data-value="#FEF9C3"></span>
                <span class="color-swatch" style="background-color: #CFFAFE;" data-value="#CFFAFE"></span>
                <span class="color-swatch" style="background-color: #DCFCE7;" data-value="#DCFCE7"></span>
                <label class="color-swatch custom-color-picker">🎨<input type="color" value="#FFFF00"></label>
            </div>
            <button data-command="insertUnorderedList" title="Lista Viñetas"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clip-rule="evenodd" /></svg></button>
            <button data-command="insertOrderedList" title="Lista Numerada"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 4a.75.75 0 01.75-.75h.5a.75.75 0 01.75.75v.5c0 .414-.336.75-.75.75h-.5A.75.75 0 012 4.5v-.5zM2.75 8.25a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2 14a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 14zM4.5 4.25a.75.75 0 000-1.5H2.75a.75.75 0 000 1.5h1.75z" clip-rule="evenodd" /></svg></button>
            <button data-command="indent" title="Aumentar Sangría"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4.75A.75.75 0 013.75 4h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 4.75zM3 10a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10zm0 5.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 01-.75-.75zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd" transform="translate(-5, 0) scale(1.4, 1)" /></svg></button>
            <button data-command="outdent" title="Disminuir Sangría"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4.75A.75.75 0 013.75 4h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 4.75zM3 10a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10zm0 5.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 01-.75-.75zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd" transform="translate(-1, 0) scale(1.4, 1) rotate(180 10 10)" /></svg></button>
            <button data-command="insertImage" title="Insertar Imagen">🏞️</button>
            <button data-command="undo" title="Deshacer">↶</button>
            <button data-command="redo" title="Rehacer">↷</button>
            <button id="improve-text-btn" title="Mejorar texto con IA">✨</button>
        `;
        editorToolbar.addEventListener('mousedown', (e) => {
            const target = e.target;
            if (target.closest('button[data-command]')) {
                e.preventDefault();
            }
        });
        editorToolbar.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-command]');
            if (button) {
                const command = button.dataset.command;
                if (command === 'insertImage') {
                    const url = prompt('Ingresa la URL de la imagen:');
                    if (url && url.trim()) {
                        notesEditor.focus();
                        document.execCommand(command, false, url);
                    }
                }
                else if (command) {
                    document.execCommand(command, false, button.dataset.value || null);
                }
            }
        });
        editorToolbar.addEventListener('change', (e) => {
            const target = e.target;
            if (target.matches('select[data-command]')) {
                document.execCommand(target.dataset.command, false, target.value);
            }
        });
        document.querySelectorAll('.color-palette').forEach(palette => {
            const command = palette.dataset.command;
            const customPickerInput = palette.querySelector('input[type="color"]');
            palette.addEventListener('click', (e) => {
                const swatch = e.target.closest('.color-swatch');
                if (swatch && !swatch.dataset.value) {
                    return;
                } // ignore custom picker container
                if (swatch && !swatch.classList.contains('custom-color-picker')) {
                    notesEditor.focus();
                    document.execCommand(command, false, swatch.dataset.value);
                }
            });
            if (customPickerInput) {
                customPickerInput.addEventListener('input', (e) => {
                    notesEditor.focus();
                    document.execCommand(command, false, e.target.value);
                }, false);
            }
        });
    }
    if (copyNoteTextBtn) {
        copyNoteTextBtn.addEventListener('click', () => { navigator.clipboard.writeText(notesEditor.innerText).then(() => { /* ... */ }); });
    }
    notesEditor.addEventListener('click', (e) => {
        document.querySelectorAll('#notes-editor img').forEach(img => img.classList.remove('selected-img'));
        if (e.target.tagName === 'IMG') {
            selectedImage = e.target;
            selectedImage.classList.add('selected-img');
        }
        else {
            selectedImage = null;
        }
    });
    if (printNoteBtn) {
        printNoteBtn.addEventListener('click', () => { /* ... */ });
    }
    if (deleteNoteBtn) {
        deleteNoteBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.')) {
                notesEditor.innerHTML = '';
                if (activeNoteIcon) {
                    const noteObject = { content: '', lastModified: new Date().toISOString() };
                    const noteData = JSON.stringify(noteObject);
                    activeNoteIcon.dataset.note = noteData;
                    activeNoteIcon.classList.remove('has-note');
                    let baseTitle = activeNoteIcon.dataset.noteType === 'grey' ? 'Esquema' : (activeNoteIcon.dataset.noteType === 'blue' ? 'Desarrollo' : 'Notas de la sección');
                    activeNoteIcon.title = baseTitle;
                    saveState();
                }
                closeNotesModal();
            }
        });
    }
    function closeLinkModal() { if (linkModal)
        linkModal.classList.remove('visible'); activeLinkAnchor = null; }
    function closeNotesModal() { if (notesModal)
        notesModal.classList.remove('visible'); activeNoteIcon = null; }
    if (linkInput)
        linkInput.addEventListener('input', function () { openLinkPreviewBtn.href = this.value || '#'; });
    if (saveLinkBtn)
        saveLinkBtn.addEventListener('click', function () { /* ... */ closeLinkModal(); });
    if (cancelLinkBtn)
        cancelLinkBtn.addEventListener('click', closeLinkModal);
    linkModal.addEventListener('click', (e) => { if (e.target === linkModal)
        closeLinkModal(); });
    if (saveNoteBtn)
        saveNoteBtn.addEventListener('click', function () {
            if (activeNoteIcon) {
                const noteText = notesEditor.innerHTML;
                const noteObject = { content: noteText, lastModified: new Date().toISOString() };
                const noteData = JSON.stringify(noteObject);
                activeNoteIcon.dataset.note = noteData;
                activeNoteIcon.classList.toggle('has-note', noteText.trim() !== '');
                let baseTitle = activeNoteIcon.dataset.noteType === 'grey' ? 'Esquema' : (activeNoteIcon.dataset.noteType === 'blue' ? 'Desarrollo' : 'Notas de la sección');
                loadNote(activeNoteIcon, noteData, baseTitle); // This will update the tooltip correctly
                saveState();
                const confirmation = document.getElementById('save-confirmation');
                if (confirmation) {
                    confirmation.classList.remove('opacity-0');
                    setTimeout(() => { confirmation.classList.add('opacity-0'); }, 2000);
                }
            }
        });
    if (cancelNoteBtn)
        cancelNoteBtn.addEventListener('click', closeNotesModal);
    notesModal.addEventListener('click', (e) => { if (e.target.id === 'notes-modal')
        closeNotesModal(); });
    function toggleSection(sectionName) {
        const headerRow = sections[sectionName].headerRow;
        headerRow.classList.toggle('collapsed');
        const isCollapsed = headerRow.classList.contains('collapsed');
        let currentRow = headerRow.nextElementSibling;
        while (currentRow && !currentRow.hasAttribute('data-section-header')) {
            if (currentRow.matches('tr[data-section]')) { // only toggle topic rows
                currentRow.style.display = isCollapsed ? 'none' : '';
            }
            currentRow = currentRow.nextElementSibling;
        }
        applyFiltersAndSearch(); // Re-apply filters after toggling
    }
    function applyFiltersAndSearch() {
        const searchTerm = searchBar.value.toLowerCase().trim();
        document.querySelectorAll('tr[data-section]').forEach(row => {
            const sectionName = row.dataset.section;
            const headerRow = sections[sectionName].headerRow;
            if (headerRow.classList.contains('collapsed')) {
                row.style.display = 'none';
                return;
            }
            const topicText = row.querySelector('.topic-text')?.textContent?.toLowerCase() || '';
            const searchMatch = topicText.includes(searchTerm);
            let filterMatch = false;
            if (activeConfidenceFilter === 'all') {
                filterMatch = true;
            }
            else {
                const confidenceDot = row.querySelector('.confidence-dot');
                if (confidenceDot && confidenceDot.dataset.confidenceLevel === activeConfidenceFilter) {
                    filterMatch = true;
                }
            }
            row.style.display = searchMatch && filterMatch ? '' : 'none';
        });
        Object.keys(sections).forEach(sectionName => {
            const sectionRows = document.querySelectorAll(`tr[data-section="${sectionName}"]`);
            const isAnyRowVisible = Array.from(sectionRows).some(row => row.style.display !== 'none');
            const headerRow = sections[sectionName].headerRow;
            const totalRow = sections[sectionName].totalRow;
            if (headerRow)
                headerRow.style.display = isAnyRowVisible || !searchBar.value ? '' : 'none';
            if (totalRow)
                totalRow.style.display = isAnyRowVisible || !searchBar.value ? '' : 'none';
        });
    }
    searchBar.addEventListener('input', applyFiltersAndSearch);
    confidenceFiltersContainer.addEventListener('click', (e) => {
        const target = e.target;
        const filterButton = target.closest('.filter-btn');
        if (!filterButton)
            return;
        confidenceFiltersContainer.querySelector('.active')?.classList.remove('active');
        filterButton.classList.add('active');
        activeConfidenceFilter = filterButton.dataset.filter || 'all';
        applyFiltersAndSearch();
    });
    // --- Gemini AI Integration ---
    async function callGemini(prompt) { /* ... */ }
    if (generateGeminiNotesBtn) {
        generateGeminiNotesBtn.addEventListener('click', async () => { /* ... */ });
    }
    if (improveTextBtn) {
        improveTextBtn.addEventListener('click', async () => { /* ... */ });
    }
    // --- AI Q&A Logic ---
    function stripHtml(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
    function gatherAllContent() {
        const content = [];
        Object.keys(sections).forEach(sectionName => {
            var _a, _b, _c, _d;
            const section = sections[sectionName];
            const sectionTitle = (_a = section.headerRow.querySelector('.section-title')) === null || _a === void 0 ? void 0 : _a.textContent.trim();
            if (sectionTitle) {
                content.push(`\n## Section: ${sectionTitle}\n`);
            }
            const sectionNoteIcon = section.headerRow.querySelector('.section-note-icon.has-note');
            if (sectionNoteIcon) {
                const noteData = sectionNoteIcon.dataset.note || '';
                if (noteData) {
                    try {
                        const parsed = JSON.parse(noteData);
                        if (parsed.content) {
                            content.push(`- Section Note: ${stripHtml(parsed.content)}`);
                        }
                    }
                    catch (e) {
                        content.push(`- Section Note: ${stripHtml(noteData)}`);
                    }
                }
            }
            document.querySelectorAll(`tr[data-section="${sectionName}"]`).forEach(row => {
                var _a;
                const topic = (_a = row.querySelector('.topic-text')) === null || _a === void 0 ? void 0 : _a.textContent.trim();
                if (topic) {
                    content.push(`### Topic: ${topic}`);
                }
                row.querySelectorAll('.note-icon.has-note').forEach(icon => {
                    const noteData = icon.dataset.note || '';
                    if (noteData) {
                        try {
                            const parsed = JSON.parse(noteData);
                            let noteType = 'Note';
                            if (icon.classList.contains('grey-icon')) {
                                noteType = 'Esquema';
                            }
                            else if (icon.classList.contains('blue-icon')) {
                                noteType = 'Desarrollo';
                            }
                            if (parsed.content) {
                                content.push(`- ${noteType}: ${stripHtml(parsed.content)}`);
                            }
                        }
                        catch (e) {
                            content.push(`- Note: ${stripHtml(noteData)}`);
                        }
                    }
                });
            });
        });
        return content.join('\n');
    }
    function openAiQaModal() { aiQaModal.classList.add('visible'); }
    function closeAiQaModal() { aiQaModal.classList.remove('visible'); }
    askAiBtn.addEventListener('click', openAiQaModal);
    cancelAiQaBtn.addEventListener('click', closeAiQaModal);
    aiQaModal.addEventListener('click', (e) => { if (e.target === aiQaModal)
        closeAiQaModal(); });
    sendAiQaBtn.addEventListener('click', async () => { /* ... */ });
    // --- Data Persistence ---
    const STORAGE_KEY = 'temarioMedicinaInternaData';
    function saveState() {
        const collapsedSections = [];
        document.querySelectorAll('.section-header-row.collapsed').forEach(header => {
            if (header.dataset.sectionHeader) {
                collapsedSections.push(header.dataset.sectionHeader);
            }
        });
        const sectionNotes = {};
        document.querySelectorAll('.section-note-icon').forEach(icon => {
            var _a;
            const sectionName = (_a = icon.closest('.section-header-row')) === null || _a === void 0 ? void 0 : _a.dataset.sectionHeader;
            if (sectionName) {
                sectionNotes[sectionName] = icon.dataset.note || '';
            }
        });
        const data = {
            headers: [],
            rows: [],
            collapsedSections,
            sectionNotes,
            appTheme: document.documentElement.dataset.theme || 'default',
            iconStyle: document.documentElement.dataset.iconStyle || 'solid',
        };
        document.querySelectorAll('thead th[contenteditable="true"]').forEach(th => { data.headers.push(th.textContent); });
        document.querySelectorAll('#table-body tr[data-section]').forEach((row, index) => {
            const rowData = {
                id: index, cells: {}, confidenceLevel: '0'
            };
            row.querySelectorAll('td[data-col]').forEach(cell => {
                const col = cell.dataset.col;
                if (col === 'lectura') {
                    const value = cell.querySelector('.mark').textContent;
                    const noteGrey = cell.querySelector('.grey-icon').dataset.note || '';
                    const noteBlue = cell.querySelector('.blue-icon').dataset.note || '';
                    rowData.cells[col] = { value, noteGrey, noteBlue };
                }
                else {
                    const value = cell.querySelector('.mark').textContent;
                    const link = cell.querySelector('a.link-anchor').getAttribute('href');
                    rowData.cells[col] = { value, link };
                }
            });
            const notesCell = row.querySelector('.notes-cell');
            if (notesCell)
                rowData.cells.notes = notesCell.textContent;
            const confidenceDot = row.querySelector('.confidence-dot');
            if (confidenceDot)
                rowData.confidenceLevel = confidenceDot.dataset.confidenceLevel;
            data.rows.push(rowData);
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    function loadState(dataToLoad) {
        const savedData = dataToLoad ? null : localStorage.getItem(STORAGE_KEY);
        if (!savedData && !dataToLoad)
            return;
        const data = dataToLoad || JSON.parse(savedData);
        if (!data)
            return;
        if (data.appTheme) {
            applyAppTheme(data.appTheme, data.appTheme === 'default');
        }
        if (data.iconStyle) {
            applyIconStyle(data.iconStyle);
        }
        const headers = document.querySelectorAll('thead th[contenteditable="true"]');
        if (data.headers && data.headers.length === headers.length) {
            headers.forEach((th, i) => { th.textContent = data.headers[i]; });
        }
        if (data.sectionNotes) {
            Object.keys(data.sectionNotes).forEach(sectionName => {
                const icon = document.querySelector(`.section-header-row[data-section-header="${sectionName}"] .section-note-icon`);
                if (icon) {
                    loadNote(icon, data.sectionNotes[sectionName], 'Notas de la sección');
                }
            });
        }
        const rows = document.querySelectorAll('#table-body tr[data-section]');
        if (data.rows && data.rows.length === rows.length) {
            rows.forEach((row, index) => {
                const rowData = data.rows[index];
                if (!rowData)
                    return;
                Object.keys(rowData.cells).forEach(col => {
                    const cell = row.querySelector(`td[data-col="${col}"]`);
                    const cellData = rowData.cells[col];
                    if (cell) {
                        const markElement = cell.querySelector('.mark');
                        if (col === 'lectura') {
                            if (markElement)
                                markElement.textContent = cellData.value;
                            cell.classList.toggle('lectura-filled', cellData.value !== '');
                            const greyIcon = cell.querySelector('.grey-icon');
                            const blueIcon = cell.querySelector('.blue-icon');
                            if (greyIcon) {
                                loadNote(greyIcon, cellData.noteGrey, 'Esquema');
                            }
                            if (blueIcon) {
                                loadNote(blueIcon, cellData.noteBlue, 'Desarrollo');
                            }
                        }
                        else {
                            if (markElement)
                                markElement.textContent = cellData.value;
                            cell.classList.toggle('filled', cellData.value === '1');
                            cell.classList.toggle('not-done', cellData.value === '0');
                            const linkElement = cell.querySelector('a.link-anchor');
                            if (linkElement && cellData.link && cellData.link !== '#') {
                                linkElement.setAttribute('href', cellData.link);
                                linkElement.style.display = 'inline-flex';
                            }
                        }
                    }
                    else if (col === 'notes') {
                        const notesCell = row.querySelector('.notes-cell');
                        if (notesCell)
                            notesCell.textContent = cellData;
                    }
                });
                if (rowData.confidenceLevel) {
                    const thumb = row.querySelector(`.confidence-dot`);
                    if (thumb)
                        thumb.dataset.confidenceLevel = rowData.confidenceLevel;
                }
            });
        }
        if (data.collapsedSections) {
            data.collapsedSections.forEach((sectionName) => {
                const header = document.querySelector(`.section-header-row[data-section-header="${sectionName}"]`);
                if (header && !header.classList.contains('collapsed')) {
                    toggleSection(sectionName);
                }
            });
        }
        updateAllTotals();
        updateSectionHeaderCounts();
    }
    // --- Export/Import Logic ---
    if (exportBtn) {
        exportBtn.addEventListener('click', () => { /* ... */ });
    }
    if (importBtn) {
        importBtn.addEventListener('click', () => { importFileInput.click(); });
    }
    if (importFileInput) {
        importFileInput.addEventListener('change', (event) => { /* ... */ });
    }
    // --- Theme & Style Logic ---
    function applyAppTheme(theme, isDefault = false) {
        document.documentElement.dataset.theme = theme;
        if (isDefault) {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', prefersDark);
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }
    function applyIconStyle(style) {
        document.documentElement.dataset.iconStyle = style;
    }
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.classList.toggle('hidden');
        });
    }
    document.addEventListener('click', (e) => {
        if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
            settingsDropdown.classList.add('hidden');
        }
    });
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const theme = e.currentTarget.dataset.theme;
            applyAppTheme(theme, theme === 'default');
            saveState();
            settingsDropdown.classList.add('hidden');
        });
    });
    document.querySelectorAll('.icon-style-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const style = e.currentTarget.dataset.style;
            applyIconStyle(style);
            saveState();
            settingsDropdown.classList.add('hidden');
        });
    });
    // Initialize
    initializeCells();
    loadState();
    // Auto-save listeners
    tableBody.addEventListener('input', (e) => {
        const target = e.target;
        if (target.closest('.notes-cell') || target.closest('.topic-text')) {
            saveState();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLinkModal();
            closeNotesModal();
            closeAiQaModal();
            settingsDropdown.classList.add('hidden');
        }
    });
});
