REGION = us-east-2
ECR_REPO = xxx.dkr.ecr.us-east-2.amazonaws.com
CLUSTER = demo-api
PROJECT_NAME = api-web
WORK_DIR = ~/

# ECR
build-images:
	make build-web
	make build-nginx

push-images:
	make build-images

	docker push $(ECR_REPO)/demo-api/web
	docker push $(ECR_REPO)/demo-api/nginx

build-web:
	cd $(WORK_DIR)/api && docker build -t demo-api-web .
	docker tag demo-api-web:latest $(ECR_REPO)/demo-api/web:latest

build-nginx:
	cd $(WORK_DIR)/ecs/rails-api/nginx && docker build -t demo-api-nginx .
	docker tag demo-api-nginx:latest $(ECR_REPO)/demo-api/nginx:latest

# ECS
configure-cluster:
	ecs-cli configure --cluster $(CLUSTER) --region $(REGION) --default-launch-type EC2 --config-name $(CLUSTER)

deploy:
	aws ecs update-service --cluster $(CLUSTER) --service $(PROJECT_NAME) --force-new-deployment
