import { confirm, number, select } from "@inquirer/prompts";

// Define an object 'chances' with keys representing difficulty levels and values representing the number of chances for each difficulty
const chances = {
  easy: 10,   // Easy level gives 10 chances
  medium: 5,  // Medium level gives 5 chances
  hard: 1,    // Hard level gives 1 chance
};

// A utility function to generate a random number between 'min' and 'max' (inclusive)
function getRandomNumber(min: number, max: number): number {
  min = Math.ceil(min);  // Round the 'min' value up
  max = Math.floor(max); // Round the 'max' value down
  // Return a random number between 'min' and 'max'
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// An async function to handle game repetition
// 'nextGame' is an optional parameter to check if the user wants to continue the game
async function repeatGame(nextGame?: boolean) {
  // If 'nextGame' is true and the user does not confirm to continue, the game exits
  if (nextGame && !(await confirm({ message: "Continue?" }))) {
    console.log("Thanks for playing!");
    Deno.exit(); // Exit the program if the user chooses not to continue
  }

  // Ask the user to select a difficulty level using 'select' prompt
  // Pass the type as keyof 'chances' to ensure correct key values
  const difficultyLevel = await select<keyof typeof chances>({
    message: "Select difficulty level:",  // Message for the user to select difficulty level
    choices: [                            // Array of difficulty options
      {
        name: "Easy (10 chances)",        // Easy mode option
        value: "easy",
      },
      {
        name: "Medium (5 chances)",       // Medium mode option
        value: "medium",
      },
      {
        name: "Hard (1 chance)",          // Hard mode option
        value: "hard",
      },
    ],
  });

  // Set 'tries' based on the difficulty level chosen by the user
  const tries = chances[difficultyLevel]; 

  // Generate a random number between 1 and 100 using 'getRandomNumber'
  const randomNumber = getRandomNumber(1, 100);

  // A loop that allows the user to guess the number until they run out of tries
  for (let i = tries; i > 0; i--) {
    // Prompt the user to enter a number using 'number' prompt, ensuring input is between 1 and 100
    const answer = await number({
      required: true,           // User input is required
      message: "Enter the number:", // Prompt message
      min: 1,                   // Minimum input value
      max: 100,                 // Maximum input value
    });

    // If the user guesses the correct number, display a success message and return
    if (answer === randomNumber) {
      console.log(
        `You did it! You guessed the number in ${tries - i + 1} tries`,
      );
      return; // Exit the function after a successful guess
    } 
    // If the guess is incorrect and greater than the random number, give a hint (only for easy and medium modes)
    else if (answer && answer > randomNumber && difficultyLevel != "hard") {
      console.log(`The number is smaller than ${answer}`);
    } 
    // If the guess is incorrect and smaller than the random number, give a hint (only for easy and medium modes)
    else if (answer && answer < randomNumber && difficultyLevel != "hard") {
      console.log(`The number is greater than ${answer}`);
    }
  }

  // If the user runs out of tries without guessing correctly, reveal the correct number
  console.log(`Sorry, the correct answer is: ${randomNumber}`);
  // Just for a meme purpose
  console.log("\n\r⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣶⣦⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀ \n\r⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀ \n\r⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀ \n\r⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀ \n\r⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀ \n\r⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀ \n\r⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀ \n\r⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀ \n\r⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀ \n\r⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀ \n\r⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ \n\r⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ \n\r⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀ \n\r⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀ \n\r⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⢠⣿⣿⠀⠀⠀ \n\r⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇⠀⠀⠀ \n\r⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇⠀⠀⠀ \n\r⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀ \n\r⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n\r");
  return;
}

// The main block of code that initiates the game
try {
  // Print the welcome message with instructions about the game
  console.log(`
Welcome to Guess The Number! 
Your task is to guess the number I'm thinking of in the range of 1 to 100. 
You have limited chances to guess the correct number, depending on the difficulty level. 
  `);

  // Ask the user if they want to play the game using the 'confirm' prompt
  const gameStart = await confirm({ message: "Shall we begin the game?" });

  // If the user chooses not to play, thank them and exit the program
  if (!gameStart) {
    console.log("Thanks for playing!");
    Deno.exit(); // Exit the program
  }

  // Start the game by calling 'repeatGame' function
  await repeatGame();
} 
// Finally block to repeat the game as long as the user wants to continue
finally {
  while (true) {
    // Repeat the game if the user confirms they want to continue
    await repeatGame(true);
  }
}
