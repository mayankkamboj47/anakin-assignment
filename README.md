# How to run this project

In the root repository, run `npm install`. Now, run `npm run dev` to run the frontend. 

To run the backend server, navigate to `./repo_server` and run `node server.js`. 

Make sure both the frontend and backend are running and navigate to 'localhost:3000'. 


# Assumptions when making this project

I noticed that the github API doesn't pass in more than 100 repositories incase a user has more than
100. I've assumed that this is alright. 

Also, I've assumed that I do not need to make it look visually good, since I lack the knowledge in
that area. 

Finally, I've assumed that the rate of 60 requests an hour is enough for this assignment, and I don't
need the bumped rate of 5000 requests/hour that I can only get after authentication. 