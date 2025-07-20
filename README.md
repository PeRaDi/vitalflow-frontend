# vitalflow-frontend

Inventory Management System powered by AI


```
docker buildx create --use
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t peradi/vitalflow-frontend:latest \
  --push .

docker rm vitalflow-frontend
docker pull peradi/vitalflow-frontend:latest
docker run -d \
  --name vitalflow-frontend \
  --env-file .env.prod \
  -p 3000:3000 \
  peradi/vitalflow-frontend:latest

docker start vitalflow-frontend
docker stop vitalflow-frontend

docker logs -f vitalflow-frontend
```