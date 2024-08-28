import { NextResponse } from "next/server";
import pool from "../db";

// POST request: Add a new image pair to the database
export async function POST(request) {
  try {
    console.log(
      "Starting POST request to add a new image pair to the database..."
    );
    const { nasaData, aiData } = await request.json();
    console.log("Received data:", { nasaData, aiData });

    const client = await pool.connect();
    console.log("Database connection established.");

    await client.query("BEGIN"); // Start the transaction
    console.log("Transaction started.");

    // Check if NASA image already exists
    console.log("Checking if NASA image already exists in the database...");
    const checkNasaExist = await client.query(
      `SELECT id FROM nasa_apod WHERE title = $1 OR date = $2`,
      [nasaData.title, nasaData.date]
    );

    let nasaId;
    if (checkNasaExist.rows.length > 0) {
      nasaId = checkNasaExist.rows[0].id;
      console.log("NASA image already exists with ID:", nasaId);

      // Optionally, return a response indicating the pair already exists
      client.release();
      return NextResponse.json(
        {
          success: false,
          message: "This image pair already exists in the database.",
        },
        { status: 409 } // 409 Conflict status code
      );
    } else {
      console.log("Inserting NASA image into the database...");
      const nasaResult = await client.query(
        `INSERT INTO nasa_apod (title, explanation, date, url, copyright)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          nasaData.title,
          nasaData.explanation,
          nasaData.date,
          nasaData.url,
          nasaData.copyright,
        ]
      );
      nasaId = nasaResult.rows[0].id;
      console.log("NASA image inserted successfully with ID:", nasaId);
    }

    // Insert AI image with reference to the NASA image
    console.log("Inserting AI image into the database...");
    await client.query(
      `INSERT INTO ai_apod (nasa_apod_id, title, explanation, date, url, copyright)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        nasaId, // Foreign key linking to the NASA image
        nasaData.title,
        nasaData.explanation,
        nasaData.date,
        aiData.imageUrl,
        nasaData.copyright,
      ]
    );
    console.log(
      "AI image inserted successfully, linked to NASA image ID:",
      nasaId
    );

    await client.query("COMMIT"); // Commit the transaction
    console.log("Transaction committed.");
    client.release();
    console.log("Database connection released.");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving data to the database:", error.message || error);

    try {
      const client = await pool.connect();
      await client.query("ROLLBACK"); // Rollback the transaction on error
      console.log("Transaction rolled back due to error.");
      client.release();
      console.log("Database connection released.");
    } catch (rollbackError) {
      console.error(
        "Error during transaction rollback:",
        rollbackError.message || rollbackError
      );
    }

    return NextResponse.json(
      { error: `Failed to save data: ${error.message || error}` },
      { status: 500 }
    );
  }
}

// GET request: Fetch data from the database
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nasaApod = searchParams.get("nasa_apod");
  const aiApod = searchParams.get("ai_apod");

  try {
    const client = await pool.connect();

    let result;

    if (nasaApod) {
      result = await client.query("SELECT * FROM nasa_apod");
    } else if (aiApod) {
      result = await client.query("SELECT * FROM ai_apod");
    } else {
      return NextResponse.json(
        { error: "Invalid query parameter" },
        { status: 400 }
      );
    }

    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error.message || error);
    return NextResponse.json(
      { error: "Failed to fetch data from the database" },
      { status: 500 }
    );
  }
}
