# bitacora-de-vida

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/): A platform for developing, shipping, and running applications inside containers.
- [Docker Compose](https://docs.docker.com/compose/): A tool for defining and running multi-container Docker applications.

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/bitacora-de-vida.git
   cd bitacora-de-vida
   ```

2. Build and start the Docker containers:

   ```sh
   docker compose up --build
   ```

3. Access the application:
   Open your browser and navigate to `http://localhost`.

### Debugging

If you need to debug the application, you can connect to the debugger on port 5678.

#### Visual Studio Code Configuration

To configure debugging in Visual Studio Code, add the following configuration to your `.vscode/launch.json` file:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Remote Attach",
      "type": "python",
      "request": "attach",
      "connect": {
        "host": "localhost",
        "port": 5678
      },
      "pathMappings": [
        {
          "localRoot": "${workspaceFolder}",
          "remoteRoot": "/app"
        }
      ]
    }
  ]
}
```

### Running the Debugger

1. Start the Docker containers:

   ```sh
   docker compose up --build
   ```

2. Open Visual Studio Code and go to the Run and Debug view.

3. Select "Python: Remote Attach" from the configuration dropdown.

4. Click the green play button to start debugging.

### Stopping the application

To stop the application, run:

```sh
docker compose down
```
