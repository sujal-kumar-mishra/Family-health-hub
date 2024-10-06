// Constants for API endpoints
const apiUrl = 'http://localhost:3000/api'; // Base URL for API endpoints

// Event listener when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Fetch user information and display on the header
    fetchUserDetails();

    // Fetch and display family members
    fetchFamilyMembers();

    // Event listener for adding a new family member
    document.getElementById('addMemberBtn').addEventListener('click', openAddMemberForm);


    // Event listeners for related tables buttons
    document.getElementById('healthRecordsBtn').addEventListener('click', fetchHealthRecords);
    document.getElementById('medicationsBtn').addEventListener('click', fetchMedications);
    document.getElementById('appointmentsBtn').addEventListener('click', fetchAppointments);
});

let currentMemberId;

// Function to fetch user details and update the header
function fetchUserDetails() {
    fetch(`${apiUrl}/user`)
        .then(response => response.json())
        .then(user => {
            // Update user information in the header
            const userAvatar = document.getElementById('userAvatar');
            userAvatar.src = user.avatar_url; // Assuming avatar_url is provided by backend
            const userName = document.getElementById('userName');
            userName.textContent = user.name; // Assuming name is provided by backend
        })
        .catch(error => console.error('Error fetching user details:', error));
}

// Function to fetch and display family members
function fetchFamilyMembers() {
    fetch(`${apiUrl}/familymember`)
        .then(response => response.json())
        .then(members => {
            const memberList = document.getElementById('family-member-list');
            memberList.innerHTML = ''; // Clear existing list items

            members.forEach(member => {
                const li = document.createElement('li');
                li.textContent = `${member.first_name} ${member.last_name}`;
                li.addEventListener('click', () => fetchMemberDetails(member.member_id));
                memberList.appendChild(li);

                
            });
        })
        .catch(error => console.error('Error fetching family members:', error));
}

// Function to fetch and display details of a specific family member
function fetchMemberDetails(memberId) {
    fetch(`${apiUrl}/familymember/${memberId}`)
    .then(response => response.json())
    .then(member => {
            currentMemberId=memberId;
            const detailsContainer = document.getElementById('family-details-container');
            detailsContainer.innerHTML = `
                <p><strong>Name:</strong> ${member.first_name} ${member.last_name}</p>
                <p><strong>Date of Birth:</strong> ${member.date_of_birth}</p>
                <p><strong>Gender:</strong> ${member.gender}</p>
                <p><strong>Relationship:</strong> ${member.relationship}</p>
                <button id="update-details-btn">Update Details</button>
            `;
                // Bind event listener for the update button
                document.getElementById('update-details-btn').addEventListener('click', openupdateMemberForm);
            // document.getElementById('update-details-btn').addEventListener('click', () => {
            //     // Implement update functionality here
            //     console.log('Update button clicked for member:', member);
            //     // Example: Call update function passing member details
            //     // updateMemberDetails(member);
            // });
        })
        .catch(error => console.error('Error fetching family member details:', error));
}



// Function to open the modal for adding a new family member
function openAddMemberForm() {
    const modal = document.getElementById('memberModal');
    modal.style.display = 'block'; // Display the modal

    // Event listener for the close button in the modal
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Close the modal
    });

    // Event listener for the form submission in the modal
    const addMemberForm = modal.querySelector('#addMemberForm');
    addMemberForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addMemberForm);
        const memberData = {
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            date_of_birth: formData.get('dob'),
            gender: formData.get('gender'),
            relationship: formData.get('relationship')
        };

        // Example: Replace with actual endpoint to add a new family member
        fetch(`${apiUrl}/familymember`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Family member added successfully:', data);
            fetchFamilyMembers(); // Refresh family members list after adding
            modal.style.display = 'none'; // Close the modal after submission
        })
        .catch(error => console.error('Error adding family member:', error));
    });
}

