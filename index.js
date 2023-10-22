const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");

// Directory containing the HTML files
const directoryPath = "courses";

// Read the files in the subfolder
const htmlFiles = fs.readdirSync(directoryPath);

// Initialize an array to store the extracted data
const allExtractedData = [];

// Iterate through each HTML file in the subfolder
htmlFiles.forEach((fileName) => {
  // Check if the file matches the naming pattern
  if (fileName.startsWith("Content of Course_") && fileName.endsWith(".html")) {
    // Extract the course name from the file name
    const course = fileName.match(/Content of Course_ (.*).html/)[1];

    // Load the HTML content from the file
    const html = fs.readFileSync(path.join(directoryPath, fileName), "utf-8");

    // Parse the HTML using cheerio
    const $ = cheerio.load(html);

    // Find the table with class "class_schedule"
    const table = $("body > center:nth-child(5) > table");

    // Find the table rows inside the table
    const rows = table.find("tr");

    // Initialize an array to store the extracted data for this file
    const extractedData = [];

    // Iterate through each row
    rows.each((index, row) => {
      // Find the columns in the current row
      const columns = $(row).find("td");

      // Extract values from columns
      const type = $(columns[1]).text().trim();
      const day = $(columns[3]).text().trim();
      const time = $(columns[4]).text().trim();
      const venue = $(columns[5]).text().trim();

      // Check if the "Type" column is "Tut"
      if (type === "Tut") {
        extractedData.push({ type, day, time, venue });
      }
    });

    // Add the extracted data for this file to the overall data array
    allExtractedData.push({
      course,
      data: extractedData,
    });
  }
});

// Print the extracted data for each file
allExtractedData.forEach((fileData) => {
  console.log(`File: ${fileData.course}`);
  console.log(fileData.data);
  console.log("\n");
});

// Save the extracted data as JSON to a file
const jsonData = JSON.stringify(allExtractedData, null, 2); // The second argument adds indentation for readability
fs.writeFileSync("data.json", jsonData, "utf-8");

console.log("Data saved as data.json");