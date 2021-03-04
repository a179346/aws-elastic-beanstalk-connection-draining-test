# Language
[English](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/README.md)

[中文](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/README-zh-tw.md)

# 實驗目的
測試 aws elastic beanstalk 的 connection draining。

# 測試方法
更新程式前後呼叫 /test，統計傳回結果。

# 控制變數
Connection draining

# 設定
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
	啟動時間: 60秒
	OK回應時間: 10秒
```
### client
```
	呼叫間隔: 5秒
	呼叫timeout: 40秒
```

# 測試結果
## 案例1. Connection draining : disabled
實驗時間:
```
	開始呼叫 /test 時間:	14:42:00
	1st 部屬開始時間:	14:43:28
	1st 部屬完成時間:	14:47:23
	2nd 部屬開始時間:	14:48:28
	2nd 部屬完成時間:	14:52:19
	結束呼叫 /test 時間:	14:53:20
	統計時間:		14:54:10
```
平均部屬時間: 233秒

Client 統計結果:
```
	已傳送request數: 134
	已回覆request數: 126
		- ok: 126
		- shutting down & not ready: 0
		- not ready: 0
		- shutting down: 0
		- not found: 0
		- other: 0
	Error數: 8
		- "Error: Network Error" * 8
	未回覆requset數: 0
```
EC2 logs

* [instance 1](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/testResult/case1-instance1.txt)

* [instance 2](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/testResult/case1-instance2.txt)

## 案例2. Connection draining : enabled (Draining timeout: 40秒)
實驗時間:
```
	開始呼叫 /test 時間:	15:13:00
	1st 部屬開始時間:	15:13:54
	1st 部屬完成時間:	15:18:02
	2nd 部屬開始時間:	15:18:58
	2nd 部屬完成時間:	15:23:03
	結束呼叫 /test 時間:	15:24:30
	統計時間:		15:25:10
```
平均部屬時間: 246.5秒

Client 統計結果:
```
	已傳送request數: 138
	已回覆request數: 138
		- ok: 138
		- shutting down & not ready: 0
		- not ready: 0
		- shutting down: 0
		- not found: 0
		- other: 0
	Error數: 0
	未回覆requset數: 0
```
EC2 logs

* [instance 1](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/testResult/case2-instance1.txt)

* [instance 2](https://github.com/a179346/aws-elastic-beanstalk-connection-draining-test/blob/main/testResult/case2-instance2.txt)

# 實驗結論
> 若啟用連接耗盡，Elastic Beanstalk 會將批次內 Amazon EC2 執行個體的現有連線耗盡，之後才進行部署。

## 開啟 connection draining 優點
* 可以避免http requset突然中止而產生的network error錯誤。
## 開啟 connection draining 缺點
* 小幅度增加部屬時間
