var express = require('express');
var app = express();
var myParser = require("body-parser");
var mysql = require('mysql');
const session = require('express-session');

app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));

let userLoggedin = {};

const fs = require('fs');
const { type } = require('os');

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (typeof req.session.reservation === 'undefined') {
    req.session.reservation = {};
  }
  next(); // Move to the next middleware or route handler
});

// monitor all requests and make a reservation
app.all('*', function (request, response, next){// this function also makes reservations
  console.log(request.method + ' to ' + request.path);
  next();
});

/*---------------------------------- DATABASE CONNECTION ----------------------------------*/
 console.log("Connecting to localhost..."); 
var con = mysql.createConnection({// Actual DB connection occurs here
  host: '127.0.0.1',
  user: "root",
  port: 3306,
  database: "RHW_database", // CHANGE THIS
  password: ""
}); 

con.connect(function (err) {// Throws error or confirms connection
  if (err) throw err;
 console.log("Connected!");
});

/*---------------------------------- Custom query page ----------------------------------*/
app.post('/api/customQuery', (req, res) => {
  const { query } = req.body;

  const isSelectQuery = query.trim().toLowerCase().startsWith('select');
  if (!isSelectQuery) {
    return res.json({ error: 'Only SELECT queries are allowed for security reasons.' });
  }

  con.query(query, (err, results) => {
    if (err) {
      console.error("Custom query error:", err);
      return res.json({ error: err.sqlMessage || 'Query execution failed.' });
    }

    res.json(results);
  });
});

/*----------------------------- Room lookup -----------------------------*/

app.post('/api/searchRooms', (req, res) => {
  const result = req.body.input;
  req.session.RoomLookup = result;
  res.redirect('/roomSearchResult.html');
});

