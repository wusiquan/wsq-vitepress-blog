# vue3的scheduler

scheluer是抽象一层出来，实际与render和watch比较解耦合
我们可以通过queuejob, queuePostJob模拟起那段场景，用于加入调度队列
flushPreFlushCbs, flushPostFlushCbs 用来冲刷队列

queueJob只做两件事, 检查队列中是否已存在job(如果正在冲刷则对允许递归的job通过queue.includes(job, flushIndex + 1))


可以想象一个排队买饼的场景，通常介绍队列的时就说先进先出，后进后出，然后就结束了

现在这个饼摊生意很好，一锅就能出几个，排队人又多，所以加入调度(scheduler)系统

设置两个队伍, A队, B队(post), B队客户不着急，需要等A队买完再买
A队中的客户(job)分普通客户(无id), 高级客户(有id), 高级客户优先，有些早期客户有pre卡在某些情况可以优先

客户1先排队，但是客户2是高级客户, 这锅饼先给2再给1
```javascript
// 打印顺序
// job2 job1
const job1 = () => {
  console.log('job1')
}

const job2 = () => {
  console.log('job2')
}
job2.id = 1

queueJob(job1)
queueJob(job2)
```

顺便复习一个微任务的题
```javascript
// 打印顺序  1 2 3
let resolvedPromise = Promise.resolve()

let currentFlushPromise = resolvedPromise.then(() => {
  console.log(1)
  currentFlushPromise.then(() => {
    console.log(3)
  })
  console.log(2)
})
```

客户1,3排队, 客户1结束后叫客户2排队，仍然是一锅的饼
```javascript
const job1 = () => {
  console.log('job1')
  // job2 will be executed after job1 at the same tick
  queueJob(job2)
}

const job2 = () => {
  console.log('job2')
}

const job3 = () => {
  console.log('job3')
}

queueJob(job1)
queueJob(job3)
```

有5个客户, 客户4和客户5有pre卡, 先1, 3, 5排队
1买了饼后叫2, 4也买, 同时队伍中有pre卡先买，仍然是一锅的饼
```javascript
// 打印顺序
// job1, job5, job4, job3, job2
const job1 = () => {
  console.log('job1')
  queueJob(job2)
  queueJob(job4)
  flushPreFlushCbs()
}

const job2 = () => {
  console.log('job2')
}

const job3 = () => {
  console.log('job3')
}

const job4 = () => {
  console.log('job4')
}
job4.pre = true

const job5 = () => {
  console.log('job5')
}
job5.pre = true

queueJob(job1)
queueJob(job3)
queueJob(job5)
```