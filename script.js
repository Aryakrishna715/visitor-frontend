async function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect form data from input fields
    const visitorName = document.getElementById('visitorName').value.trim();
    const noOfPersons = document.getElementById('noOfPersons').value.trim();
    const purpose = document.getElementById('purpose').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const visitDate = document.getElementById('visitDate').value.trim();

    // Validate the form inputs (ensure all fields are filled)
    if (!visitorName || !noOfPersons || !purpose || !contactNumber || !visitDate) {
        document.getElementById('formMessage').innerHTML = `
            <div class="error-message">
                <p>All fields are required. Please fill out the form completely.</p>
            </div>
        `;
        return;
    }
     // Add the current timestamp
     const submissionTime = new Date().toISOString();

    // Prepare the form data
    const formData = {
        visitorName,
        noOfPersons: parseInt(noOfPersons, 10), // Ensure 'noOfPersons' is a number
        purpose,
        contactNumber,
        visitDate,
        submissionTime, 
    };

    // Log the form data for debugging
    console.log('Form Data:', formData);

    try {
        // Make a POST request to submit the form data to the backend
        const response = await fetch('https://visitor-backend-10.onrender.com/submit', { // Ensure the backend route matches
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convert the formData object to a JSON string
        });

        // Handle the response from the server
        if (response.ok) {
            const result = await response.json(); // Parse the JSON response
            console.log('Server Response:', result);

            // Show a success message and provide a link to download the E-Pass
            document.getElementById('formMessage').innerHTML = `
                <div class="success-message">
                    <p>Thank you, ${visitorName}, for submitting your information!</p>
                    <p>You can download your E-Pass by clicking the link below:</p>
                    <a href="${result.downloadLink}" target="_blank" class="download-link">Download E-Pass</a>
                </div>
            `;
        } else {
            // Handle server-side errors
            const errorResult = await response.json(); // Parse the error response
            console.error('Server Error:', errorResult);

            document.getElementById('formMessage').innerHTML = `
                <div class="error-message">
                    <p>Error: ${errorResult.message || 'An unknown error occurred.'}</p>
                </div>
            `;
        }
    } catch (err) {
        // Handle client-side errors (e.g., network issues)
        console.error('Error handling form submission:', err);
        document.getElementById('formMessage').innerHTML = `
            <div class="error-message">
                <p>Sorry, there was an error submitting your form. Please try again later.</p>
            </div>
        `;
    }
}
