class CustomerServiceClient {
  constructor(url, customerId) {
    this.url = url
    this.customerId = customerId
    this.socket = new SockJS(url)
    this.stompClient = Stomp.over(this.socket)
    this.subscriptions = {} // 存储订阅的通道
  }

  connect() {
    this.stompClient.connect({}, frame => {
      console.log('Connected: ' + frame)
      this.subscribeToCustomerChannel()
    })
  }

  // 生成唯一的通道名
  generateChannel(userId) {
    return `/topic/chat.${this.customerId}.${userId}`
  }

  // 订阅客服自己的通道以获取用户频道信息
  subscribeToCustomerChannel() {
    const channel = `/topic/customer/${this.customerId}`
    this.stompClient.subscribe(channel, message => {
      const userChannel = message.body
      console.log(`Received user channel: ${userChannel}`)
      this.subscribeToUserChannel(userChannel)
    })
  }

  // 订阅用户的通道
  subscribeToUserChannel(userChannel) {
    if (!this.subscriptions[userChannel]) {
      const subscription = this.stompClient.subscribe(userChannel, message => {
        const chatMessage = JSON.parse(message.body)
        console.log(`Received message: `, chatMessage)
        // 在这里处理接收到的消息，例如显示在聊天窗口中
      })
      this.subscriptions[userChannel] = subscription
      console.log(`Subscribed to user channel: ${userChannel}`)
    }
  }

  // 发送消息到用户的通道
  sendMessage(userId, messageContent) {
    if (messageContent && this.stompClient) {
      const chatMessage = {
        sender: 'CustomerService',
        content: messageContent,
        type: 'CHAT',
        customerId: this.customerId,
        userId: userId
      }
      this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage))
    }
  }
}

// 使用示例
// const url = '/ws';
// const customerId = 'customer1';
// const client = new CustomerServiceClient(url, customerId);
// client.connect();
