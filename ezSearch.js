// DOM Elements
const searchInput = document.getElementById('searchLinks');
const linkList = document.getElementById('linkList');
const noLinksMessage = document.getElementById('noLinksMessage');
const noSearchResultsMessage = document.getElementById('noSearchResultsMessage');

const linkFormModal = document.getElementById('linkFormModal');
const linkUrlModalInput = document.getElementById('linkUrlModal');
const linkTitleModalInput = document.getElementById('linkTitleModal');
const linkTagsModalInput = document.getElementById('linkTagsModal');
const linkCustomFaviconUrlModalInput = document.getElementById('linkCustomFaviconUrlModal');
const linkBase64FaviconModal = document.getElementById('linkBase64FaviconModal');
const addLinkBtnModal = document.getElementById('addLinkBtnModal');
const updateLinkBtnModal = document.getElementById('updateLinkBtnModal');
const cancelEditBtnModal = document.getElementById('cancelEditBtnModal');
const advancedOptionsHeaderModal = document.getElementById('advancedOptionsHeaderModal');
const advancedOptionsContentModal = document.getElementById('advancedOptionsContentModal');
const advancedOptionsToggleIconModal = document.getElementById('advancedOptionsToggleIconModal');

const darkModeToggle = document.getElementById('darkModeToggle');
const mainTitle = document.getElementById('mainTitle'); // For meme color change

// Export/Import Buttons
const exportLinksBtn = document.getElementById('exportLinksBtn');
const importLinksBtn = document.getElementById('importLinksBtn');
const importFileInput = document.getElementById('importFileInput');

// Custom Modal Elements
const customModal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

// New Import Type Selection Modal Elements
const importTypeModal = document.getElementById('importTypeModal');
const importTypeEZSearchBtn = document.getElementById('importTypeEZSearchBtn');
const importTypeChromeBtn = document.getElementById('importTypeChromeBtn');
const importTypeCancelBtn = document.getElementById('importTypeCancelBtn');

// Duplicate Handling Modal Elements (NEW)
const duplicateHandlingModal = document.getElementById('duplicateHandlingModal');
const duplicateHandlingModalTitle = document.getElementById('duplicateHandlingModalTitle');
const duplicateHandlingModalMessage = document.getElementById('duplicateHandlingModalMessage');
const overwriteAllBtn = document.getElementById('overwriteAllBtn');
const ignoreAllBtn = document.getElementById('ignoreAllBtn');
const decideForEachBtn = document.getElementById('decideForEachBtn');
const cancelDuplicateHandlingBtn = document.getElementById('cancelDuplicateHandlingBtn');

// Individual Duplicate Modal Elements (NEW)
const individualDuplicateModal = document.getElementById('individualDuplicateModal');
const duplicateBookmarkTitle = document.getElementById('duplicateBookmarkTitle');
const individualDuplicateModalMessage = document.getElementById('individualDuplicateModalMessage');
const individualDuplicateOverwriteBtn = document.getElementById('individualDuplicateOverwriteBtn');
const individualDuplicateIgnoreBtn = document.getElementById('individualDuplicateIgnoreBtn');
const individualDuplicateCancelBtn = document.getElementById('individualDuplicateCancelBtn');

// Add/Edit Link Modal Elements (NEW)
const addEditLinkModal = document.getElementById('addEditLinkModal');
const addEditLinkModalCloseBtn = document.getElementById('addEditLinkModalCloseBtn');
const addEditLinkModalTitle = document.getElementById('addEditLinkModalTitle');

// Info Modal Elements (NEW)
const infoModal = document.getElementById('infoModal');
const infoModalCloseBtn = document.getElementById('infoModalCloseBtn');
const doNotShowAgainCheckbox = document.getElementById('doNotShowAgain');
const infoModalFooter = document.getElementById('infoModalFooter'); // To hide checkbox for info icon
const infoIcon = document.getElementById('infoIcon'); // Question mark icon


let links = [];
let editingLink = null;
let selectedImportType = null; // To store the chosen import format
let importedLinksToProcess = []; // NEW: To hold links during duplicate resolution
let duplicatesFoundForProcessing = []; // NEW: To hold duplicate objects {imported, existingIndex}
let importedEzSearchLinksInFileOrder = []; // Only used for EZ Search JSON overwrite ordering
let currentDuplicateIndex = 0; // NEW: To track which duplicate is being processed
let currentFocusedLinkIndex = -1; // -1 = nothing focused


// Helper function to generate a GUID (UUID v4)
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Helper function to convert Unix timestamp to ISO 8601 string
function convertUnixToISO(unixTimestamp) {
    if (!unixTimestamp) return null;
    const date = new Date(parseInt(unixTimestamp) * 1000);
    return date.toISOString();
}

// Function to save links to Local Storage
function saveLinks() {
    localStorage.setItem('ezSearchLinks', JSON.stringify(links));
}

// Function to load links from Local Storage
function getLinks() {
    const storedLinks = localStorage.getItem('ezSearchLinks');
    return storedLinks ? JSON.parse(storedLinks) : [];
}

