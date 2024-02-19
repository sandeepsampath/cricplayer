this is a nodeJs application that presents cricket player information, stats and player image for any cricket player (limited to whats avaialble on the source api)
the backend data is provided via a freee cricapi with keys exposed - this is a freebie key for anyone to abuse and will be rate limited immidietely.
a simple in mem caching function enables data caching to limit api calls to the cricapi saving some valuable $$



Enhancements that i've not had time to work on include:
- utilizing a local redis cache OR
- utilizing Azure / aws redis cache endpoints
- api gateway to manage api keys safely
- better UI
- some fun features like comparing 2 or 3 players, player trivia, links to the players twitter handle etc
- some match related pages like which series/ match is this player playing right now (or recent matches )


Deployment on azure app service
- Clone this repo
- create an azure app service (linux/ nodejs LTS )
- install node modules
- zip the dir and uplod file direclty to azure web app production slot
- **Optional**: create an azdevops project as an upstream and set up a ci/cd pipeline along with a release task using 'azureRM web app deploy'
  
