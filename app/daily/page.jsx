import React from "react";
// 1. On load, check nasa_or_ap database if it contains the apod/ai pair for today.
// 2. If it does, display the pair. If it doesn't, fetch today's apod, generate it's ai counterpart by sending the metadata to dalle-3 and then store both in the database in their respective tables as a transactions so only occurs if both are successful.
// 3. redo step 1.
// 4. If the pair is in the database, display it like this: Show the title, date, description and copyright field (it should be the same for both but we want to just display it once). Under that will then be the real apod image and the ai-generated versio of it. Let's add a random funcition to randomly select each time which will appear first. Then allow the user to try to select which one is the real apod. Clicking the image will highlight or cue some UI, then there will a button to submit the answer. If right, show success message and allow to play again. If wrong, show failure message and allow to play again.
// 5. log error if any of the steps fail.

const page = () => {
  return (
    <div>
      <h1>Daily Game</h1>
      <p>Play the daily guessing game and test your knowledge of the cosmos.</p>
    </div>
  );
};

export default page;
