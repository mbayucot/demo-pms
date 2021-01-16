# VPC
REGION = us-east-2
SUBNETS = subnet-xxx
VPC_SUBNETS = subnet-xxx
VPC = vpc-xxx

# IAM
INSTANCE_ROLE = ecsInstanceRole

# ECR
ECR_REPO = xxx.dkr.ecr.us-east-2.amazonaws.com

# EC2
SECURITY_GROUP = sg-xxx
ELB = demo-app-web
TARGET_GROUP = arn:aws:elasticloadbalancing:us-east-2:xxx:targetgroup/demo-app-web/xxx

# ECS
CLUSTER = demo-app
PROJECT_NAME = app-web
WORK_DIR = ~/
CONTAINER_NAME = web
DESIRED_COUNT = 2


# ECR
push-images:
	make build-images

	echo $(aws ecr get-login-password)|docker login --password-stdin --username AWS xxx.dkr.ecr.us-east-2.amazonaws.com
	docker push $(ECR_REPO)/demo-app/web

build-images:
	make build-web

build-web:
	cd $(WORK_DIR)/app && cp .env.prod .env && docker build -t demo-app-web .
	docker tag demo-app-web:latest $(ECR_REPO)/demo-app/web:latest

# ELB
create-elb:
	aws elb create-load-balancer --load-balancer-name $(ELB) --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=80" --subnets $(VPC_SUBNETS) --security-groups $(SECURITY_GROUP)
	aws elb modify-load-balancer-attributes --load-balancer-name $(ELB) --load-balancer-attributes "{\"ConnectionSettings\":{\"IdleTimeout\":5}}"
	aws elb configure-health-check --load-balancer-name $(ELB) --health-check Target="HTTP:80/health_check,Timeout=5,Interval=30,UnhealthyThreshold=2,HealthyThreshold=10"

register-elb:
	aws elb register-instances-with-load-balancer --load-balancer-name ${ELB} --instances `aws ec2 describe-instances --filters "Name=tag:Name,Values=*demo-app" "Name=instance-state-name,Values=running" --output text --query 'Reservations[*].Instances[*].InstanceId'`

# ECS
configure-cluster:
	ecs-cli configure --cluster $(CLUSTER) --region $(REGION) --default-launch-type EC2 --config-name $(CLUSTER)

create-cluster:
	ecs-cli up --keypair aws-mike --subnets $(SUBNETS) --security-group $(SECURITY_GROUP) --vpc $(VPC) --instance-role $(INSTANCE_ROLE) --size $(DESIRED_COUNT) --instance-type t2.micro --cluster-config $(CLUSTER)

start-cluster:
	ecs-cli compose --project-name $(PROJECT_NAME) service up --create-log-groups --cluster-config $(CLUSTER) --target-group-arn $(TARGET_GROUP) --deployment-max-percent 100 --deployment-min-healthy-percent 50 --container-name $(CONTAINER_NAME) --container-port 80
	ecs-cli compose --project-name $(PROJECT_NAME) --cluster-config $(CLUSTER) service scale $(DESIRED_COUNT)

deploy:
	aws ecs update-service --cluster $(CLUSTER) --service $(PROJECT_NAME) --force-new-deployment

down-cluster:
	aws ecs update-service --cluster $(CLUSTER) --service $(PROJECT_NAME) --desired-count 0
	aws ecs delete-service --cluster $(CLUSTER) --service $(PROJECT_NAME)
	ecs-cli down --force --cluster-config $(CLUSTER)
