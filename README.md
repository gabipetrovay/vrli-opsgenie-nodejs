# vRealize Log Insight (vRLI) Shim for OpsGenie

A simple NodeJS shim transforming vRLI alerts into OpsGenie alerts. The shim is implemented using the NodeJS HTTPS server.

## Running

The following environment variables must/should be set before running the server:

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `HTTPS_PORT` | No | `3000` | The port to bind the HRTTPS server to. |
| `HTTPS_SERVER_PEM_FILE` | No | `server.pem` | The PEM file containing both the HTTPS private key and the HTTPS certificate. |
| `OPSGENIE_API_KEY` | Yes | | The OpsGenie API key for creating and managing alerts. |

Sample call:

```
HTTPS_PORT=1234 \
OPSGENIE_API_KEY=123a456b-789c-012d-345e-6789f0000000 \
node index.js
```
