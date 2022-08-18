# How to run this project

In the root repository, run `npm install`. Now, run `npm run dev` to run the frontend. This frontend is also available at fyle-assignment.vercel.app

The server is hosted on heroku, at https://nodeserverfyle.herokuapp.com . The repo for the server is at https://www.github.com/mayankkamboj47/fyle-assignment-server

# Assumptions when making this project

I noticed that the github API doesn't pass in more than 100 repositories incase a user has more than
100. I've assumed that this is alright.  

I've also assumed that the rate of 60 requests an hour is enough for this assignment, and I don't
need the bumped rate of 5000 requests/hour that I can only get after authentication. 
