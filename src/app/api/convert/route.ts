import { NextRequest, NextResponse } from "next/server";
import { parse } from "json2csv";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { type } = data;
    const projects = data.projects;

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { error: "No projects data provided" },
        { status: 400 },
      );
    }

    if (type === "json") {
      const jsonContent = JSON.stringify(projects, null, 2);
      return new NextResponse(jsonContent, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename=projects.json`,
        },
      });
    } else if (type === "csv") {
      try {
        const csvContent = parse(projects);
        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename=projects.csv`,
          },
        });
      } catch (csvError) {
        console.error("Error converting to CSV: ", csvError);
        return NextResponse.json(
          { error: "Error converting data to CSV" },
          { status: 500 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid 'type' provided. Use 'json' or 'csv'." },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error processing request: ", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
