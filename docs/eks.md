# Deploying app with ECR & EKS

One of the easiest option for deploying and managing Kubernetes on AWS is by using AWS [EKS](https://aws.amazon.com/eks/).

## Install and configure eksctl

- First install eksctl as explained in [documentation](https://eksctl.io/introduction/installation/).
- Install and configure [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).

```sh
    aws configure
    AWS Access Key ID [None]: A....
    AWS Secret Access Key [None]: 8...
    Default region name [None]: eu-west-1
    Default output format [None]: json
```

- verify aws cli is installed/configured correctly.

```sh
aws s3 ls
2016-10-19 12:43:52 ....
```

## Push docker instance to AWS ECR

We need a place to store our docker images. 
AWS ECR is perfect for this and you can find bellow the steps you need to follow in order to push our service Docker image to ECR.

- Get AWS password
```sh
    $ aws ecr get-login-password --region eu-west-1
    eyJwYXlsb2FkIjoibkN4MlVzUm5kUUxTYk9WR3l0WjJwRmdyU0dheUZ0b1YyWlRRbm.....
```                                        

- Docker login

```sh
    $ docker login -u AWS -p eyJwYXlsb2  https://{your_aws_account}.dkr.ecr.eu-west-1.amazonaws.com
.....

Login Succeeded
```                                     

- Create ECR repository

```sh
    $ aws ecr create-repository --repository-name simple-service
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:eu-west-1:{aws_account_id}:repository/simple-service",
        "registryId": ".....",
        "repositoryName": "simple-service",
        "repositoryUri": "{aws_account_id}.dkr.ecr.eu-west-1.amazonaws.com/simple-service",
        "imageTagMutability": "MUTABLE",
        "imageScanningConfiguration": {
            "scanOnPush": false
        }
    }
}
```

![ECR Repository](./images/ecr_repo.png)

- Create docker image for simple service

```sh
    $ docker build -t nanos .
    Sending build context to Docker daemon   69.1MB
    Step 1/8 : FROM node:8.14.0-alpine
    ........
    Successfully built ddddcb6941de
    Successfully tagged nanos:latest
```                                     

- Tag image and push to ECR

```sh
    $ docker tag nanos:latest {aws_account_id}.dkr.ecr.eu-west-1.amazonaws.com/nanos:latest

    $ docker push {aws_account_id}.dkr.ecr.eu-west-1.amazonaws.com/nanos:latest
    The push refers to repository [{aws_account_id}.dkr.ecr.eu-west-1.amazonaws.com/nanos]
    0fd5e3eeb047: Pushed
    d26ee7e7e5a7: Pushed
    bd180bd6f1d8: Pushed
    4964afdee176: Pushed
    0c1c3171d8c7: Pushed
    2283a7db78c9: Pushed
    df64d3292fd6: Pushed
    latest: digest: sha256:e112e9e3a6cf81d28ae97f830eea52c01354449f59e9ad7044b6bea44788a298 size: 1789
```                                     

![ECR Repository](./images/pushed_image.png)

## Create Kubernetes cluster using eksctl

- Create cluster using the configuration file.

```sh
    $ eksctl create cluster -f cluster.yaml
    [ℹ]  eksctl version 0.13.0
    [ℹ]  using region eu-north-1
    [ℹ]  setting availability zones to [eu-north-1c eu-north-1b eu-north-1a]
    .....
```                                     

using cluster.yaml:

```yml
    apiVersion: eksctl.io/v1alpha5
    kind: ClusterConfig
    
    metadata:
      name: nanos
      region: eu-west-1
    
    nodeGroups:
      - name: ng-1
        instanceType: m5.large
        desiredCapacity: 1
        ssh:
          allow: true
```
                                        
- Make sure aws-iam-authenticator is also installed on local machine.

Now we can start using kubectl, everything is configured correctly.

```sh
    $ kubectl get nodes -o wide
    NAME                                          STATUS    ROLES     AGE       VERSION              INTERNAL-IP     EXTERNAL-IP     OS-IMAGE         KERNEL-VERSION                  CONTAINER-RUNTIME
    ip-192-168-42-23.eu-west-1.compute.internal   Ready     <none>    8m17s     v1.14.8-eks-b8860f   192.168.42.23   18.202.253.46   Amazon Linux 2   4.14.154-128.181.amzn2.x86_64   docker://18.9.9
```                                        

- Create deployment/service and pod for service #1
```sh
    $ kubectl create -f docs/k8s/deployment_service.yml
```                                        

using deployment_service.yml

```yml
    apiVersion: v1
    kind: Service
    metadata:
      name: nanos
      labels:
        app: nanos
    spec:
      type: LoadBalancer
      ports:
        - port: 30000
          targetPort: 30000
          protocol: TCP
      selector:
        app: nanos
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nanos
      labels:
        app: nanos
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: nanos
      template:
        metadata:
          labels:
            app: nanos
        spec:
          containers:
            - name: nanos-1
              image: ........dkr.ecr.eu-west-1.amazonaws.com/nanos:latest
              ports:
                - name: http-port
                  containerPort: 30000
                  protocol: TCP
              env:
                - name: SERVICE_PORT
                  value: "30000"
                - name: SERVICE_HOST
                  value: "0.0.0.0"
                - name: NODE_ENV
                  value: "development"
                - name: PROJECT_NAME
                  value: "Challenge"
                - name: DB_CONN
                  value: "mongodb+srv://mongo-user:......@cluster0-tyajd.mongodb.net/test?retryWrites=true&w=majority"
                - name: DB_NAME
                  value: "challenge"
              livenessProbe:
                httpGet:
                  path: /v1/health
                  port: http-port
                initialDelaySeconds: 5
                timeoutSeconds: 30
              readinessProbe:
                httpGet:
                  path: /v1/health
                  port: http-port
                initialDelaySeconds: 5
                timeoutSeconds: 30
          initContainers:
            - name: install
              image: .......dkr.ecr.eu-west-1.amazonaws.com/nanos:latest
              command:
                - "npm"
                - "run"
                - "db:prepare"
```

This will automatically create a deployment, a service, a pod and an ELB exposing the correct port.

```sh
    kubectl get deployment
    NAME      READY     UP-TO-DATE   AVAILABLE   AGE
    nanos     1/1       1            1           4m24s
    
    kubectl get service
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP                                                               PORT(S)           AGE
    kubernetes   ClusterIP      10.100.0.1      <none>                                                                    443/TCP           3h49m
    nanos        LoadBalancer   10.100.220.27   a0f9c79ca61e211eaaa6f02aa63c12f2-1685349361.eu-west-1.elb.amazonaws.com   30000:32106/TCP   4m51s
    
    kubectl get pod
    NAME                     READY     STATUS    RESTARTS   AGE
    nanos-864948f744-gb87t   1/1       Running   0          5m17s
```

And now we can access our service:

```sh
    curl a0f9c79ca61e211eaaa6f02aa63c12f2-1685349361.eu-west-1.elb.amazonaws.com:30000/v1/health
    {"ok":"2020-03-09T08:49:41.081Z"}
```

Of course, to have a better name we can add a CNAME record in Route 53 and now we have this:

```sh
    curl test.alexandrumircea.ro:30000/v1/health
    {"ok":"2020-03-09T08:52:46.412Z"}
```