app.get('/api/roominfo', (req, res) => {
  const hotelId = req.session.RoomLookup;

  const query = `
    SELECT r.Room_Type, r.Status, r.Capacity, h.Hotel_Name
    FROM Rooms r
    JOIN Hotel h ON r.Hotel_ID = h.Hotel_ID
    WHERE r.Hotel_ID = ?
  `;

  con.query(query, [hotelId], (err, results) => {
    if (err) {
      console.error("Room lookup failed:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


/*----------------------------- Inventory lookup -----------------------------*/

// Step 1: POST route to receive the input, store in session, and redirect
app.post('/api/searchInventory', (req, res) => {
  const result = req.body.input; // expected from form field named 'input'
  req.session.InventoryLookup = result; // Store search input in session
  res.redirect('/inventorySearchResult.html'); // Redirect to results display page
});

// Step 2: GET route to return item data from DB based on session-stored input
app.get('/api/inventoryinfo', (req, res) => {
  const itemSearch = req.session.InventoryLookup;

  if (!itemSearch) {
    return res.status(400).json({ error: 'No search input found in session.' });
  }

  const query = `
    SELECT ItemName, Status, Quantity
    FROM Inventory
    WHERE TRIM(LOWER(ItemName)) = TRIM(LOWER(?))
  `;

  con.query(query, [itemSearch], (err, results) => {
    if (err) {
      console.error("Failed to fetch inventory info:", err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

/*---------------------------------- cancellation form ----------------------------------*/
app.post('/cancelReservation', (req, res) => {
  const { Guest_ID, Res_ID } = req.body;

  const query = `DELETE FROM GuestReservation WHERE Guest_ID = ? AND Res_ID = ?`;

  con.query(query, [Guest_ID, Res_ID], (err, result) => {
    if (err) {
      console.error("Error cancelling reservation:", err);
      return res.status(500).send("Cancellation failed.");
    }
    console.log("Reservation cancelled:", result);
    res.redirect('/cancellation-success.html');
  });
});


/*---------------------------------- supplier update ----------------------------------*/
app.post('/addSupplier', (req, res) => {
  const { Supplier_ID, Supplier_Name, Contact_Info, Address } = req.body;

  const checkQuery = `SELECT * FROM Supplier WHERE Supplier_ID = ?`;

  con.query(checkQuery, [Supplier_ID], (err, results) => {
    if (err) {
      console.error("Error checking supplier:", err);
      return res.status(500).send("Database check failed.");
    }

    if (results.length > 0) {
      // Supplier exists → UPDATE
      const updateQuery = `
        UPDATE Supplier
        SET Supplier_Name = ?, Contact_Info = ?, Address = ?
        WHERE Supplier_ID = ?
      `;

      con.query(updateQuery, [Supplier_Name, Contact_Info, Address, Supplier_ID], (err, result) => {
        if (err) {
          console.error("Error updating supplier:", err);
          return res.status(500).send("Supplier update failed.");
        }
        console.log("Supplier updated:", result);
        res.redirect('/supplier-success.html');
      });

    } else {
      // Supplier doesn't exist → INSERT
      const insertQuery = `
        INSERT INTO Supplier (Supplier_ID, Supplier_Name, Contact_Info, Address)
        VALUES (?, ?, ?, ?)
      `;

      con.query(insertQuery, [Supplier_ID, Supplier_Name, Contact_Info, Address], (err, result) => {
        if (err) {
          console.error("Error inserting supplier:", err);
          return res.status(500).send("Supplier insert failed.");
        }
        console.log("Supplier inserted:", result);
        res.redirect('/supplier-success.html');
      });
    }
  });
});


/*---------------------------------- inventory update ----------------------------------*/
app.post('/updateInventory', (req, res) => {
  const { ItemName, Quantity, Status, Hotel_ID } = req.body;

  const checkQuery = `
    SELECT * FROM Inventory 
    WHERE TRIM(LOWER(ItemName)) = TRIM(LOWER(?)) AND Hotel_ID = ?
  `;

  con.query(checkQuery, [ItemName, Hotel_ID], (err, results) => {
    if (err) {
      console.error("Error checking inventory:", err);
      return res.status(500).send("Database check failed.");
    }

    if (results.length > 0) {
      // Item exists — perform UPDATE
      const updateQuery = `
        UPDATE Inventory
        SET Quantity = ?, Status = ?
        WHERE TRIM(LOWER(ItemName)) = TRIM(LOWER(?)) AND Hotel_ID = ?
      `;

      con.query(updateQuery, [Quantity, Status, ItemName, Hotel_ID], (err, result) => {
        if (err) {
          console.error("Error updating inventory:", err);
          return res.status(500).send("Inventory update failed.");
        }
        console.log("Inventory updated:", result);
        res.redirect('/inventory-success.html');
      });

    } else {
      // Item doesn't exist — generate unique Inventory_ID
      const idQuery = `SELECT MAX(Inventory_ID) AS maxId FROM Inventory`;

      con.query(idQuery, (err, idResult) => {
        if (err) {
          console.error("Error generating inventory ID:", err);
          return res.status(500).send("Failed to generate Inventory_ID.");
        }

        const newInventoryId = (idResult[0].maxId || 0) + 1;

        const insertQuery = `
          INSERT INTO Inventory (Inventory_ID, Hotel_ID, ItemName, Status, Quantity)
          VALUES (?, ?, ?, ?, ?)
        `;

        con.query(insertQuery, [newInventoryId, Hotel_ID, ItemName, Status, Quantity], (err, result) => {
          if (err) {
            console.error("Error inserting inventory:", err);
            return res.status(500).send("Inventory insert failed.");
          }
          console.log("Inventory inserted with ID:", newInventoryId);
          res.redirect('/inventory-success.html');
        });
      });
    }
  });
});


/*---------------------------------- daily guest checkout list ----------------------------------*/
app.get('/api/guestcheckouttoday', (req, res) => {
  const query = 'SELECT * FROM GuestCheckOutToday';
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching guest check-outs:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

/*---------------------------------- daily guest checkin list ----------------------------------*/
app.get('/api/guestcheckintoday', (req, res) => {
  const query = 'SELECT * FROM GuestCheckInToday';
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching guest check-ins:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

/*---------------------------------- current guest list attempt 2 ----------------------------------*/
app.get('/api/currentguests', (req, res) => {
  const query = `
    SELECT 
      First_Name,
      Last_Name,
      Email,
      Phone,
      Check_In_Date,
      Check_Out_Date,
      Length_of_Stay,
      Room_Number,
      Hotel_Name,
      Hotel_Location
    FROM CurrentGuestList;
  `;

  con.query(query, (err, results) => {
    if (err) {
      console.error("Failed to fetch guest list:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

/*----------------------------- Parameter Query ---------------------*/

app.post('/api/searchGuest', (req, res) => {
  const result = req.body.input;
  req.session.GuestLookup = result;  // Store the value in session
  // Redirect to results.html with the input as a query string
  res.redirect(`/guestSearchResult.html`);
});

app.get('/api/guestinfo', (req, res) => {
  const guestLookup = req.session.GuestLookup;
  const query = `
    (SELECT *
    FROM guest
    WHERE Lname LIKE ?)
    UNION
    (SELECT *
    FROM guest
    WHERE Email LIKE ?)
    UNION
    (SELECT *
    FROM guest
    WHERE Phone LIKE ?);
  `;
  
  con.query(query, [guestLookup, guestLookup, guestLookup], (err, results) => {
    if (err) {
      console.error("Failed to fetch guest list:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });

});

/*----------------------------- Transaction Route (Add this new route) ---------------------*/

// sending back the cart 
app.post('/get_reservation', function(request, response, next){
  // the response will be json
  response.type('json');
  // turning the cart into a JSON string and sending it
  response.send(JSON.stringify(request.session.reservation));
});

app.get('/api/getReservation', (req, res) => {
  const roomType = req.session.reservation ? req.session.reservation.roomType : 'Not available';
  res.json({ roomType });
});

app.post('/toTransaction', function (request, response) {
  const roomType = request.body.roomType;
  request.session.requestedRoom = roomType;  // Store the value in session
  response.redirect(`./transactions.html`); // Redirect
});

app.get('/api/roomInfo', (req, res) => {
  const roomType = req.session.requestedRoom;
  const query = `
    SELECT Room_Type, Price_per_day
    FROM rooms
    WHERE Room_Type = ?;
  `;
  
  con.query(query, [roomType], (err, results) => {
    if (err) {
      console.error("Failed to fetch:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Add the new route for processing transactions
app.post('/process-transaction', (req, res) => {
  const { firstName, lastName, email, phone, specialRequests, cardName, cardNumber, expDate, cvv, Check_In, Check_Out, Total_Spent } = req.body;

  // Generate unique IDs
  const guestId = Math.floor(Math.random() * 1000000);  // Example for generating a random ID for Guest
  const resId = Math.floor(Math.random() * 1000000);    // Generate Reservation ID
  const hotelId = Math.floor(Math.random() * 3) + 1;    // Randomly assign Hotel_ID (1, 2, or 3)
  const historyId = Math.floor(Math.random() * 1000000);  // Randomly generate a unique history ID for StayHistory

  // SQL query to insert into the GuestReservation table
  const queryGuestReservation = `
      INSERT INTO GuestReservation (Guest_ID, Res_ID, Check_In, Check_Out, Total_Spent, Special_Requests)
      VALUES (?, ?, ?, ?, ?, ?);
  `;

  // SQL query to insert into the Reservation table
  const queryReservation = `
      INSERT INTO Reservation (Res_ID, Guest_ID, Hotel_ID)
      VALUES (?, ?, ?);
  `;

  // Insert into the GuestReservation table
  con.query(queryGuestReservation, [guestId, resId, Check_In, Check_Out, Total_Spent, specialRequests], (err) => {
      if (err) {
          console.error('Error inserting into GuestReservation:', err);
          return res.status(500).send('Error during transaction process.');
      }

      // Insert into the Reservation table
      con.query(queryReservation, [resId, guestId, hotelId], (err) => {
          if (err) {
              console.error('Error inserting into Reservation:', err);
              return res.status(500).send('Error during transaction process.');
          }

          // Insert into StayHistory table
          const roomId = Math.floor(Math.random() * 100);  // Example room ID, could be selected based on availability
          con.query(queryStayHistory, [historyId, guestId, Check_In, Check_Out, roomId, hotelId, Total_Spent], (err) => {
              if (err) {
                  console.error('Error inserting into StayHistory:', err);
                  return res.status(500).send('Error during transaction process.');
              }

              // Redirect to the success page after successful insertion
              res.redirect('/transaction-success.html');
          });
      });
  });
});

/*----------------------------- Check-In Route (Add this new route) ---------------------*/
app.post('/checkin', (req, res) => {
  const { Guest_ID, Fname, Lname, Email, Phone, Address, Check_In, Hotel_Name } = req.body;

  // SQL query to insert into the Guest table
  const queryGuest = `
    INSERT INTO Guest (Guest_ID, Fname, Lname, Email, Phone, Address)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  
  // SQL query to insert into the GuestReservation table
  const queryReservation = `
    INSERT INTO GuestReservation (Guest_ID, Res_ID, Check_In, Hotel_Name)
    VALUES (?, ?, ?, ?);
  `;

  const Res_ID = generateUniqueReservationID(); // Unique ID generation

  // Insert guest details into the Guest table
  con.query(queryGuest, [Guest_ID, Fname, Lname, Email, Phone, Address], (err) => {
    if (err) {
      console.error('Error inserting into Guest:', err);
      return res.redirect('/checkin-success.html'); // Redirect even if error occurs
    }

    // Insert reservation details into the GuestReservation table
    con.query(queryReservation, [Guest_ID, Res_ID, Check_In, Hotel_Name], (err) => {
        if (err) {
            console.error('Error inserting into GuestReservation:', err);
            return res.redirect('/checkin-success.html'); // Redirect even if error occurs
        }

        // Redirect to checkin-success.html after successful check-in
        res.redirect('/checkin-success.html'); // Successful redirection
    });
  });
});

/*---------------------------------- Check-Out Route ----------------------------------*/
app.post('/checkout', (req, res) => {
  const { Guest_ID } = req.body;  // Get the Guest_ID from the form

  // SQL query to delete the guest from the Guest table
  const queryDeleteGuest = `
      DELETE FROM Guest WHERE Guest_ID = ?;
  `;

  // SQL query to remove any associated records from GuestReservation table (optional)
  const queryDeleteReservation = `
      DELETE FROM GuestReservation WHERE Guest_ID = ?;
  `;

  // Delete from GuestReservation table first
  con.query(queryDeleteReservation, [Guest_ID], (err) => {
      if (err) {
          console.error('Error deleting from GuestReservation:', err);
          return res.status(500).send('Error during check-out process.');
      }

      // Then, delete from Guest table
      con.query(queryDeleteGuest, [Guest_ID], (err) => {
          if (err) {
              console.error('Error deleting from Guest:', err);
              return res.status(500).send('Error during check-out process.');
          }

          console.log(`Guest with ID ${Guest_ID} has been checked out and removed.`);
          res.redirect('/checkout-success.html');  // Redirect to a success page or display a message
      });
  });
});

/*------------------------- Helper Function for Unique Reservation ID -------------------*/
function generateUniqueReservationID() {
  return `R${Math.floor(100000 + Math.random() * 900000)}`;
}

/*---------------------------------- LOGIN/LOGOUT/REGISTER ----------------------------------*/

app.post('/loginGuest', (request, response) => {
  const the_username = request.body.username.toLowerCase();
  const the_password = request.body.password;

  // Define query to validate user credentials
  const query = `
    SELECT g.Email, g.Password 
    FROM guest g
    WHERE g.Email = ?;
  `;

  con.query(query, [the_username], (err, results) => {
    console.log(`${results[0]}`);

    if (err) {
      console.error('Database error:', err);
      return response.status(500).send('Internal Server Error');
    }

    // Check if email exists
    if (results.length === 0) {
      return response.status(401).send('Invalid username or password');
    }

    const user = results[0];

    // Check if password exists
    if (user.Password !== the_password) {
      return response.status(401).send('Invalid username or password');
    }

    // Store User_ID and User_Name in session
//    request.session.Account_Name = user.User_Name; // User_Name
//    request.session.Account_ID = user.User_ID;     // User_ID

//    console.log(`User_Name ${user.User_Name} stored in session.`);
//    console.log(`User_ID ${user.User_ID} stored in session.`);

    // Set logged-in cookie and redirect
    response.cookie("loggedIn", 1, { expire: Date.now() + 30 * 60 * 1000 }); // 30 min cookie THAT RECORDS WHEN YOU LOG IN
    return response.redirect('/rooms.html');
  });
});

app.post('/loginStaff', (request, response) => {// Login route
  const the_username = request.body.username.toLowerCase();
  const the_password = request.body.password;

  // Secure query to validate user credentials
  const query = `
    SELECT s.Email, s.Password, s.Role
    FROM staff s
    WHERE s.Email = ?;
  `;

  con.query(query, [the_username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return response.status(500).send('Internal Server Error');
    }

    // Check if user exists
    if (results.length === 0) {
      return response.status(401).send('Invalid username or password');
    }

    const user = results[0];

    // Password validation
    if (user.Password !== the_password) {
      return response.status(401).send('Invalid username or password');
    }
  
    // Store User_ID and User_Name in session
    //request.session.Account_Name = user.User_Name; // User_Name
    //request.session.Account_ID = user.User_ID;     // User_ID

    //console.log(`User_Name ${user.User_Name} stored in session.`);
    //console.log(`User_ID ${user.User_ID} stored in session.`);

    // Set logged-in cookie and redirect
    response.cookie("loggedIn", 1, { expire: Date.now() + 30 * 60 * 1000 }); // 30 min cookie THAT RECORDS WHEN YOU LOG IN
    
    if (user.Role === 'Manager') {
      response.cookie("staff", 2, { expire: Date.now() + 30 * 60 * 1000 }); // manager cookie
      return response.redirect('/manager-dashboard.html'); // manager redirected to dashboard
    } else {
      response.cookie("staff", 1, { expire: Date.now() + 30 * 60 * 1000 }); // staff cookie
      return response.redirect('/employeelanding.html'); // staff redirected to rooms
    }
  });
});

app.post('/register', function (request, response) { 
  let the_username = request.body.username.toLowerCase(); // Account_Email
  let the_password = request.body.password;              // Account_Password
  let lname = request.body.lastname;                     // Last name
  let fname = request.body.firstname;                    // First name
  let fullname = fname + ' ' + lname;                    // User_Name

  // Query to insert data into the `account` table
  const queryAccount = `
    INSERT INTO account (Account_Email, Account_Password) 
    VALUES (?, ?);
  `;

  // Query to insert data into the `user` table
  const queryUser = `
    INSERT INTO user (User_ID, User_Name, Account_Email) 
    VALUES (?, ?, ?);
  `;

  // Generate a unique User_ID
  let userID = generateUniqueUserID();

  // Insert into the `account` table
  con.query(queryAccount, [the_username, the_password], (err) => {
    if (err) {
      console.error('Database error in account table:', err); 
      return response.status(500).send('Error creating account.');
    }

    // Insert into the `user` table
    con.query(queryUser, [userID, fullname, the_username], (err) => {
      if (err) {
        console.error('Database error in user table:', err);
        return response.status(500).send('Error creating user.');
      }
      // Store Account_ID and Name in the session
      request.session.Name = fullname;
      request.session.Account_ID = userID;

      console.log(`User created successfully with User_ID: ${userID}`);

      // Set logged-in cookie and redirect
      response.cookie("loggedIn", 1, { expire: Date.now() + 30 * 60 * 1000 });
      return response.redirect('/account.html');
    });
  });
});

app.get('/logout', function (request, response){// Redirects user to home page after logging out
  response.redirect(`./index.html`)
});

/*---------------------------------- MAPS SQL ----------------------------------*/

app.get("/geo", (req, res) => {
  const search = req.query.search; // Use 'search' for query parameter
  const page = parseInt(req.query.page) || 1; // Default to page 1

  if (!search) {
      return res.status(400).send("Search term is required.");
  }

  const query = `
      SELECT Record_ID, Title, D_name, Date, Subject, Description, Medium, Language 
      FROM record r 
      INNER JOIN Department d ON r.Department_ID = d.Department_ID
      WHERE Geo_Location LIKE '%${search}%';
  `;

  con.query(query, (err, result) => {
      if (err) throw err;
      // Store results in session
      req.session.results = result;
      req.session.search = search;
      req.session.what = 'geo';
      // Redirect to geo.html with the query parameters
      res.redirect(`/results.html?search=${encodeURIComponent(search)}&page=${page}`);
  });
});

app.get("/get-session-data", (req, res) => {
  if (!req.session.results || !req.session.search) {
      return res.status(404).json({ error: "No session data available." });
  }
  res.json({
      results: req.session.results, 
      search: req.session.search
  });
  console.log(req.session);
});

app.get('/get-session-details', (req, res) => {
  if (req.session.Account_ID) {
      res.json({ Account_ID: req.session.Account_ID, Account_Name: req.session.Account_Name });
  } else {
      res.status(401).json({ error: "Account number not found in session." });
  }
});

/*---------------------------------- SEARCH SQL ----------------------------------*/

app.post("/executeSearch", (req, res) => {
  const search = req.body.searchInput;
  const type = req.body.searchType;
  const format = req.body.format;

  console.log(format);

  const query = `
    SELECT Record_ID, Title, D_name, Date, Subject, Description, Medium, Language 
    FROM record r 
    INNER JOIN Department d ON r.Department_ID = d.Department_ID
    WHERE ${type} LIKE '%${search}%' AND Medium = '${format}';
    `;

  con.query(query, (err, result) => {
    if (err) throw err;
    // Store results in session
    req.session.results = result;
    req.session.search = search;
    req.session.type = type;
    req.session.format = format;
    req.session.what = 'ser';
    // Redirect to results.html with the query parameters
    res.redirect(`/results.html?search=${encodeURIComponent(search)}`);
  });
});

/*----------------------------------- REQUESTING -----------------------------------*/

app.post("/request", (req) => {
  let data = req.body;

  // Extract all keys (RecordIDs) from the incoming request body
  const recordIDs = Object.keys(data);

  console.log("Extracted RecordIDs:", recordIDs);

  // SQL query to insert a RecordID into the Contains table
  const query = `INSERT INTO contains (Record_ID) VALUES (?)`;

  // Loop through each RecordID and insert it into the database
  recordIDs.forEach((recordID) => {
    con.query(query, [recordID], (err) => {
      if (err) {
        console.error(`Error inserting RecordID '${recordID}':`, err);
      } else {
        console.log(`Inserted RecordID '${recordID}' successfully.`);
      }
    });
  });
});

app.get('/get-user-reservations', (req, res) => {
  // Retrieve Account_Name or Account_ID from the user session
  const accountId = req.session.Account_ID;

  if (!accountId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Query to fetch records linked to the user's Account_ID
  const query = `
    SELECT r.Record_ID, r.Title, d.D_name, r.Date, r.Subject, r.Description, r.Medium, r.Language, res.Reservation_Status 
    FROM record r
    JOIN department d ON r.Department_ID = d.Department_ID
    JOIN reserves res ON r.Record_ID = res.Record_ID
    WHERE res.User_ID = '${accountId}';
  `;

  // Execute the query with Account_ID as a parameter
  con.query(query, [accountId], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    // Send the fetched data to the client
    res.json({ records: results });
  });
});

// Endpoint to finalize the request
app.post('/finalizeRequest', (req, res) => {
  const reservationID = generateUniqueReservationID();
  const date = getCurrentDate();
  const accountID = req.body.accountNumber;

  // Query 0: Insert into Reservation
  const query0 = `
    INSERT INTO Reservation 
    (Reservation_ID, Account_ID, Reservation_Start_Date, Reservation_Status, Reservation_Fulfilled_Date) 
    VALUES (?, ?, ?, 'Submitted', NULL)
  `;

  // Query 1: Update contains table
  const query1 = `
    UPDATE contains 
    SET Reservation_ID = ? 
    WHERE Reservation_ID IS NULL OR Reservation_ID = '';
  `;

  // Run Query 0 (INSERT)
  con.query(query0, [reservationID, accountID, date], (err, result) => {
    if (err) {
      console.error('Error inserting into Reservation:', err.message);
      return res.status(500).send('Failed to finalize request: INSERT failed.');
    }

    console.log('Reservation created successfully.');

    // Run Query 1 (UPDATE) only after Query 0 succeeds
    con.query(query1, [reservationID], (err, updateResult) => {
      if (err) {
        console.error('Error updating contains table:', err.message);
        return res.status(500).send('Failed to finalize request: UPDATE failed.');
      }

      console.log(`Assigned Reservation_ID: ${reservationID} to ${updateResult.affectedRows} record(s).`);

      // Redirect to account.html after success
      res.redirect('/account.html');
    });
  });
});

app.post('/update-reservation-status', (req, res) => {
  const input = req.body;
  console.log(input);

  // Normalize input: ensure it's always an array
  const reservations = Array.isArray(input) ? input : [input];

  // Loop through each reservation
  reservations.forEach(reservation => {
    const userID = reservation.user_id;          // Updated to User_ID
    const recordID = reservation.record_id;      // Updated to Record_ID
    const reservationStat = reservation.status;  // Updated to Reservation_Status

    console.log(`Updating User_ID: ${userID}, Record_ID: ${recordID} with Status: ${reservationStat}`);

    const query = `
        UPDATE reserves
        SET Reservation_Status = ?
        WHERE User_ID = ? AND Record_ID = ?;
    `;

    // Execute the query for each reservation
    con.query(query, [reservationStat, userID, recordID], (err) => {
      if (err) {
        console.error(`Error updating User_ID ${userID}, Record_ID ${recordID}:`, err);
      } else {
        console.log(`Successfully updated User_ID: ${userID}, Record_ID: ${recordID}`);
      }
    });
  });

  // Redirect back to advanced.html
  res.redirect('/advanced.html');
});

/*----------------------------------- Date -----------------------------------*/

function getCurrentDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
// ──────────────────────────────────────────────────
// ADD THESE AT THE BOTTOM OF server.js (before app.listen)
// ──────────────────────────────────────────────────

// 1) Arrivals by weekday
app.get('/api/arrivals', (req, res) => {
  const sql = `
    SELECT 
      DAYNAME(Check_In) AS day,
      COUNT(*)           AS count
    FROM StayHistory
    GROUP BY day
    ORDER BY FIELD(
      DAYNAME(Check_In),
      'Monday','Tuesday','Wednesday','Thursday',
      'Friday','Saturday','Sunday'
    )
  `;
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2) Departures by weekday
app.get('/api/departures', (req, res) => {
  const sql = `
    SELECT 
      DAYNAME(Check_Out) AS day,
      COUNT(*)            AS count
    FROM StayHistory
    GROUP BY day
    ORDER BY FIELD(
      DAYNAME(Check_Out),
      'Monday','Tuesday','Wednesday','Thursday',
      'Friday','Saturday','Sunday'
    )
  `;
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3) Weekly occupancy (number of check-ins per week)
app.get('/api/occupancy', (req, res) => {
  const sql = `
    SELECT 
      CONCAT(YEAR(Check_In), '-W', WEEK(Check_In)) AS week,
      COUNT(*)                                   AS count
    FROM StayHistory
    GROUP BY week
    ORDER BY week
  `;
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 4) Inventory status breakdown
app.get('/api/inventory', (req, res) => {
  const sql = `
    SELECT 
      Status AS label,
      SUM(Quantity) AS total
    FROM Inventory
    GROUP BY Status
  `;
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 5) Room availability per hotel
app.get('/api/availability', (req, res) => {
  const sql = `
    SELECT
      h.Hotel_Name           AS hotel,
      COUNT(r.Room_ID)       AS total_rooms,
      SUM(
        CASE 
          WHEN sh.Check_In  <= CURDATE() 
           AND sh.Check_Out >= CURDATE() 
          THEN 1 ELSE 0 
        END
      )                       AS occupied_rooms
    FROM Rooms r
    JOIN Hotel h   ON r.Hotel_ID      = h.Hotel_ID
    LEFT JOIN StayHistory sh 
      ON r.Room_ID = sh.Room_ID
    GROUP BY h.Hotel_ID
  `;
  con.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
/*----------------------------------- ROUTING -----------------------------------*/
app.all('*', function (request, response, next) {// This must be at the end!
  console.log(request.method + ' to ' + request.path);
  next();
});

app.listen(8080, () => console.log(`listening on port 8080`));
