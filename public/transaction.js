async function fetchReservationData() {
    try {
      // Make an API call to retrieve the session data
      const response = await fetch('/api/getReservation');
      const data = await response.json();
      
      // Log the roomType to the console
      console.log('Room Type from session:', data.roomType);
      
      // Update the content of the roomInfo div without overwriting the entire page
      document.getElementById('roomInfo').innerHTML = `Room Type from session: ${data.roomType}`;
    } catch (err) {
      console.error('Error fetching reservation data:', err);
    }
  }

  // Call the function when the page loads
  window.onload = fetchReservationData;

















