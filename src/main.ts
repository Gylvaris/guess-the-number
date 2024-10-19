import { confirm, number, select } from "@inquirer/prompts";

console.log(`
Welcome to Guess The Number! 
Your task is to guess the number i thinking of in the range of 1 to 100. 
You have limited chances to guess the correct number, depending on difficulty level. 
  `);
const gameStart = await confirm({ message: "Wanna play the game?" });

if (!gameStart) {
  console.log("Thanks for playing!");
  Deno.exit();
}

repeatGame();

const chances = {
  easy: 10,
  medium: 5,
  hard: 1,
};

function getRandomNumber(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function repeatGame() {
  const difficultyLevel = await select({
    message: "Select difficulty level:",
    choices: [
      {
        name: "Easy (10 chances)",
        value: "easy",
        //description: "",
      },
      {
        name: "Medium (5 chances)",
        value: "medium",
        //description: "",
      },
      {
        name: "Hard (1 chance)",
        value: "hard",
        //description: "",
      },
    ],
  });

  const tries = chances[difficultyLevel as keyof typeof chances];

  const randomNumber = getRandomNumber(1, 100);
  console.log(randomNumber);

  for (let i = tries; i > 0; i--) {
    const answer = await number({
      required: true,
      message: "Enter the number:",
      min: 1,
      max: 100,
    }) as number;

    if (answer === randomNumber) {
      console.log(
        `You did it! You guessed the number in ${tries - i + 1} tries`,
      );
      const playAgain = await confirm({ message: "Continue?" });
      if (!playAgain) {
        console.log("Thanks for playing!");
        Deno.exit();
      }
      repeatGame();
      return;
    } else if (answer > randomNumber && difficultyLevel != 'hard') {
      console.log(`The number is smaller than ${answer}`);
    } else if (answer < randomNumber && difficultyLevel != 'hard') {
      console.log(`The number is greater than ${answer}`);
    }
  }

  console.log(`Sorry, the correct answer is: ${randomNumber}`);
  const playAgain = await confirm({ message: "Continue?" });
  if (!playAgain) {
    console.log("Thanks for playing!");
    Deno.exit();
  }
  repeatGame();
  return;
}
