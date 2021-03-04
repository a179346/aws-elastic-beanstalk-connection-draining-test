# Language
[English](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/README.md)

[中文](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/README-zh-tw.md)

# Purpose
Test the ***connection draining*** in aws elastic beanstalk.

# Method
Call the route "/test" before and after rolling update, and observe the behavior.

# Control variable
Connection draining

# Setting
### EB
```
	Platform: Node.js 10 running on 64bit Amazon Linux 2/5.3.0
	Proxy: nginx
	EC2: t3.micro * 2
	Load Balancer: Classic
	Health check path: /ok
	Deployment policy: Rolling (batch size: fixed 1)
```
### server
```
	server ready delay: 60 seconds
	server send ok delay: 10 seconds
```
### client
```
	call "/test" interval: 5 seconds
	requset timeout: 40 seconds
```

# Result
## Case 1. Connection draining : disabled
Time:
```
	start calling "/test":    14:42:00
	1st start deployment:     14:43:28
	1st complete deployment:  14:47:23
	2nd start deployment:     14:48:28
	2nd complete deployment:  14:52:19
	stop calling "/test":     14:53:20
	check result:             14:54:10
```
Avergage deployment time: 233 seconds

Client result:
```
	sent request count: 134
	received response count: 126
		- ok: 126
		- shutting down & not ready: 0
		- not ready: 0
		- shutting down: 0
		- not found: 0
		- other: 0
	error count: 8
		- "Error: Network Error" * 8
	unhandled request count: 0
```
EC2 logs

* [instance 1](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/testResult/case1-instance1.txt)

* [instance 2](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/testResult/case1-instance2.txt)

## Case 2. Connection draining : enabled (Draining timeout: 40秒)
Time:
```
	start calling "/test":    15:13:00
	1st start deployment:     15:13:54
	1st complete deployment:  15:18:02
	2nd start deployment:     15:18:58
	2nd complete deployment:  15:23:03
	stop calling "/test":     15:24:30
	check result:             15:25:10
```
Avergage deployment time: 246.5 seconds

Client result:
```
	sent request count: 138
	received response count: 138
		- ok: 138
		- shutting down & not ready: 0
		- not ready: 0
		- shutting down: 0
		- not found: 0
		- other: 0
	error count: 0
	unhandled request count: 0
```
EC2 logs

* [instance 1](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/testResult/case2-instance1.txt)

* [instance 2](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/testResult/case2-instance2.txt)

# Conclusion
 > If you enable connection draining, Elastic Beanstalk drains existing connections from the Amazon EC2 instances in each batch before beginning the deployment.

## Pros of connection draining
* Avoid network error
## Cons of connection draining
* Slightly increase the time of deployment