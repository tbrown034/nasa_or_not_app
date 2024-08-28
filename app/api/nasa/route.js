import { NextResponse } from "next/server";

export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;

  // Extract query parameters from the request
  const { searchParams } = new URL(request.url);
  const count = searchParams.get("count"); // Get the 'count' parameter from the query string
  const thumbs = true; // Set thumbs to true for videos

  try {
    // Build the endpoint URL
    const endpoint = count
      ? `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=${thumbs}&count=${count}`
      : `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=${thumbs}`;

    console.log(
      count
        ? `Fetching ${count} random APOD(s)...`
        : "Fetching the current APOD..."
    );

    // Fetch the data from the NASA API
    const response = await fetch(endpoint);

    // Check if the response is successful
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Process the APOD(s)
    const processApod = (apod) => {
      if (apod.media_type === "video" && apod.thumbnail_url) {
        apod.url = apod.thumbnail_url;
      }
      return apod;
    };

    if (Array.isArray(data)) {
      const processedData = data.map(processApod);
      console.log("Returning processed multiple APODs...");
      return NextResponse.json(processedData);
    } else {
      console.log("Returning a single processed APOD...");
      return NextResponse.json(processApod(data));
    }
  } catch (error) {
    console.error("Error fetching APOD data:", error.message || error);
    return NextResponse.json(
      { error: `Failed to fetch APOD data: ${error.message || error}` },
      { status: 500 }
    );
  }
}
