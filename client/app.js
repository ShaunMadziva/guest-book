const form = document.getElementById("form");

async function handleSubmit(event) {
  //stop the default submit behaviour so we can overide it with our own logic
  event.preventDefault();

  // get the information from our form as an object
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  console.log(data);
  //call our API POST end point
  const response = await fetch("http://localhost:8080/job-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();

  console.log("From the server:", responseData);
  form.reset();
  getApplications();
}

form.addEventListener("submit", handleSubmit);

//add a html element to display our saved applications

const container = document.getElementById("applied");

async function getApplications() {
  const response = await fetch("http://localhost:8080/job-applications");
  const applications = await response.json();
  //console.log(applications);
  container.innerHTML = "";

  // Create the table and header row
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");

  // Define the table headers
  const headers = [
    "ID",
    "Job Title",
    "Company Name",
    "Date Applied",
    "Interesting Fact",
    "Brand Value 1",
    "Brand Value 2",
    "Brand Value 3",
    "Cover Letter Included",
    "Outcome",
    "Follow Up Date",
    "Followed Up",
  ];

  // Append headers to the header row
  headers.forEach((headerText) => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  table.appendChild(headerRow);

  // Append each application as a row in the table
  applications.forEach((application) => {
    const row = document.createElement("tr");

    // Append each cell in the row
    Object.values(application).forEach((value) => {
      //console.log(value)
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
      table.appendChild(row); //append rows to the table
    });

    container.appendChild(table);
  });
}

getApplications();