// Function to open the modal for adding a update family member
function openupdateMemberForm() {
    const modal = document.getElementById('memberModal');
    modal.style.display = 'block'; // Display the modal

    // Event listener for the close button in the modal
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Close the modal
    });

    // Event listener for the form submission in the modal
    const addMemberForm = modal.querySelector('#addMemberForm');
    addMemberForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addMemberForm);
        const memberData = {
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            date_of_birth: formData.get('dob'),
            gender: formData.get('gender'),
            relationship: formData.get('relationship')
        };

        // Example: Replace with actual endpoint to add a new family member
        fetch(`${apiUrl}/familymember/${currentMemberId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Family member added successfully:', data);
            fetchFamilyMembers(); // Refresh family members list after adding
            modal.style.display = 'none'; // Close the modal after submission
        })
        .catch(error => console.error('Error adding family member:', error));
    });
}

//medical record
function openhealthAddMemberForm() {
    const modal = document.getElementById('healthRecordModal');
    modal.style.display = 'block'; // Display the modal

    // Event listener for the close button in the modal
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Close the modal
    });

    // Event listener for the form submission in the modal
    const addMemberForm = modal.querySelector('#addHealthRecordForm');
    addMemberForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        // Serialize form data
        const formData = new FormData(addMemberForm);
        
        // Construct data object excluding record_id
        const memberData = {
            description: formData.get('description'),
            record_date: formData.get('record_date'),
            record_type: formData.get('record_type'),
        };

        // Example: Get record_id from URL
        const recordId = currentMemberId;

        // Example: Replace with actual endpoint to add a new health record
        fetch(`${apiUrl}/healthrecords/${recordId}`, {
            method: 'PUT', // Assuming you are updating an existing health record
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Health Record updated successfully:', data);
            // fetchHealthRecords(); // Refresh health records list after updating
            modal.style.display = 'none'; // Close the modal after submission
        })
        .catch(error => console.error('Error updating health record:', error));
    });
}


//medication
//medical record
function openmedicationAddMemberForm() {
    const modal = document.getElementById('medicationModal');
    modal.style.display = 'block'; // Display the modal

    // Event listener for the close button in the modal
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Close the modal
    });

    // Event listener for the form submission in the modal
    const addMemberForm = modal.querySelector('#addMemberForm');
    addMemberForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addMemberForm);
        const memberData = {
            medication_name: formData.get('medication_name'),
            dosage: formData.get('dosage'),
            frequency: formData.get('frequency'),
        };

        console.log("fhs",memberData)
        const medication_id=currentMemberId

        // Example: Replace with actual endpoint to add a new family member
        fetch(`${apiUrl}/medications/${medication_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Family member added successfully:', data);
            fetchFamilyMembers(); // Refresh family members list after adding
            modal.style.display = 'none'; // Close the modal after submission
        })
        .catch(error => console.error('Error adding family member:', error));
    });
}

