REGION = us-east-2
ECR_REPO = xxx.dkr.ecr.us-east-2.amazonaws.com
CF_DISTRIBUTION_ID = xxx
CLUSTER = demo-app
PROJECT_NAME = app-web
WORK_DIR = ~/

# ECR
build-images:
	make build-web

push-images:
	make build-images

	docker push $(ECR_REPO)/demo-app/web

build-web:
	cd $(WORK_DIR)/app && cp .env.prod .env && docker build -t demo-app-web .
	docker tag demo-app-web:latest $(ECR_REPO)/demo-app/web:latest

# ECS
configure-cluster:
	ecs-cli configure --cluster $(CLUSTER) --region $(REGION) --default-launch-type EC2 --config-name $(CLUSTER)

deploy:
	aws ecs update-service --cluster $(CLUSTER) --service $(PROJECT_NAME) --force-new-deployment
	aws cloudfront create-invalidation --distribution-id $(CF_DISTRIBUTION_ID) --paths "/*"