// Simple Database - Stores all queue data
let queueSystem = {
    tickets: [], // List of all tickets
    currentNumber: 1000 // Starting ticket number
};

// Load data from browser storage
function loadData() {
    const saved = localStorage.getItem('queueData');
    if (saved) {
        queueSystem = JSON.parse(saved);
    }
}

// Save data to browser storage
function saveData() {
    localStorage.setItem('queueData', JSON.stringify(queueSystem));
}

// Initialize on page load
loadData();

// Function to join the queue
function joinQueue(fullName, serviceType) {
    // Create a new ticket
    queueSystem.currentNumber++;
    const newTicket = {
        id: Date.now(), // Unique ID
        number: queueSystem.currentNumber,
        fullName: fullName,
        service: serviceType,
        status: 'waiting',
        joinTime: new Date()
    };

    // Add to tickets list
    queueSystem.tickets.push(newTicket);
    
    // Save updated data
    saveData();
    
    // Return the new ticket
    return newTicket;
}

// Function to call next person
function callNext() {
    // Find the first waiting ticket
    const nextTicket = queueSystem.tickets.find(ticket => ticket.status === 'waiting');
    
    if (nextTicket) {
        // Update ticket status
        nextTicket.status = 'serving';
        nextTicket.serveTime = new Date();
        
        // Save changes
        saveData();
        
        return nextTicket;
    }
    return null; // No one in queue
}

// Function to complete current service
function completeCurrent() {
    const servingTicket = queueSystem.tickets.find(ticket => ticket.status === 'serving');
    if (servingTicket) {
        servingTicket.status = 'completed';
        saveData();
    }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ticketForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page reload
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const service = document.getElementById('service').value;
            
            // Join the queue
            const newTicket = joinQueue(fullName, service);
            
            // Show ticket to user
            document.getElementById('displayNumber').textContent = `A${newTicket.number}`;
            document.getElementById('userName').textContent = newTicket.fullName;
            document.getElementById('userService').textContent = newTicket.service;
            
            // Calculate position in queue
            const waitingCount = queueSystem.tickets.filter(t => t.status === 'waiting').length;
            document.getElementById('waitTime').textContent = (waitingCount * 5); // 5 mins per person
            
            // Show result
            document.getElementById('ticketResult').classList.remove('hidden');
            
            // Reset form
            form.reset();
        });
    }
});