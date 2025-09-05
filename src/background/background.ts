// Background Script для Chrome расширения
console.log('Ext Frizar: Background script loaded')

// Обработчик установки расширения
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details)
  
  // Устанавливаем начальные настройки
  chrome.storage.local.set({
    isActive: false,
    installDate: new Date().toISOString()
  })
})

// Обработчик сообщений от content scripts и popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message, sender)
  
  if (message.action === 'getTabInfo') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          id: tabs[0].id,
          title: tabs[0].title,
          url: tabs[0].url
        })
      } else {
        sendResponse(null)
      }
    })
    return true // Указываем, что ответ будет асинхронным
  }
  
  if (message.action === 'sendData') {
    // Выполняем отправку данных в background script
    sendDataToWebhooks(message.payload)
      .then((result) => {
        sendResponse(result)
      })
      .catch((error) => {
        console.error('Error in background sendData:', error)
        sendResponse({ success: false, error: error.message })
      })
    return true // Указываем, что ответ будет асинхронным
  }
  
  // Если сообщение не обработано, отправляем пустой ответ
  sendResponse(null)
})

// Обработчик изменения вкладок
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated:', activeInfo)
})

// Обработчик обновления вкладок
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab updated:', tabId, tab.url)
  }
})

// Обработчик клика по иконке расширения
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked for tab:', tab.id)
})

// Функция для отправки данных на webhook'и
async function sendDataToWebhooks(payload: any) {
  try {
    console.log('Background sending data:', payload)

    // Получаем URL из переменных окружения
    const testWebhookUrl = process.env.WEBHOOK_TEST_URL || ''
    const prodWebhookUrl = process.env.WEBHOOK_PROD_URL || ''

    // Отправляем запросы параллельно
    const promises = [
      fetch(testWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }),
      fetch(prodWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
    ]

    // Ждем только второй запрос (с ожиданием)
    const [, response2] = await Promise.all(promises)
    
    if (response2.ok) {
      return { success: true }
    } else {
      return { success: false, error: `HTTP ${response2.status}` }
    }
    
  } catch (error) {
    console.error('Error in sendDataToWebhooks:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