//appointment
//medical record
function openappointmentAddMemberForm() {
    const modal = document.getElementById('appointmentModal');
    modal.style.display = 'block'; // Display the modal

    // Event listener for the close button in the modal
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Close the modal
    });

    // Event listener for the form submission in the modal
    const addMemberForm = modal.querySelector('#addMemberForm');
    addMemberForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addMemberForm);
        const memberData = {
            appointment_date: formData.get('appointment_date'),
            provider_name: formData.get('provider_name'),
            purpose: formData.get('purpose'),
        };

        const appointment_id=currentMemberId;
        // Example: Replace with actual endpoint to add a new family member
        fetch(`${apiUrl}/appointments/${appointment_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Family member added successfully:', data);
            fetchFamilyMembers(); // Refresh family members list after adding
            modal.style.display = 'none'; // Close the modal after submission
        })
        .catch(error => console.error('Error adding family member:', error));
    });
}


// Example for fetching health records for a family member
function fetchHealthRecords() {
    tableName = 'healthrecords';
    memberId = currentMemberId;
    fetch(`${apiUrl}/${tableName}/${memberId}`)
    .then(response => response.json())
    .then(data => {
        // Assuming data is an array with a single object as per your console log
        if (data.length > 0) {
            const record = data[0]; // Accessing the first object in the array
            // Update the UI to display fetched data
            console.log(`Fetched ${tableName} data:`, record);
            // Example: Update UI with fetched data
            const detailsContainer = document.getElementById('family-details-container');
            detailsContainer.innerHTML = `<p><strong>Description:</strong> ${record.description}</p>
                <p><strong>Record ID:</strong> ${record.record_id}</p>
                <p><strong>Record Date:</strong> ${new Date(record.record_date).toLocaleString()}</p>
                <p><strong>Record Type:</strong> ${record.record_type}</p>
                <button id="update-details-btn">Update Details</button>`;
                // Bind event listener for the update button
                document.getElementById('update-details-btn').addEventListener('click', openhealthAddMemberForm);
        } else {
            console.log(`No ${tableName} data found for memberId ${memberId}`);
            const detailsContainer = document.getElementById('family-details-container');
            detailsContainer.innerHTML = `
               <button id="update-details-btn">Update Details</button>`;
                // Bind event listener for the update button
            document.getElementById('update-details-btn').addEventListener('click', openhealthAddMemberForm);
        }
    })
    .catch(error => console.error(`Error fetching ${tableName} data:`, error));
}

// Example for fetching medications for a family member
function fetchMedications() {
    tableName = 'medications';
    memberId = currentMemberId;
    fetch(`${apiUrl}/${tableName}/${memberId}`)
    .then(response => response.json())
    .then(data => {
        // Assuming data is an array with a single object as per your console log
        if (data.length > 0) {
            const record = data[0]; // Accessing the first object in the array
            // Update the UI to display fetched data
            console.log(`Fetched ${tableName} data:`, record);
            // Example: Update UI with fetched data
            const detailsContainer = document.getElementById('family-details-container');
            detailsContainer.innerHTML = `<p><strong>Medication Name:</strong> ${record.medication_name}</p>
                <p><strong>Medication ID:</strong> ${record.medication_id}</p>
                <p><strong>Dosage :</strong> ${record.dosage}</p>
                <p><strong>Frequency Type:</strong> ${record.frequency}</p>
                <button id="update-details-btn">Update Details</button>`;
                // Bind event listener for the update button
                document.getElementById('update-details-btn').addEventListener('click', openmedicationAddMemberForm);
        } else {
            console.log(`No ${tableName} data found for memberId ${memberId}`);
        }
    })
    .catch(error => console.error(`Error fetching ${tableName} data:`, error));
}

// Example for fetching Appointment for a family member
function fetchAppointments() {
    tableName = 'appointments';
    memberId = currentMemberId;
    fetch(`${apiUrl}/${tableName}/${memberId}`)
    .then(response => response.json())
    .then(data => {
        // Assuming data is an array with a single object as per your console log
        if (data.length > 0) {
            const record = data[0]; // Accessing the first object in the array
            // Update the UI to display fetched data
            console.log(`Fetched ${tableName} data:`, record);
            // Example: Update UI with fetched data
            const detailsContainer = document.getElementById('family-details-container');
            detailsContainer.innerHTML = `<p><strong>Appointment ID:</strong> ${record.appointment_id}</p>
                <p><strong>Appointment Date:</strong> ${new Date(record.appointment_date).toLocaleString()}</p>
                <p><strong>Purpose :</strong> ${record.purpose}</p>
                <p><strong>Provider Name:</strong> ${record.provider_name}</p>
                <button id="update-details-btn">Update Details</button>`;
                // Bind event listener for the update button
                document.getElementById('update-details-btn').addEventListener('click', openappointmentAddMemberForm);
        } else {
            console.log(`No ${tableName} data found for memberId ${memberId}`);
        }
    })
    .catch(error => console.error(`Error fetching ${tableName} data:`, error));
}


