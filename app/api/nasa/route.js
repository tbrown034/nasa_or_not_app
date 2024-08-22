import { NextResponse } from "next/server";

export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;

  // Extract query parameters from the request
  const { searchParams } = new URL(request.url);
  const count = searchParams.get("count"); // Get the 'count' parameter from the query string

  try {
    let response;

    // If 'count' is provided, fetch random APODs using the NASA API
    if (count) {
      response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`
      );
    } else {
      // Otherwise, fetch the current APOD
      response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
      );
    }

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();

    // Return the data as JSON with a 200 status code
    return NextResponse.json(data);
  } catch (error) {
    // Log the error and return a JSON response with a 500 status code
    console.error("Error fetching APOD data:", error);
    return NextResponse.json(
      { error: "Failed to fetch APOD data" },
      { status: 500 }
    );
  }
}
