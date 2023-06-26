Step Addition Application

This application allows users to generate a step-by-step addition process for two input numbers and save the results in a PostgreSQL database. The application is built using NextJS (for frontend), NodeJS + Express (for backend), and PostgreSQL for the database.

It is Backend side repo.

# How to Set the Application(Backend):

- Set config file to connect db `src/configs/config.ts`
    
    {
        username: "your-postgresql-username",
        password: "your-postgresql-password",
        host: "your-host",
        port: "your-postgresql-port",
        database: "your-database-name",
    };
 
# How to Run the Application(Backend):

1. Download Postsql application and install for database.
1. Clone Repo: `https://github.com/luckyboy125/eqaim-backend`
2. Download Node application and install.
3. Run `npx tsc` to build js file.
4. Run backend `node ./dist/server.js`

Home Screen:
The home screen has a form where the user inputs two numbers to add. After clicking the "Generate Steps" button, an API call is triggered using Axios which passes the two numbers to the backend. The backend then generates a JSON object of the step-by-step addition process and returns it to the frontend, which displays it in the output area on the home screen.

Save Results:
The "Save Results to DB" button saves the results of the addition process in a PostgreSQL table in JSON format. The saved results can be retrieved using another API that supports pagination.

API Details:

Method: POST

Request Body:

num1: string (positive number)
num2: string (positive number)
Response Body:

steps: array of objects containing the step-by-step addition process
Note: The request body is validated using regex to ensure that only positive numbers are allowed.

Step Generation Process:
The step generation process involves adding digits at each place value and tracking any carries that occur.

Example: Suppose we want to add 1489 and 714. The first step is to add digits at the unit places, which gives us a sum of 13 (9+4). The "1" of 13 goes as a carry to the tens place, so the actual sum is "3" and "1" is the carry. As the "1" which goes to carry is at the tens place, an underscore is appended for the unit place. Hence, in step-1, we have carryString="1_" and sumString="3".

The process continues for each place value until there are no more carries. In the end, the final sum is obtained by combining the strings of the carry and sum values.

Dependencies:

Next.js
React
Node.js
Express
Axios
pg
Typescript