# Cloud-Computing Documentation

## Environment Variables
- If you want to test this API in local, you need to rename the `.env.example` file to `.env`. Then fill the environment variables with your own values.
- If you want to deploy it to App Engine in Google Cloud, you need to rename the `app.yaml.example` file to `app.yaml`. Then fill the environment variables with your own values.

## API Endpoint
| Method | Endpoint | Description |
| --- | --- | --- |
| POST |	/upload-image	| Allows mobile app to upload a picture to the server |
| POST |	/upload	|Send pictures to AI model |
| GET	| /proces	|Sends request to the model in the cloud to process the uploaded picture |
| GET	|	/news	| Retrieves all articles |
| GET	|	/news/:id	| Retrieves a specific article by its ID |


## Scripts
| Command | Description |
| --- | --- |
| `npm run start` | Run the server in production |
| `npm run start-dev` | Run the server in development |

## Contributors
- 	C172B4KY3174 - Nabil Faturrahman
- 	C172B4KX4400 - Vania
