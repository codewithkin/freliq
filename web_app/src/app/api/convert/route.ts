// /pages/api/convert.ts (or .js)
import { NextRequest, NextResponse } from "next/server";

// Helper function to convert JSON to CSV
function convertToCSV(jsonObj: any) {
  const headers = Object.keys(jsonObj[0]);
  const csvRows = [
    headers.join(","), // Add headers row
    ...jsonObj.map((row: any) =>
      headers.map((header) => row[header]).join(","),
    ),
  ];

  return csvRows.join("\n");
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const type = req.headers.get("type"); // Get type from headers (json or csv)

  const projects = data.projects;

  // Convert the data to a JSON object
  const jsonObj = Object.assign(
    {},
    ...projects.map((item: any) => ({ [item.id]: item })),
  );

  // If the type is JSON, return a JSON file
  if (type === "json") {
    const jsonString = JSON.stringify(jsonObj);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=projects.json",
      },
    });
  }

  // If the type is CSV, convert and return a CSV file
  else if (type === "csv") {
    const csvString = convertToCSV(Object.values(jsonObj)); // Convert object to CSV

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=projects.csv",
      },
    });
  }

  // If type is invalid
  return new NextResponse("Invalid type", { status: 400 });
}
