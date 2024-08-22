import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NASA_API_KEY;

  try {
    // Fetch NASA's APOD data
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();

    // Return the data as JSON with a 200 status code
    return NextResponse.json({ data });
  } catch (error) {
    // Log the error and return a JSON response with a 500 status code
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch NASA data" },
      { status: 500 }
    );
  }
}