// Function to get a favicon URL (now the primary method)
function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        // Google's favicon service or a generic default
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (e) {
        // Default blank icon if URL is invalid
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABtklEQVQ4jWPouXPlLwMjA/M/AyMDAwOJA/j/oH8G+l9BPoD+HzJ2u_3792+p5R1JAAKGDw4g+P///w7kM_iA0U7x/v3779e0mQxQzQcmMhQc0_7+/g1Pj44CjQzC5hL4j0m2///_f6yKzR0CjQwI_4uMnR4fHoAZtB_kG4M_k0v8x_B9+P//HyfXysAAGg3fGP9XmP9_Pj9wMDb9//37j9u_f0A7LADr_7CBMf8Pmf4fQWAAkUaDFhAmmP9Pj0H8H0iym2D9//9_D3QxQP9v8w_H0YkQ8S_D5l8Gg58C4X5hD4M_gwXy9x9D_B8mD4SAYiBm5l9g_Pv3H0oGBhA1YGFggJmBmUEAApYGFhBkwMLwBfxfdD0gwQggCgYGDIAjAwgXzEwMBRgYkECAASBAcDEwgBEMwMDAxMgAAAABBBgCgABxAYwLgAwgWkACyAYGAQZADGAwMYHhXxgAAcAmQACxBoBoAQkgGhhAwEAmSAmgGAoAMQAKIAQkgBQwggACiAAsQBBQA2gQGFBAAGYAACAAoASwQoBoAkkACyAYoARQAKGAIigDCoBsAAAAMYQJgM_QAAAEGgCAc2B6r62mHAAAAABJRU5ErkJggg==' // Default icon for errors
    }
}

// --- Utility Functions ---

/**
 * Normalizes a string for flexible searching by converting to lowercase,
 * replacing non-alphanumeric characters (except spaces) with spaces, and
 * collapsing multiple spaces into one.
 * @param {string} str - The input string.
 * @returns {string} The normalized string.
 */
function normalizeString(str) {
	if (typeof str !== 'string') {
		return ''; // Handle non-string inputs gracefully
	}
	return str.toLowerCase()
			  .replace(/[^a-z0-9\s]/g, ' ') // Replace non-alphanumeric (except spaces) with a space
			  .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
			  .trim(); // Trim leading/trailing spaces
}

// Function to render links
function renderLinks(searchTerm = '') {
    linkList.innerHTML = '';
	searchTerm = searchTerm.toLowerCase().trim();
	let filteredLinks = links;


	if (searchTerm) {
		const normalizedSearchTerm = normalizeString(searchTerm);
		const searchTermsArray = normalizedSearchTerm.split(' ').filter(term => term !== ''); // Split into individual words

		filteredLinks = links.filter(link => {
			const normalizedLinkTitle = normalizeString(link.title);
			const normalizedLinkUrl = normalizeString(link.url);
			const normalizedLinkTags = link.tags.map(tag => normalizeString(tag)).join(' ');

			// Check if ALL search terms are present in title, URL, or tags
			return searchTermsArray.every(term =>
				normalizedLinkTitle.includes(term) ||
				normalizedLinkUrl.includes(term) ||
				normalizedLinkTags.includes(term)
			);
		});
	}

    if (links.length === 0) {
        noLinksMessage.classList.remove('hidden');
        noSearchResultsMessage.classList.add('hidden');
    } else {
        noLinksMessage.classList.add('hidden');
        if (filteredLinks.length === 0) {
            noSearchResultsMessage.classList.remove('hidden');
        } else {
            noSearchResultsMessage.classList.add('hidden');
            filteredLinks.forEach(link => {
                const faviconUrl = link.base64Favicon
                    ? link.base64Favicon
                    : link.customFaviconUrl
						? link.customFaviconUrl
						: link.url.startsWith("file:///")
							? "https://img.icons8.com/?size=192&id=69saFG06S6Ss&format=png"
							: getFaviconUrl(link.url);

				const linkCard = document.createElement('div');
				linkCard.className = 'link-card p-4 bg-white rounded-lg shadow-md border flex flex-col transition duration-200 ease-in-out hover:shadow-lg';
				linkCard.draggable = true;
				linkCard.dataset.id = link.id;

				linkCard.innerHTML = `
					<div class="flex items-start justify-between w-full">
						<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="flex-1 min-w-0">
							<div class="flex items-center flex-grow min-w-0">
								<img src="${faviconUrl}" onerror="this.onerror=null;this.src='${getFaviconUrl('')}';" class="w-5 h-5 mr-3 flex-shrink-0" alt="Favicon">
								<div class="flex-1 min-w-0">
									<p class="hover:underline font-semibold truncate block">
										${link.title}
									</p>
									<p class="text-gray-600 text-sm truncate dark:text-gray-400">${link.url}</p>
								</div>
							</div>
						</a>
						<div class="flex-shrink-0 ml-4 space-x-2">
							<button class="edit-btn p-2 rounded-full hover:bg-gray-300 transition-colors" data-id="${link.id}" title="Edit Link">
								<i class="fas fa-edit"></i>
							</button>
							<button class="delete-btn p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-200 transition-colors" data-id="${link.id}" title="Delete Link">
								<i class="fas fa-trash-alt text-red-500 dark:text-red-500"></i>
							</button>
						</div>
					</div>
					${link.tags && link.tags.length > 0 ? `
					<div class="mt-2 flex flex-wrap gap-2" data-tags="${link.tags.join(',')}">
						${link.tags.map(tag => `<span class="tag-pill text-xs font-medium px-2.5 py-0.5 rounded-full">${tag}</span>`).join('')}
					</div>
					` : ''}
				`;
                linkList.appendChild(linkCard);
            });

            addEventListenersToLinkCards(); // Re-attach drag-and-drop listeners
            addTagClickListeners(); // Add listeners for clicking on tags
        }
    }
}

