// Background Script для Chrome расширения
console.log('Ext Frizar: Background script loaded')

// Импортируем конфигурацию webhook'ов
import { getWebhookUrl } from '../config/webhooks'

// Обработчик установки расширения
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details)
  
  // Устанавливаем начальные настройки - расширение всегда активно
  chrome.storage.local.set({
    isActive: true,
    installDate: new Date().toISOString()
  })
  
  // Создаем контекстное меню
  chrome.contextMenus.create({
    id: 'open-frizar-modal',
    title: 'Открыть FRIZAR (Уведомления для IT)',
    contexts: ['page']
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

// Обработчик клика по контекстному меню
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-frizar-modal' && tab?.id) {
    console.log('Context menu clicked for tab:', tab.id)
    // Отправляем сообщение в content script для открытия модалки
    chrome.tabs.sendMessage(tab.id, { 
      action: 'openModal'
    })
  }
})

// Функция для отправки данных на webhook'и
async function sendDataToWebhooks(payload: any) {
  try {
    console.log('Background sending data:', payload)

    // Получаем URL'ы webhook'ов из конфигурации
    const testWebhookUrl = getWebhookUrl('test')
    const prodWebhookUrl = getWebhookUrl('prod')

    console.log('Test webhook URL configured:', !!testWebhookUrl)
    console.log('Prod webhook URL configured:', !!prodWebhookUrl)

    // Проверяем, что URL'ы не пустые
    if (!testWebhookUrl || !prodWebhookUrl) {
      throw new Error('Webhook URLs are not configured')
    }

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
    
    console.log('Response status:', response2.status)
    console.log('Response ok:', response2.ok)
    
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

