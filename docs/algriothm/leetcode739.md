# leetcode 739

给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。

一、常规解法
```javascript
function dailyTemperatures(temperatures) {
  let len = temperatures.length
  
  let res = new Array(len).fill(0)

  for (let i = 0; i < len; i++) {
    let jValue = temperatures[i]
    let j = i
    // 
    while (j < len - 1) {
      if (temperatures[j + 1] > jValue) {
        res[i] = j + 1 - i
        break
      } else {
        j++
      }
    }
  }

  return res
}
```

上面运行起来是没有问题的, 思路很简单, 里层循环就是对索引为`i`的元素，从它下一个元素起开始找比他大的值，有就更新`res[i]` 没有就继续下一个
但太常规，时间复杂度为O(n^2)

二、栈思路(推荐)
```javascript
function dailyTemperatures(temperatures) {
  let len = temperatures.length
  let res = new Array(len).fill(0)

  // 维护一个递减的栈
  let stack = [0]

  // i为0时情况已经在初始化stack时考虑了
  for (let i = 1; i < len; i++) {
    // 注意必须每次都取stack.length
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      let prevIndex = stack.pop()
      res[prevIndex] = i - prevIndex
    }

    stack.push(i)
  }

  return res
}
```

遍历temperatures时, 考虑一般场景，如果当前温度比栈里最后的小push进去当前索引, 如果当前温度比栈里的最后几个大，都pop出来并更新res对应的prevIndex

对于温度列表temperatures [73, 74, 75, 71, 69, 72, 76, 73]  
单调栈 stack  
返回 res 它的初始状态是 [0, 0, 0, 0, 0, 0, 0, 0]  
按照以下步骤更新单调栈和答案，其中单调栈内的元素都是下标，括号内的数字表示下标在温度列表中对应的温度

1. 当 i = 0 时，单调栈为空，将0进栈
    * stack = [0(73)]
    * res = [0, 0, 0, 0, 0, 0, 0, 0]

2. 当 i = 1 时，由于 74 > 73，因此移除元素0，赋值res[0] = 1 - 0，将 1 进栈
    * stack = [1(74)]
    * res = [1, 0, 0, 0, 0, 0, 0]

3. 当 i = 2 时，由于 75 > 74，因此移除元素1，赋值res[1] = 2 - 1，将 2 进栈
    * stack = [2(75)]
    * res = [1, 1, 0, 0, 0, 0, 0]
  
4. 当 i = 3 时，由于 71 < 75，res先不管, 将 3 进栈
    * stack = [2(75), 3(71)]
    * res = [1, 1, 0, 0, 0, 0, 0]

5. 当 i = 4 时，由于 69 < 71，res先不管, 将 4 进栈
    * stack = [2(75), 3(71), 4(69)]
    * res = [1, 1, 0, 0, 0, 0, 0]

6. 当 i = 5 时，由于 72 > 69，72 > 71, 赋值res[4] = 5 - 4，res[3] = 5 - 3, 将 5 进栈
    * stack = [2(75), 5(72)]
    * res = [1, 1, 0, 2, 1, 0, 0]

7. 当 i = 6 时, 由于 76 > 72, 76 > 75, 赋值res[5] = 6 - 5, res[2] = 6 - 2, 将 6 进栈
    * stack = [6(76)]
    * res = [1, 1, 4, 2, 1, 1, 0]

8. 当 i = 7 时, 由于 73 < 76，res先不管, 将 7 进栈
    * stack = [6(76), 7(73)]
    * res = [1, 1, 4, 2, 1, 1, 0]

三、跳跃判断

```javascript
function dailyTemperatures(temperatures) {
  let len = temperatures.length
  let res = new Array(len).fill(0)

  // 从右向左遍历
  for (let i = len - 2; i >= 0; i--) {
    // j+= res[j]是利用已经有的结果进行跳跃
    for (let j = i + 1; j < len; j += res[j]) {
      if (temperatures[j] > temperatures[i]) {
        res[i] = j - i
        break
      // 走到else,说明后面的值更大, 同时遇到0表示后面不会有更大的值，那当然当前值就应该也为0
      // 避免 j += 0 无限循环
      } else if (res[j] === 0) {
        res[i] = 0
        break
      }
    }
  }

  return res
}
```

图片参考这里
https://leetcode.cn/problems/daily-temperatures/solution/jie-ti-si-lu-by-pulsaryu/

