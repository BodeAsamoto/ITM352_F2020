/*---------------------------------- GENERAL FUNCTIONS USED EVERWHERE ----------------------------------*/
function faviconInfo(){ //contains favicon and css information
    document.write(`
      <link rel="stylesheet" href="./css/home.css">
      <link rel="icon" href="./images/letterR.ico" type="image/x-icon">
      <link rel="shortcut icon" href="./images/letterR.png" type="image/png">
    `)
}

function navBar1() {
  // Check the cookies to determine the login and staff type
  let isloggedin = getCookie("loggedIn");
  let CookieStaff = getCookie("staff");
  
  // Create the navbar content
  let navbarContent = '';

  if (isloggedin == 1) {
    if (CookieStaff == 1) {
      navbarContent = `
        <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
          <div class="container">
            <a class="navbar-brand" href="index.html">McNaughton Group Staff View</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="oi oi-menu"></span> Menu
            </button>
            <div class="collapse navbar-collapse" id="ftco-nav">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="rooms.html" class="nav-link">Rooms</a></li>
                <li class="nav-item"><a href="currentguestlist.html" class="nav-link">Guest List</a></li>
                <li class="nav-item"><a href="guestLookup.html" class="nav-link">Guest Lookup</a></li>
                <li class="nav-item"><a href="./logout" class="nav-link" onclick="logout()">Log Out</a></li>
                <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
              </ul>
            </div>
          </div>
        </nav>
      `;
    } else if (CookieStaff == 2) {
      navbarContent = `
        <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
          <div class="container">
            <a class="navbar-brand" href="index.html">McNaughton Group Manager View</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="oi oi-menu"></span> Menu
            </button>
            <div class="collapse navbar-collapse" id="ftco-nav">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="rooms.html" class="nav-link">Rooms</a></li>
                <li class="nav-item"><a href="currentguestlist.html" class="nav-link">Guest List</a></li>
                <li class="nav-item"><a href="guestLookup.html" class="nav-link">Guest Lookup</a></li>
                <li class="nav-item"><a href="./logout" class="nav-link" onclick="logout()">Log Out</a></li>
                <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
              </ul>
            </div>
          </div>
        </nav>
      `;
    }
  } else {
    navbarContent = `
      <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div class="container">
          <a class="navbar-brand" href="index.html">McNaughton Group</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="oi oi-menu"></span> Menu
          </button>
          <div class="collapse navbar-collapse" id="ftco-nav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
              <li class="nav-item"><a href="rooms.html" class="nav-link">Rooms</a></li>
              <li class="nav-item"><a href="restaurant.html" class="nav-link">Restaurant</a></li>
              <li class="nav-item"><a href="about.html" class="nav-link">About</a></li>
              <li class="nav-item"><a href="login.html" class="nav-link">Login</a></li>
              <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  // Inject the navbar content into the navbar-container div
  document.getElementById('navbar-container').innerHTML = navbarContent;
}





function navBar() { // the function that generates the nav bar
  let isloggedin = getCookie("loggedIn");
  let CookieStaff = getCookie("staff");
  if (isloggedin == 1) {
      if(CookieStaff == 1){
          document.write(`
              <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                  <div class="container">
                    <a class="navbar-brand" href="index.html">McNaughton Group Staff View</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                      <span class="oi oi-menu"></span> Menu
                    </button>
                    <div class="collapse navbar-collapse" id="ftco-nav">
                      <ul class="navbar-nav ml-auto">
                        <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
                        <li class="nav-item"><a href="rooms.html" class="nav-link">Rooms</a></li>
                        <li class="nav-item"><a href="currentguestlist.html" class="nav-link">Guest List</a></li>
                        <li class="nav-item"><a href="guestLookup.html" class="nav-link">Guest Lookup</a></li>
                        <li class="nav-item"><a href="./logout" class="nav-link" onclick="logout()">Log Out</a></li>
                        <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
                      </ul>
                    </div>
                  </div>
                </nav>
          `);
      } else if(CookieStaff == 2) {
          document.write(`
              <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
  <div class="container">
    <a class="navbar-brand" href="index.html">McNaughton Group Staff View</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="oi oi-menu"></span> Menu
    </button>
    <div class="collapse navbar-collapse" id="ftco-nav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
        <li class="nav-item"><a href="rooms.html" class="nav-link">Rooms</a></li>

        <!-- Dropdown for Reports -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="reportsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Reports
          </a>
          <div class="dropdown-menu" aria-labelledby="reportsDropdown">
            <a class="dropdown-item" href="currentguestlist.html">Guest List</a>
            <a class="dropdown-item" href="dailyguestcheckin.html">Daily Check-Ins</a>
            <a class="dropdown-item" href="dailyguestcheckout.html">Daily Check-Outs</a>
          </div>
        </li>

        <li class="nav-item"><a href="guestLookup.html" class="nav-link">Guest Lookup</a></li>
        <li class="nav-item"><a href="./logout" class="nav-link" onclick="logout()">Log Out</a></li>
        <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>

          `);
      } else {
  document.write(`
      <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div class="container">
          <a class="navbar-brand" href="index.html">McNaughton Group Guest View</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="oi oi-menu"></span> Menu
          </button>
          <div class="collapse navbar-collapse" id="ftco-nav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
              <li class="nav-item"><a href="rooms.html" class="nav-link">Rooms</a></li>
              <li class="nav-item"><a href="restaurant.html" class="nav-link">Restaurant</a></li>
              <li class="nav-item"><a href="about.html" class="nav-link">About</a></li>
              <li class="nav-item"><a href="./logout" class="nav-link" onclick="logout()">Log Out</a></li>
              <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>
  `);}
  }else{
      document.write(`
          <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
              <div class="container">
                <a class="navbar-brand" href="index.html">McNaughton Group</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="oi oi-menu"></span> Menu
                </button>
                <div class="collapse navbar-collapse" id="ftco-nav">
                  <ul class="navbar-nav ml-auto">
                    <li class="nav-item active"><a href="index.html" class="nav-link">Home</a></li>
                    <li class="nav-item"><a href="rooms.html" class="nav-link">Rooms</a></li>
                    <li class="nav-item"><a href="restaurant.html" class="nav-link">Restaurant</a></li>
                    <li class="nav-item"><a href="about.html" class="nav-link">About</a></li>
                    <li class="nav-item"><a href="login.html" class="nav-link">Login</a></li>
                    <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
                  </ul>
                </div>
              </div>
            </nav>
    `);
  }
}

function styleStuff(){ //contains favicon and css information
    document.write(`
<link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i" rel="stylesheet">

    <link rel="stylesheet" href="css/open-iconic-bootstrap.min.css">
    <link rel="stylesheet" href="css/animate.css">
    
    <link rel="stylesheet" href="css/owl.carousel.min.css">
    <link rel="stylesheet" href="css/owl.theme.default.min.css">
    <link rel="stylesheet" href="css/magnific-popup.css">

    <link rel="stylesheet" href="css/aos.css">

    <link rel="stylesheet" href="css/ionicons.min.css">

    <link rel="stylesheet" href="css/bootstrap-datepicker.css">
    <link rel="stylesheet" href="css/jquery.timepicker.css">

    
    <link rel="stylesheet" href="css/flaticon.css">
    <link rel="stylesheet" href="css/icomoon.css">
    <link rel="stylesheet" href="css/style.css"></link>
    `)
}

function footer() {
    document.write(`    <footer class="ftco-footer ftco-bg-dark ftco-section">
      <div class="container">
        <div class="row mb-5">
          <div class="col-md">
            <div class="ftco-footer-widget mb-4">
              <h2 class="ftco-heading-2">Deluxe Hotel</h2>
              <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
              <ul class="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                <li class="ftco-animate"><a href="#"><span class="icon-twitter"></span></a></li>
                <li class="ftco-animate"><a href="#"><span class="icon-facebook"></span></a></li>
                <li class="ftco-animate"><a href="#"><span class="icon-instagram"></span></a></li>
              </ul>
            </div>
          </div>
          <div class="col-md">
            <div class="ftco-footer-widget mb-4 ml-md-5">
              <h2 class="ftco-heading-2">Useful Links</h2>
              <ul class="list-unstyled">
                <li><a href="#" class="py-2 d-block">Blog</a></li>
                <li><a href="#" class="py-2 d-block">Rooms</a></li>
                <li><a href="#" class="py-2 d-block">Amenities</a></li>
                <li><a href="#" class="py-2 d-block">Gift Card</a></li>
              </ul>
            </div>
          </div>
          <div class="col-md">
             <div class="ftco-footer-widget mb-4">
              <h2 class="ftco-heading-2">Privacy</h2>
              <ul class="list-unstyled">
                <li><a href="#" class="py-2 d-block">Career</a></li>
                <li><a href="#" class="py-2 d-block">About Us</a></li>
                <li><a href="#" class="py-2 d-block">Contact Us</a></li>
                <li><a href="#" class="py-2 d-block">Services</a></li>
              </ul>
            </div>
          </div>
          <div class="col-md">
            <div class="ftco-footer-widget mb-4">
            	<h2 class="ftco-heading-2">Have a Questions?</h2>
            	<div class="block-23 mb-3">
	              <ul>
	                <li><span class="icon icon-map-marker"></span><span class="text">203 Fake St. Mountain View, San Francisco, California, USA</span></li>
	                <li><a href="#"><span class="icon icon-phone"></span><span class="text">+2 392 3929 210</span></a></li>
	                <li><a href="#"><span class="icon icon-envelope"></span><span class="text">info@yourdomain.com</span></a></li>
	              </ul>
	            </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 text-center">
          </div>
        </div>
      </div>
    </footer>`)
}




function getCurrentDate() { // Function to get the current date in the format YYYY-MM-DD
    // Function from ChatGPT using the "make me a function that gets todays date using javascript" prompt
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function logout() { // deletes the logged in cookie and reloads the page
  // Deletes all cookies
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "librarianC=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "totalIC=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =  "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Reload the current page
  location.reload();
}

function loadJSON(service, callback) { // This function asks the server for a "service" and converts the response to text.
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('POST', service, false);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}

function reloadPageFor1Seconds() {
  let seconds = 0;
  const reloadInterval = setInterval(function () {
      if (seconds < 1) {
          location.reload();
          seconds++;
      } else {
          clearInterval(reloadInterval);
      }
  }, 1000); // 1000 milliseconds = 1 second
}

/*------------------------- INVOICE AND SHOPPING CART PAGE SPECIFIC FUNCTIONS --------------------------*/

function updateQuantity(location, productIndex){
  // get the shopping cart data for this user
  loadJSON(`update_cart?location=${location}&productIndex=${productIndex}&value=${document.getElementById(`quantityTextbox${location}_${productIndex}`).value}`, function (response) {
  // Parsing JSON string into object
  shopping_cart = JSON.parse(response);
  reloadPageFor1Seconds();
});
}

function updateFav(location, productIndex){
  console.log(location, productIndex, document.getElementById(`checkbox${location}_${productIndex}`).value);
  // get the shopping cart data for this user
  loadJSON(`update_fav?location=${location}&productIndex=${productIndex}&value=${document.getElementById(`checkbox${location}_${productIndex}`).value}`, function (response) {
  // Parsing JSON string into object
  shopping_cart = JSON.parse(response);
});
}

/*----------------------------------------- COOKIE FUNCTIONs -------------------------------------------*/

function setCookie(name, value, minutesToExpire) {// Function to set a cookie with a specified expiration time
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (minutesToExpire * 60 * 1000));
  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieString;
}

function getCookie(name){// Function to get the value of a cookie by name
    let cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

function checkCookie(cookieName) {// Function to check if a cookie exists
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName + "=") === 0) {
          return true; // Cookie found
      }
  }
  return false; // Cookie not found
}

/*------------------------------------------------------------------------------------------------------*/



function box() {
document.write(`
    <!-- HERO SECTION -->
    <div class="hero-wrap" style="background-image: url('images/bg_1.jpg');">
        <div class="overlay"></div>
        <div class="container">
            <div class="row no-gutters slider-text d-flex align-items-end justify-content-center">
                <div class="col-md-9 ftco-animate text-center d-flex align-items-end justify-content-center">
                    <div class="text">
                        <p class="breadcrumbs mb-2"><span class="mr-2"><a href="index.html">Home</a></span> <span>Checkout</span></p>
                        <h1 class="mb-4 bread">Checkout</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- TRANSACTION FORM -->
    <section class="ftco-section bg-white">
        <div class="container">
            <div class="row">
                <div class="col-lg-7">
                    <div class="bg-white p-4 ftco-animate">
                        <h3 class="mb-4">Guest & Payment Information</h3>
                        <form id="myForm" action="/process-transaction" method="POST">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="firstName">First Name</label>
                                    <input type="text" class="form-control" id="firstName" name="firstName" required />
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="lastName">Last Name</label>
                                    <input type="text" class="form-control" id="lastName" name="lastName" required />
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" class="form-control" id="email" name="email" required />
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" class="form-control" id="phone" name="phone" required />
                            </div>
                            <div class="form-group">
                                <label for="specialRequests">Special Requests (Optional)</label>
                                <textarea class="form-control" id="specialRequests" name="specialRequests" rows="3"></textarea>
                            </div>
                            <hr />
                            <div class="form-group">
                                <label for="cardName">Cardholder Name</label>
                                <input type="text" class="form-control" id="cardName" name="cardName" required />
                            </div>
                            <div class="form-group">
                                <label for="cardNumber">Card Number</label>
                                <input type="text" class="form-control" id="cardNumber" name="cardNumber" maxlength="19" placeholder="xxxx xxxx xxxx xxxx" required />
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="expDate">Expiration Date</label>
                                    <input type="text" class="form-control" id="expDate" name="expDate" placeholder="MM/YY" maxlength="5" required />
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="cvv">CVV</label>
                                    <input type="text" class="form-control" id="cvv" name="cvv" maxlength="4" placeholder="123" required />
                                </div>
                            </div>
                            <!-- New fields for Check-In and Check-Out -->
                            <div class="form-group col-md-6">
                                <label for="Check_In">Check-In Date:</label>
                                <input type="date" class="form-control" id="Check_In" name="Check_In" required />
                            </div>
                            <div class="form-group col-md-6">
                                <label for="Check_Out">Check-Out Date:</label>
                                <input type="date" class="form-control" id="Check_Out" name="Check_Out" required />
                            </div>
                            <div class="form-group col-md-6">
                                <label for="Total_Spent">Total Spent:</label>
                                <input type="number" class="form-control" id="Total_Spent" name="Total_Spent" required />
                            </div>
                            <button type="submit" class="btn btn-success btn-block py-2 mt-3">Confirm Transaction</button>
                        </form>
                    </div>
                </div>

                <!-- Right: Price Details -->
                <div class="col-lg-5">
                    <div class="bg-white p-4 ftco-animate">
                        <h3 class="mb-4">Price Details</h3>
                        <div class="d-flex justify-content-between mb-1">
                            <div>
                                <h5 class="mb-0">meow</h5>

                                <small class="text-muted">Hotel Renew · 1 Night Stay</small>
                            </div>
                            <h5 class="mb-0">$129.00</h5>
                        </div>
                        <hr />
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Gift or discount code" form="myForm"/>
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button">Apply</button>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="mb-1">Hotel Fee</p>
                            <p class="mb-1">$49.80</p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="mb-1">Taxes</p>
                            <p class="mb-1">$7.24</p>
                        </div>
                        <hr />
                        <div class="d-flex justify-content-between">
                            <p class="mb-1 font-weight-bold">Subtotal</p>
                            <p class="mb-1 font-weight-bold">$57.04</p>
                        </div>
                        <hr />
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-0">Total</h5>
                                <small class="text-muted">Including $2.24 in HI taxes</small>
                            </div>
                            <h3 class="mb-0">$186.04</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`)
}




function generateBox123(){  
	document.write(`
	<div class="col-sm col-md-6 col-lg-4 ftco-animate">
							<div class="room" data-room="Suite Room">
							  <a href="Transaction.html" class="img d-flex justify-content-center align-items-center" style="background-image: url(images/room-1.jpg);">
								<div class="icon d-flex justify-content-center align-items-center"><span class="icon-search2"></span></div>
							  </a>
							  <div class="text p-3 text-center">
								<h3 class="mb-3"><a href="Transaction.html">Suite Room</a></h3>
								<p><span class="price mr-2">$120.00</span> <span class="per">per night</span></p>
								<ul class="list">
								  <li><span>Max:</span> 3 Persons</li>
								  <li><span>Size:</span> 45 m²</li>
								  <li><span>View:</span> Sea View</li>
								  <li><span>Bed:</span> 1</li>
								</ul>
								<hr>
								<p class="pt-1"><a href="Transaction.html" class="btn-custom">Book Now <span class="icon-long-arrow-right"></span></a></p>
							  </div>
							</div>
						  </div>`)};