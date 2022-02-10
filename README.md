# MWC 22 | Hackathon CLI | back

# MWC 22 | Hackathon CLI | back

Node.js CLI for the MWC 22 hackathon. You will need `npm` and `node.js` to run the program.

## Installation

First install all the required dependencies with `npm i`.

### Tasks

1. Create a `developer` model with the corresponding fields: The developer model can be found in `src/db/models/Developer.model.js`.
<img src="/resources/task1.png" width="200">
1. Insert all `mwc22.json` data to the database: You can execute the script with `npm run seed`. This will execute the script to fill the database. If you haven't created the database before the program will automatically create it for you and apply the necessary migrations to initialize the tables.
  <img src="/resources/task2.gif" width="200">
2. Create a command to display during which days the MWC 22 will take place: With the command `npm run start info` the program will start and display the information.
     <img src="/resources/task3.gif" width="200">
3. Create a command to display the developer list attending MWC 22: With the command `npm run start developers` the program will display a list of the names of the developers.
     <img src="/resources/task4.gif" width="200">
4. Create a command to add a developer to the attendance list of MWC 22: With the command `npm run start add` the program will prompt for the information of the developer and store it in the database.
     <img src="/resources/task5.gif" width="200">