// Function to show the Add/Edit Link Modal
function showAddEditLinkModal(linkToEdit = null) {
    editingLink = linkToEdit;
    linkFormModal.reset(); // Always reset form first

    if (linkToEdit) {
        addEditLinkModalTitle.textContent = 'Edit Link';
        linkTitleModalInput.value = linkToEdit.title;
        linkUrlModalInput.value = linkToEdit.url;
        linkTagsModalInput.value = linkToEdit.tags.join(', ');
        linkCustomFaviconUrlModalInput.value = linkToEdit.customFaviconUrl;
        linkBase64FaviconModal.value = linkToEdit.base64Favicon;
        addLinkBtnModal.style.display = 'none';
        updateLinkBtnModal.style.display = 'inline-block';
        cancelEditBtnModal.style.display = 'inline-block';
    } else {
        addEditLinkModalTitle.textContent = 'Add New Link';
        addLinkBtnModal.style.display = 'inline-block';
        updateLinkBtnModal.style.display = 'none';
        cancelEditBtnModal.style.display = 'none';
    }

    // Ensure advanced options are collapsed by default for new links, expanded for editing if content exists
    if (!linkToEdit || (!linkToEdit.customFaviconUrl && !linkToEdit.base64Favicon)) {
        advancedOptionsContentModal.classList.remove('expanded');
        advancedOptionsToggleIconModal.classList.remove('rotated');
    } else {
        advancedOptionsContentModal.classList.add('expanded');
        advancedOptionsToggleIconModal.classList.add('rotated');
    }

    addEditLinkModal.classList.remove('hidden');
    linkTitleModalInput.focus(); // Focus on the title input when modal opens
}

// Add/Update Link
linkFormModal.addEventListener('submit', (e) => {
    e.preventDefault();

    let url = linkUrlModalInput.value.trim();
    const title = linkTitleModalInput.value.trim();
    const tags = linkTagsModalInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const customFaviconUrl = linkCustomFaviconUrlModalInput.value.trim();
    const base64Favicon = linkBase64FaviconModal.value.trim();

    if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file:///')) {
        url = 'https://' + url;
    }

    addEditLinkModal.classList.add('hidden');

    if (editingLink) {
        // Update existing link
        const index = links.findIndex(link => link.id === editingLink.id);
        if (index !== -1) {
            links[index] = {
                id: editingLink.id,
                url: url,
                title: title,
                tags: tags,
                customFaviconUrl: customFaviconUrl,
                base64Favicon: base64Favicon,
                createdAt: editingLink.createdAt
            };

            showModal("Link Updated", "Your link has been successfully updated!", () => {
                saveLinks();
                renderLinks(searchInput.value);
                resetForm();
                // Keep this line as a redundant safety measure, though the primary fix is above
                addEditLinkModal.classList.add('hidden');
            }, "OK", true);
        }
    } else {
        // Add new link
        const newLink = {
            id: generateGUID(),
            url,
            title,
            tags,
            customFaviconUrl,
            base64Favicon,
            createdAt: new Date().toISOString()
        };
        links.push(newLink);
        showModal("Link Added", "Your new link has been successfully added!", () => {
            saveLinks();
            renderLinks(searchInput.value);
            resetForm();
            // Keep this line as a redundant safety measure
            addEditLinkModal.classList.add('hidden');
        }, "OK", true);
    }
});

// Edit Link functionality
linkList.addEventListener('click', (e) => {
    if (e.target.closest('.edit-btn')) {
        const id = e.target.closest('.edit-btn').dataset.id;
        const linkToEdit = links.find(link => link.id === id);
        if (linkToEdit) {
            showAddEditLinkModal(linkToEdit); // NEW: Call the modal function with the link to edit
        }
    }
});

// Collapsible Advanced Options Section in Modal (NEW)
advancedOptionsHeaderModal.addEventListener('click', () => {
    advancedOptionsContentModal.classList.toggle('expanded');
    advancedOptionsToggleIconModal.classList.toggle('rotated');
});

// Delete Link functionality
linkList.addEventListener('click', (e) => {
    if (e.target.closest('.delete-btn')) {
        const idToDelete = e.target.closest('.delete-btn').dataset.id;
        showModal(
            "Confirm Deletion",
            "Are you sure you want to delete this link? This action cannot be undone.",
            () => {
                links = links.filter(link => link.id !== idToDelete);
                saveLinks();
                renderLinks(searchInput.value);
            }
        );
    }
});

// Cancel Edit (for modal)
cancelEditBtnModal.addEventListener('click', () => { // CHANGED: target cancelEditBtnModal
    addEditLinkModal.classList.add('hidden'); // NEW: Hide the modal
    resetForm(); // Call resetForm to clear inputs and reset state
});

function resetForm() {
    linkFormModal.reset(); // Reset the form fields to their default empty state
    linkUrlModalInput.value = '';
    linkTitleModalInput.value = '';
    linkTagsModalInput.value = '';
    linkCustomFaviconUrlModalInput.value = '';
    linkBase64FaviconModal.value = '';
    editingLink = null; // Clear the editingLink state
    addLinkBtnModal.style.display = 'inline-block'; // Show Add button
    updateLinkBtnModal.style.display = 'none'; // Hide Update button
    cancelEditBtnModal.style.display = 'none'; // Hide Cancel button

    // Ensure advanced options in modal are reset to collapsed
    advancedOptionsContentModal.classList.remove('expanded');
    advancedOptionsToggleIconModal.classList.remove('rotated');
}

// Search functionality
searchInput.addEventListener('input', (e) => {
	currentFocusedLinkIndex = -1;
    renderLinks(e.target.value);
});

// Function to apply dark mode related settings
function applyDarkModeSettings(isDarkMode) {
    const icon = darkModeToggle.querySelector('i');

    // Toggle icon type (moon/sun)
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        // No need to manually set icon color here, Tailwind's dark:text-yellow-400 will apply
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        // No need to manually set icon color here, Tailwind's text-gray-700 will apply
    }
}

// Event listener for the "Add New Link" floating icon (NEW)
const addNewLinkIcon = document.getElementById('addNewLinkIcon'); // Get the element reference here
addNewLinkIcon.addEventListener('click', () => {
    showAddEditLinkModal(); // Call to show the modal for adding a new link
});

// Event listener for the "Add/Edit Link" modal's close button (NEW)
addEditLinkModalCloseBtn.addEventListener('click', () => {
    addEditLinkModal.classList.add('hidden');
    resetForm(); // Clear the form when closing
});

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDarkMode = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode);
    applyDarkModeSettings(isDarkMode); // Call the helper function
});

