# DEEL BACKEND TASK

## Endpoints

1. ***GET*** `/contracts/:id` - It return the contract only if it belongs to the profile calling.

2. ***GET*** `/contracts` - Returns a list of non terminated contracts belonging to a user (client or contractor).

3. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.

4. ***POST*** `/jobs/:job_id/pay` - Pay for a job. The amount should be moved from the client's balance to the contractor balance.

5. ***POST*** `/balances/deposit/:userId` - Deposits money into the the the balance of a client.

6. ***GET*** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

7. ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - Returns the clients the paid the most for jobs in the query time period. Default limit is 2.

## Running local

### Docker (recommended)

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Run `docker build -t deel-backend .`
3. Run `docker run -p 3000:3000 deel-backend`
   
### Node

1. Install [Node](https://nodejs.org/en/download/)
2. Run `npm install`
3. Run `npm start`

### Development

1. Install [Node](https://nodejs.org/en/download/)
2. Run `npm install`
3. Run `npm run seed`
4. Run `npm run dev`

## Testing
1. Install [Node](https://nodejs.org/en/download/)
2. Run `npm install`
3. Run `npm run test`

## CI

The project is using GitHub Actions we have 2 workflows:

1. `Testing API` - Run on every push to master and pull request to master. It will run the tests.
2. `Deployment` - Run on every push to master. It will deploy the project to Okteto.
   
## Deployed

The project is deployed to my personal Okteto instance. You can access it here https://deel-challenge-be-aleacevedo.cloud.okteto.net

You can test it using **Postman**. You can import this [collection](https://raw.githubusercontent.com/0xAaCE/deel-challenge-be/main/DeelChallenge.postman_collection.json)