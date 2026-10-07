# Multi-stage Dockerfile for Python Calculator API / CLI
FROM python:3.12-slim as builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-alpine

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY app/ ./app/

ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["python", "-m", "app.calculator"]