// Load dark mode preference
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    }
    applyDarkModeSettings(isDarkMode); // Call the helper function on load
}

// // Collapsible Add Link Section
// addLinkHeader.addEventListener('click', () => {
//     addLinkContent.classList.toggle('expanded');
//     addLinkToggleIcon.classList.toggle('rotated');
//     advancedOptionsContent.classList.toggle('expanded');
//     advancedOptionsToggleIcon.classList.toggle('rotated');

//     // Add a one-time event listener for transition end to scroll
//     const scrollAfterTransition = () => {
//         document.getElementById('createOrEditLink').scrollIntoView({ behavior: 'smooth' });
//         // Remove the listener after it fires to prevent multiple scrolls
//         addLinkContent.removeEventListener('transitionend', scrollAfterTransition);
//     };
//     addLinkContent.addEventListener('transitionend', scrollAfterTransition);
//     document.getElementById('createOrEditLink').scrollIntoView({ behavior: 'smooth' });
//     linkTitleInput.focus();
// });

// Custom Modal Functions
function showModal(title, message, onConfirm, confirmText = "Confirm", isAlert = false, onCancel = () => {}) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalConfirmBtn.textContent = confirmText;

    modalConfirmBtn.onclick = () => {
        customModal.classList.add('hidden');
        onConfirm();
        // searchInput.focus();
    };

    if (isAlert) {
        modalCancelBtn.style.display = 'none';
    } else {
        modalCancelBtn.style.display = 'inline-block';
        modalCancelBtn.onclick = () => {
            customModal.classList.add('hidden');
            onCancel();
            // searchInput.focus();
        };
    }
    customModal.classList.remove('hidden');
	if (modalCancelBtn.style.display == 'none') {
		modalConfirmBtn.focus();
	} else {
		modalCancelBtn.focus();
	};
}

// Drag and Drop functionality
let draggedItem = null;

