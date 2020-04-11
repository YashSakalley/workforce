# workforce

Minor Project for 6th Semester

## Setup for project

If you have git cli installed, run: <br>
<code>git clone https://github.com/YashSakalley/workforce.git</code>

If not installed, click on "Clone or Download" and select "Download ZIP".

Run the following command in cmd: <br>
<code>npm install</code>

Change the folder name "config - Copy" to "config"

Now open the config folder and change the values in "db_config.js" according to your mysql database. <br>
Now change the values in "otp_config.js" according to your twillio account details.

After that, open "initDatabase.sql" and copy everything inside this file.
Now run the following in cmd: <br>
<code>mysql -u "username" -p </code><br>

Press enter and type your mysql password <br>
Now paste what you copied earlier in the mysql client terminal. <br>
Database with tables users, reviews, requests, workers and temp_requests will now be created.

## Running the project

Open your workforce folder in cmd and type the following command: <br>
<code>node app.js </code><br>

If you are recieving "ETIMEDOUT", type the above command again. <br>
Now you will recieve a message: <br>
<code>Server up on port 5000 </code><br>
<code>Connected to the database on app.js</code>

Congratulations, the website is now up and running. You can view this site by going to "http://localhost:5000/" in your web browser.
