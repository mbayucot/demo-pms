validate-stack:
	aws cloudformation validate-template --template-body file://templates/ecs-services.yml

create-stack:
	aws cloudformation create-stack --stack-name ecs-services --template-body file://templates/ecs-services.yml --parameters file://parameters/ecs-services.json

delete-stack:
	aws cloudformation delete-stack --stack-name ecs-services