function addEventListenersToLinkCards() {
    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    draggedItem = this;
    setTimeout(() => {
        this.classList.add('dragging');
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.remove('drag-over-top', 'drag-over-bottom'); // Clear previous
    if (this === draggedItem) return;

    const rect = this.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;

    if (e.clientY < midY) {
        this.classList.add('drag-over-top');
    } else {
        this.classList.add('drag-over-bottom');
    }
}

function handleDragLeave() {
    this.classList.remove('drag-over-top', 'drag-over-bottom');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over-top', 'drag-over-bottom');

    if (this === draggedItem) return;

    const dropTargetId = this.dataset.id;
    const draggedItemId = draggedItem.dataset.id;

    const dropTargetIndex = links.findIndex(link => link.id === dropTargetId);
    const draggedItemIndex = links.findIndex(link => link.id === draggedItemId);

    if (dropTargetIndex === -1 || draggedItemIndex === -1) return;

    const [removed] = links.splice(draggedItemIndex, 1);

    const rect = this.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;

    if (e.clientY < midY) { // Drop above
        links.splice(dropTargetIndex, 0, removed);
    } else { // Drop below
        links.splice(dropTargetIndex + 1, 0, removed);
    }

    saveLinks();
    renderLinks(searchInput.value);
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
    document.querySelectorAll('.link-card').forEach(card => {
        card.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    // Re-render to ensure correct order in DOM and clear any lingering drop indicators
    renderLinks(searchInput.value);
}


// Tag Click Functionality
function addTagClickListeners() {
    document.querySelectorAll('.tag-pill').forEach(tagPill => {
        tagPill.addEventListener('click', function() {
			const tagText = this.textContent;
			// Create a regular expression with word boundaries to match the whole tagText
			// and optional spaces around it.
			const regex = new RegExp(`\\b${tagText}\\b\\s*`, 'g');

			if (searchInput.value.includes(tagText)) {
				// Replace the tagText and any trailing spaces.
				// Then trim to clean up any leading/trailing spaces in the whole string.
				searchInput.value = searchInput.value.replace(regex, '').trim();
			} else {
				// Add the tag. If the input is not empty, add a space before the new tag.
				searchInput.value = searchInput.value === "" ? tagText : searchInput.value + " " + tagText;
			}
			renderLinks(searchInput.value);
        });
    });
}

// Export Links
exportLinksBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(links, null, 2); // Pretty print JSON
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
	
	// Get current date
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const dateSuffix = `${month}-${day}-${year}`;
	
    const exportFileDefaultName = `ezSearch_bookmarks_${dateSuffix}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

// Import Links (Modified to show type selection modal first)
importLinksBtn.addEventListener('click', () => {
    importTypeModal.classList.remove('hidden'); // Show the import type selection modal
});

// Event listeners for import type selection buttons
importTypeEZSearchBtn.addEventListener('click', () => {
    selectedImportType = 'ezSearchJson';
    importFileInput.accept = '.json'; // Set accept attribute for JSON files
    importTypeModal.classList.add('hidden'); // Hide the modal
    importFileInput.click(); // Trigger the file input click
});

importTypeChromeBtn.addEventListener('click', () => {
    selectedImportType = 'chromeHtml';
    importFileInput.accept = '.html'; // Set accept attribute for HTML files
    importTypeModal.classList.add('hidden'); // Hide the modal
    importFileInput.click(); // Trigger the file input click
});

importTypeCancelBtn.addEventListener('click', () => {
    importTypeModal.classList.add('hidden');
    selectedImportType = null; // Reset selected type
    importFileInput.value = ''; // Clear file input value in case a file was already selected
});

// Handle imported file (modified to handle different formats)
importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
        // If no file is selected (e.g., user cancels file dialog)
        selectedImportType = null; // Reset selected type
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let importedLinks = [];
            if (selectedImportType === 'ezSearchJson') {
                importedLinks = JSON.parse(e.target.result);
                // Basic validation for EZ Search JSON format
                if (!Array.isArray(importedLinks) || !importedLinks.every(link => typeof link === 'object' && link.url && link.title && 'id' in link)) {
                    showModal("Import Error", "Invalid EZ Search JSON file format. Please ensure it's an array of link objects.", () => {}, "OK", true);
                    return;
                }
            } else if (selectedImportType === 'chromeHtml') {
                importedLinks = parseChromeBookmarksHtml(e.target.result);
                // Basic validation for parsed Chrome bookmarks
                if (!Array.isArray(importedLinks) || !importedLinks.every(link => typeof link === 'object' && link.url && link.title && 'id' in link)) {
                    showModal("Import Error", "Could not parse Google Chrome Bookmarks. File might be corrupted or in an unexpected format.", () => {}, "OK", true);
                    return;
                }
            } else {
                // This state should ideally not be reached if modals work correctly
                showModal("Import Error", "No import type selected before file was read.", () => {}, "OK", true);
                return;
            }
			
			// Keep the exact file ordering ONLY for EZ Search JSON.
			// Chrome HTML import should NOT use file ordering behavior.
			importedEzSearchLinksInFileOrder = (selectedImportType === 'ezSearchJson') ? importedLinks : [];

            // Clear arrays for a new import operation
            importedLinksToProcess = []; // Will store non-duplicates initially
            duplicatesFoundForProcessing = []; // Will store { imported: link, existingIndex: index }

            importedLinks.forEach(importedLink => {
                const normalizedImportedUrl = importedLink.url.endsWith('/') ? importedLink.url.slice(0, -1) : importedLink.url;

                // Find if this imported link is a duplicate of an existing link
                const existingLinkIndex = links.findIndex(existingLink => {
                    const normalizedExistingUrl = existingLink.url.endsWith('/') ? existingLink.url.slice(0, -1) : existingLink.url;
                    return normalizedExistingUrl === normalizedImportedUrl;
                });

                if (existingLinkIndex !== -1) {
                    // It's a duplicate, store the imported link and its existing index
                    duplicatesFoundForProcessing.push({
                        imported: importedLink,
                        existingIndex: existingLinkIndex
                    });
                } else {
                    // Not a duplicate, add directly to the list of links to be potentially added
                    importedLinksToProcess.push(importedLink);
                }
            });

		if (duplicatesFoundForProcessing.length > 0) {
			showDuplicateHandlingModal(duplicatesFoundForProcessing.length);
		} else {
			if (importedLinksToProcess.length > 0) {
				links.push(...importedLinksToProcess);
				saveLinks();
				renderLinks(searchInput.value);
				showModal("Import Successful", `${importedLinksToProcess.length} new links imported successfully.`, () => {
					cleanupImportState();
				}, "OK", true);
			} else {
				showModal("Import Complete", "No new unique links were found to import from the selected file.", () => {
					cleanupImportState();
				}, "OK", true);
			}
		}

        } catch (error) {
            console.error("Error importing file:", error);
            showModal("Import Error", `Failed to process the imported file. Please check the file format. Details: ${error.message}`, () => {}, "OK", true);
        } finally {
            // Clear the file input value to allow importing the same file again
            event.target.value = '';
			// DO NOT reset selectedImportType here; duplicate handling happens after this async callback.
        }
    };

    reader.onerror = () => {
        showModal("Import Error", "Failed to read the file.", () => {}, "OK", true);
    };

    // Read the file as text for both JSON and HTML
    reader.readAsText(file);
});

// --- Duplicate Handling Functions (BEGIN) ---

function showDuplicateHandlingModal(duplicateCount) {
    currentDuplicateIndex = 0; // Reset index for processing
    duplicateHandlingModalMessage.textContent = `Found ${duplicateCount} duplicate bookmarks. How would you like to handle them?`;
    duplicateHandlingModal.classList.remove('hidden');
}

function cleanupImportState() {
    selectedImportType = null;
    importedEzSearchLinksInFileOrder = [];
    importedLinksToProcess = [];
    duplicatesFoundForProcessing = [];
    currentDuplicateIndex = 0;
    importFileInput.value = '';
}

overwriteAllBtn.addEventListener('click', () => {
    duplicateHandlingModal.classList.add('hidden');
    processDuplicates('overwrite');
});

ignoreAllBtn.addEventListener('click', () => {
    duplicateHandlingModal.classList.add('hidden');
    processDuplicates('ignore');
});

decideForEachBtn.addEventListener('click', () => {
    duplicateHandlingModal.classList.add('hidden');
    processDuplicates('decide');
});

cancelDuplicateHandlingBtn.addEventListener('click', () => {
    duplicateHandlingModal.classList.add('hidden');
    showModal("Import Cancelled", "The import process has been cancelled.", () => {
        cleanupImportState();
    }, "OK", true);
});

function normalizeImportUrl(url) {
    if (typeof url !== 'string') return '';
    return url.endsWith('/') ? url.slice(0, -1) : url;
}


function processDuplicates(strategy) {
    let newLinksCount = importedLinksToProcess.length; // Start with the count of initially found non-duplicates
    let overwrittenLinksCount = 0;
    let ignoredLinksCount = 0;

	const isEzSearchOverwriteOrdering =
		(strategy === 'overwrite' && selectedImportType === 'ezSearchJson' && Array.isArray(importedEzSearchLinksInFileOrder) && importedEzSearchLinksInFileOrder.length > 0);

	// Add all non-duplicates immediately UNLESS we’re going to rebuild based on import ordering.
	if (!isEzSearchOverwriteOrdering && importedLinksToProcess.length > 0) {
		links.push(...importedLinksToProcess);
	}
	importedLinksToProcess = []; // Clear this as non-duplicates are now handled (or will be handled by rebuild)

	if (strategy === 'overwrite') {

		// Special behavior ONLY for EZ Search JSON: apply the file's ordering.
		// Chrome HTML imports should keep existing behavior.
		if (selectedImportType === 'ezSearchJson' && Array.isArray(importedEzSearchLinksInFileOrder) && importedEzSearchLinksInFileOrder.length > 0) {

			// Map existing links by normalized URL (first occurrence wins)
			const existingByUrl = new Map();
			links.forEach(existingLink => {
				const key = normalizeImportUrl(existingLink.url);
				if (key && !existingByUrl.has(key)) existingByUrl.set(key, existingLink);
			});

			const usedExistingUrls = new Set();
			const rebuilt = [];

			let newCount = 0;
			let overwrittenCount = 0;

			// Rebuild in the exact order of the imported EZ Search JSON array.
			importedEzSearchLinksInFileOrder.forEach(importedLinkRaw => {
				if (!importedLinkRaw || typeof importedLinkRaw !== 'object') return;

				const key = normalizeImportUrl(importedLinkRaw.url);
				if (!key) return;

				const existing = existingByUrl.get(key);

				if (existing) {
					// Preserve createdAt from existing entry
					const importedLink = { ...importedLinkRaw, createdAt: existing.createdAt };
					rebuilt.push(importedLink);
					usedExistingUrls.add(key);
					overwrittenCount++;
				} else {
					rebuilt.push({ ...importedLinkRaw });
					newCount++;
				}
			});

			// Append any existing links not mentioned in the import, preserving their current relative order.
			links.forEach(existingLink => {
				const key = normalizeImportUrl(existingLink.url);
				if (!key) return;
				if (!usedExistingUrls.has(key)) rebuilt.push(existingLink);
			});

			links = rebuilt;

			// We rebuilt everything; don't double-add anything.
			importedLinksToProcess = [];
			duplicatesFoundForProcessing = [];

			finishImport(newCount, overwrittenCount, 0);
			return;
		}

		// Default behavior (Chrome HTML, or no stored EZ Search order):
		duplicatesFoundForProcessing.forEach(duplicateObj => {
			const importedLink = duplicateObj.imported;
			const existingLinkIndex = duplicateObj.existingIndex;

			// Preserve original createdAt date for the existing link
			importedLink.createdAt = links[existingLinkIndex].createdAt;
			links[existingLinkIndex] = importedLink;
			overwrittenLinksCount++;
		});
		finishImport(newLinksCount, overwrittenLinksCount, ignoredLinksCount);

	} else if (strategy === 'ignore') {
        ignoredLinksCount += duplicatesFoundForProcessing.length;
        finishImport(newLinksCount, overwrittenLinksCount, ignoredLinksCount);
    } else if (strategy === 'decide') {
        // Pass only the counts as duplicatesFoundForProcessing is global
        processIndividualDuplicate(newLinksCount, overwrittenLinksCount, ignoredLinksCount);
    }
}

function processIndividualDuplicate(newCount, overwrittenCount, ignoredCount) {
    if (currentDuplicateIndex < duplicatesFoundForProcessing.length) {
        const duplicateObj = duplicatesFoundForProcessing[currentDuplicateIndex];
        const importedLink = duplicateObj.imported;
        const existingLinkIndex = duplicateObj.existingIndex;

        duplicateBookmarkTitle.textContent = importedLink.title; // Display title of the imported link
        individualDuplicateModal.classList.remove('hidden');

        // Clear previous event listeners to prevent multiple firings
        individualDuplicateOverwriteBtn.onclick = null;
        individualDuplicateIgnoreBtn.onclick = null;
        individualDuplicateCancelBtn.onclick = null;

        individualDuplicateOverwriteBtn.onclick = () => {
            individualDuplicateModal.classList.add('hidden');
            // Overwrite the existing link in the 'links' array
            // Preserve original createdAt date for the existing link
            importedLink.createdAt = links[existingLinkIndex].createdAt;
            links[existingLinkIndex] = importedLink;
            overwrittenCount++;
            currentDuplicateIndex++;
            processIndividualDuplicate(newCount, overwrittenCount, ignoredCount); // Process next
        };

        individualDuplicateIgnoreBtn.onclick = () => {
            individualDuplicateModal.classList.add('hidden');
            ignoredCount++;
            currentDuplicateIndex++;
            processIndividualDuplicate(newCount, overwrittenCount, ignoredCount); // Process next
        };

        individualDuplicateCancelBtn.onclick = () => {
            individualDuplicateModal.classList.add('hidden');
            showModal("Import Cancelled", "The individual import decision process has been cancelled.", () => {
                duplicatesFoundForProcessing = []; // Clear the queue if cancelled here
                currentDuplicateIndex = 0;
            }, "OK", true);
            // Do not proceed with next duplicate, effectively stopping the process
        };

    } else {
        // All duplicates processed
        finishImport(newCount, overwrittenCount, ignoredCount);
    }
}

function finishImport(newCount, overwrittenCount, ignoredCount) {
    saveLinks();
    renderLinks(searchInput.value);

    let message = [];
    if (newCount > 0) {
        message.push(`${newCount} new links added.`);
    }
    if (overwrittenCount > 0) {
        message.push(`${overwrittenCount} existing links overwritten.`);
    }
    if (ignoredCount > 0) {
        message.push(`${ignoredCount} duplicate links ignored.`);
    }

    if (message.length === 0) {
        showModal("Import Complete", "No unique links were found to import from the selected file.", () => {}, "OK", true);
    } else {
        showModal("Import Successful", message.join('<br>'), () => {}, "OK", true);
    }
	cleanupImportState();
}

// --- Duplicate Handling Functions (END) ---

/**
 * Parses the HTML content of a Google Chrome bookmark export file.
 * Extracts bookmarks, treating nested folders as tags.
 *
 * @param {string} htmlContent The full HTML content of the Chrome bookmark file.
 * @returns {Array<Object>} An array of bookmark objects in EZ Search JSON format.
 */
function parseChromeBookmarksHtml(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const bookmarks = [];

    // Define tags to exclude (can be expanded)
    const tagsToExclude = new Set(["Bookmarks bar"]); // Using a Set for efficient lookup

    // Recursive function to traverse the <DL> and <DT> structure of Chrome bookmarks
    function processDl(dlElement, currentTags) {
        Array.from(dlElement.children).forEach(child => {
            if (child.tagName === 'DT') {
                const h3 = child.querySelector(':scope > h3');
                const anchor = child.querySelector(':scope > a');
                const nestedDl = child.querySelector(':scope > dl');

                if (h3) { // This <DT> contains an <H3>, indicating a folder
                    const folderName = h3.textContent.trim();
                    // Create newTags by combining currentTags with the current folderName
                    // and filter out excluded folder names from being passed down
                    const tagsForNestedContent = [...currentTags, folderName].filter(tag => !tagsToExclude.has(tag));

                    if (nestedDl) {
                        // Recursively process the nested DL with the updated tags
                        processDl(nestedDl, tagsForNestedContent);
                    }
                } else if (anchor) { // This <DT> contains an <A>, indicating a bookmark link
                    const url = anchor.href;
                    // Get the title, using the URL as a fallback if the text content is empty or just whitespace
                    const rawTitle = anchor.textContent.trim();
                    const title = rawTitle === "" ? url : rawTitle; // MODIFIED: Fallback for title
					const base64Favicon = anchor.getAttribute('ICON');
                    const addDate = anchor.getAttribute('add_date'); // Unix timestamp

                    if (url) { // MODIFIED: Only check for URL presence
                        // Filter out excluded tags before assigning them to the bookmark
                        const filteredTags = currentTags.filter(tag => !tagsToExclude.has(tag));

                        bookmarks.push({
                            id: generateGUID(), // Assuming generateGUID is defined elsewhere
                            url: url,
                            title: title, // Use the (potentially fallback) title
                            tags: filteredTags,
                            customFaviconUrl: "",
							base64Favicon: base64Favicon || "",
                            createdAt: convertUnixToISO(addDate) // Assuming convertUnixToISO is defined elsewhere
                        });
                    }
                }
            }
        });
    }

    const rootDl = doc.querySelector('body > dl');

    if (rootDl) {
        Array.from(rootDl.children).forEach(child => {
            if (child.tagName === 'DT') {
                const h3 = child.querySelector(':scope > h3');
                const nestedDl = child.querySelector(':scope > dl');
                if (h3 && nestedDl) {
                    const folderName = h3.textContent.trim();
                    // For top-level folders, filter their name if it's an excluded tag
                    const initialTags = [folderName].filter(tag => !tagsToExclude.has(tag));
                    processDl(nestedDl, initialTags);
                } else if (child.tagName === 'A') { // Handle direct links under root DL, if any
                    const anchor = child;
                    const url = anchor.href;
                    // Get the title, using the URL as a fallback if the text content is empty or just whitespace
                    const rawTitle = anchor.textContent.trim();
                    const title = rawTitle === "" ? url : rawTitle; // MODIFIED: Fallback for title
					const base64Favicon = anchor.getAttribute('ICON');

                    const addDate = anchor.getAttribute('add_date');
                    if (url) { // MODIFIED: Only check for URL presence
                        bookmarks.push({
                            id: generateGUID(),
                            url: url,
                            title: title, // Use the (potentially fallback) title
                            tags: [], // No tags for root-level bookmarks not in a folder
                            customFaviconUrl: "",
							base64Favicon: base64Favicon || "",
                            createdAt: convertUnixToISO(addDate)
                        });
                    }
                }
            }
        });

    } else {
        console.warn("Could not find a standard root <DL> element (body > dl). Attempting to parse all found <DL> elements.");
        doc.querySelectorAll('dl').forEach(dl => {
            if (!dl.closest('dt > dl')) { // Only process top-level DLs if rootDl isn't found
                processDl(dl, []);
            }
        });
    }

    return bookmarks;
}

// --- Info Modal Functions (NEW) ---

/**
 * Displays the informational modal.
 * @param {boolean} isFirstTimeUser - True if shown for first-time user, false for info icon click.
 */
function showInfoModal(isFirstTimeUser) {
    if (isFirstTimeUser) {
        infoModalFooter.classList.remove('hidden'); // Show "Do not show again" checkbox
        doNotShowAgainCheckbox.checked = localStorage.getItem('doNotShowInfoModal') === 'true'; // Set checkbox state
    } else {
        infoModalFooter.classList.add('hidden'); // Hide "Do not show again" checkbox
    }
    infoModal.classList.remove('hidden');
}

// Event listener for "Do not show this again" checkbox
doNotShowAgainCheckbox.addEventListener('change', () => {
    localStorage.setItem('doNotShowInfoModal', doNotShowAgainCheckbox.checked);
});

// Event listener for info modal close button
infoModalCloseBtn.addEventListener('click', () => {
    infoModal.classList.add('hidden');
});

// Event listener for the question mark info icon
infoIcon.addEventListener('click', () => {
    showInfoModal(false); // Show as informational, not first-time
});

// Global event listener for Escape key to close modals
document.addEventListener('keydown', (e) => {
	const focusableLinks = Array.from(document.querySelectorAll('.link-card a'));

    if (e.key === 'Escape' || e.keyCode === 27) { // Check for Escape key
		currentFocusedLinkIndex = -1;
        if (!customModal.classList.contains('hidden')) {
            customModal.classList.add('hidden');
        }
        if (!importTypeModal.classList.contains('hidden')) {
            importTypeModal.classList.add('hidden');
        }
        if (!infoModal.classList.contains('hidden')) {
            infoModal.classList.add('hidden');
        }
		if (!duplicateHandlingModal.classList.contains('hidden')) {
            duplicateHandlingModal.classList.add('hidden');
            importedLinksToProcess = []; // Clear queue if cancelled here (non-duplicates)
            duplicatesFoundForProcessing = []; // NEW: Clear duplicate queue if cancelled here
            currentDuplicateIndex = 0;
            showModal("Import Cancelled", "The import process has been cancelled.", () => {}, "OK", true); // Notify user
			renderLinks(searchInput.value);
        }
        if (!individualDuplicateModal.classList.contains('hidden')) {
            individualDuplicateModal.classList.add('hidden');
            showModal("Import Cancelled", "The individual import decision process has been cancelled.", () => {
                importedLinksToProcess = []; // Clear queue if cancelled here
                duplicatesFoundForProcessing = []; // NEW: Clear duplicate queue if cancelled here
                currentDuplicateIndex = 0;
            }, "OK", true);
			renderLinks(searchInput.value);
        }
        // NEW: Close Add/Edit Link Modal
        if (!addEditLinkModal.classList.contains('hidden')) {
            resetForm(); // Reset form if closed with Escape
            addEditLinkModal.classList.add('hidden');
			renderLinks(searchInput.value);
        }
		
		const activeElement = document.activeElement;
		if (activeElement.id === 'searchLinks') {
			// Delete whatever text is in the searchLinks search bar.
			activeElement.value = '';
			renderLinks();
		}
		// If a link is focused, return focus to the search bar
		else if (document.activeElement && document.activeElement.closest('.link-card')) {
			searchInput.focus();
		}
		// Otherwise, fall back to the search bar - but only if no modal is left
		// open. Covers e.g. closing the Add/Edit Link modal above, whose focused
		// input just got auto-blurred to <body> when it went display:none.
		// Skipped when a modal is still open (e.g. showModal() above just
		// focused its own confirm/cancel button) so we don't steal focus away
		// from it.
		else if (
			customModal.classList.contains('hidden') &&
			importTypeModal.classList.contains('hidden') &&
			infoModal.classList.contains('hidden') &&
			duplicateHandlingModal.classList.contains('hidden') &&
			individualDuplicateModal.classList.contains('hidden') &&
			addEditLinkModal.classList.contains('hidden')
		) {
			searchInput.focus();
		}
	// Check if Ctrl+Enter or Ctrl+Shift+Enter is pressed
    } else if (e.key === 'Enter') {

        // Check if a link card's anchor tag is currently focused.
        // The `document.activeElement` property returns the currently focused element.
        const activeElement = document.activeElement;
        let linkToOpen = null;


        // Check if the active element is an anchor tag within a link card
        if (activeElement && activeElement.tagName === 'A' && activeElement.closest('.link-card')) {
            linkToOpen = activeElement;
        } else if (activeElement && activeElement.id === 'searchLinks') {
            // If search bar is within focus, use the first result.
            const firstLinkCard = linkList.querySelector('.link-card');
            if (firstLinkCard) {
                linkToOpen = firstLinkCard.querySelector('a');
            }
        }
		
		if (linkToOpen && linkToOpen.href) {
			e.preventDefault(); // Prevent default browser behavior
			// If Ctrl + Shift + Enter is pressed, open in a new tab and bring into focus.
			if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
				// Open the link in a new tab.
				linkToOpen.click();
			// If Ctrl + Enter is pressed, open the tab in the background.
			} else if (e.ctrlKey || e.metaKey) {
				window.open(linkToOpen.href, '_blank', 'noopener,noreferrer');
			// If just Enter is pressed, open in current tab.
			} else {
				// Open the link in the current tab.
				window.location.href = linkToOpen.href;
			}
		}
	// Navigation with ArrowUp and ArrowDown through link cards
	} else if (focusableLinks.length > 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
		e.preventDefault();
		
		// const focusableLinks = Array.from(document.querySelectorAll('.link-card a'));

		// If coming from the search bar
		if (document.activeElement === searchInput && currentFocusedLinkIndex === -1) {
			if (e.key === 'ArrowDown') {
				currentFocusedLinkIndex = 0;
				focusableLinks[0].focus();
			} else if (e.key === 'ArrowUp') {
				currentFocusedLinkIndex = focusableLinks.length - 1;
				focusableLinks[currentFocusedLinkIndex].focus();
			}
			return;
		}

		// If focus is currently on a link card
		const currentIndex = focusableLinks.findIndex(el => el === document.activeElement);

		if (currentIndex !== -1) {
			currentFocusedLinkIndex = currentIndex;

			if (e.key === 'ArrowDown') {
				currentFocusedLinkIndex = (currentIndex + 1) % focusableLinks.length;
			} else if (e.key === 'ArrowUp') {
				currentFocusedLinkIndex = (currentIndex - 1 + focusableLinks.length) % focusableLinks.length;
			}

			focusableLinks[currentFocusedLinkIndex].focus();
			focusableLinks[currentFocusedLinkIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		}
	}
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    links = getLinks(); // Load links
    loadDarkModePreference();
    renderLinks(); // Render links after loading them

    // Show info modal if it's the first time
    const doNotShowInfoModal = localStorage.getItem('doNotShowInfoModal');
    if (doNotShowInfoModal !== 'true') {
        showInfoModal(true);
    }

	setTimeout(function() {
		const overlayButtons = document.querySelectorAll('.overlayButton');

		// 2. Iterate over each 'overlayButton' and add the specified classes
		overlayButtons.forEach(button => {
			button.classList.add("transition", "duration-300", "ease-in-out");
		});

		// 3. Find all elements with the class 'transition-button'
		const transitionButtons = document.querySelectorAll('.transition-button');

		// 4. Iterate over each 'transition-button' and add the specified classes
		transitionButtons.forEach(button => {
			button.classList.add("transition-colors", "duration-300");
		});
	}, 3);
});