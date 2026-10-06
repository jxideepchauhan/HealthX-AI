FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

COPY apps/ml-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/ml-service ./

# Train and package baseline models
RUN python -m training.train_classifier
RUN python -m training.train_ner
RUN python -m training.evaluate

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
