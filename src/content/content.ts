// Content Script для взаимодействия с веб-страницами
console.log('Ext Frizar: Content script loaded')

let modalElement: HTMLElement | null = null

// Слушаем сообщения от popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message, sender)
  
  if (message.action === 'openModal') {
    openModal()
  }
  
  sendResponse({ success: true })
})

// Инициализируем расширение при загрузке страницы
function initializeExtension() {
  console.log('Initializing extension...')
  
  // Добавляем обработчик горячих клавиш
  document.addEventListener('keydown', handleKeyDown)
}

// Инициализируем расширение сразу при загрузке
initializeExtension()

// Обработчик горячих клавиш
function handleKeyDown(event: KeyboardEvent) {
  // Проверяем Alt+K
  if (event.altKey && event.key === 'k') {
    event.preventDefault()
    openModal()
  }
}

// Создание и открытие модального окна
function openModal() {
  if (modalElement) {
    closeModal()
  }

  // Создаем модальное окно
  modalElement = document.createElement('div')
  modalElement.id = 'ext-frizar-modal'
  modalElement.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Добавить задачку IT отделу</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <textarea 
            id="note-textarea" 
            placeholder="Введите вашу заметку..."
            rows="4"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button id="send-btn" class="btn btn-primary">Отправить</button>
          <button id="cancel-btn" class="btn btn-secondary">Отменить</button>
        </div>
      </div>
    </div>
  `

  // Добавляем стили для модального окна
  const modalStyles = document.createElement('style')
  modalStyles.textContent = `
    #ext-frizar-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10001;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow: hidden;
    }
    
    .modal-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #666;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
    }
    
    .modal-close:hover {
      background: #f5f5f5;
      color: #333;
    }
    
    .modal-body {
      padding: 20px 24px;
    }
    
    #note-textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      min-height: 100px;
      box-sizing: border-box;
    }
    
    #note-textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .modal-footer {
      padding: 16px 24px 20px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-primary {
      background: #667eea;
      color: white;
    }
    
    .btn-primary:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
    
    .btn-secondary {
      background: #f5f5f5;
      color: #666;
    }
    
    .btn-secondary:hover {
      background: #e5e5e5;
      color: #333;
    }
  `

  document.head.appendChild(modalStyles)
  document.body.appendChild(modalElement)

  // Добавляем обработчики событий
  const closeBtn = modalElement.querySelector('.modal-close')
  const cancelBtn = modalElement.querySelector('#cancel-btn')
  const sendBtn = modalElement.querySelector('#send-btn')
  const textarea = modalElement.querySelector('#note-textarea') as HTMLTextAreaElement

  const closeModalHandler = () => closeModal()
  
  closeBtn?.addEventListener('click', closeModalHandler)
  cancelBtn?.addEventListener('click', closeModalHandler)
  sendBtn?.addEventListener('click', () => sendNote(textarea?.value || ''))
  
  // Закрытие по клику на overlay
  modalElement.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeModalHandler()
    }
  })

  // Фокус на textarea
  setTimeout(() => {
    textarea?.focus()
  }, 100)
}

// Закрытие модального окна
function closeModal() {
  if (modalElement) {
    modalElement.remove()
    modalElement = null
  }
}

// Отправка заметки
async function sendNote(message: string) {
  try {
    // Получаем данные пользователя из storage
    const storageData = await chrome.storage.local.get(['userName'])
    const userName = storageData.userName || ''
    
    // Получаем информацию о текущей вкладке через background script
    const tabInfo = await new Promise<any>((resolve) => {
      chrome.runtime.sendMessage({ action: 'getTabInfo' }, (response) => {
        resolve(response)
      })
    })
    
    const payload = {
      name: userName,
      url: tabInfo?.url || window.location.href,
      tabTitle: tabInfo?.title || document.title,
      message: message
    }

    console.log('Sending data:', payload)

    // Отправляем данные в background script для выполнения запросов
    const result = await new Promise<any>((resolve) => {
      chrome.runtime.sendMessage({ 
        action: 'sendData', 
        payload: payload 
      }, (response) => {
        resolve(response)
      })
    })
    
    if (result?.success) {
      showNotification('Задачка успешно отправлена!', 'success')
    } else {
      showNotification('Ошибка при отправке', 'error')
    }
    
    closeModal()
    
  } catch (error) {
    console.error('Error sending note:', error)
    showNotification('Ошибка при отправке', 'error')
    closeModal()
  }
}

// Показ уведомления
function showNotification(message: string, type: 'success' | 'error') {
  const notification = document.createElement('div')
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10002;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `
  
  if (type === 'success') {
    notification.style.background = '#4caf50'
  } else {
    notification.style.background = '#f44336'
  }
  
  notification.textContent = message
  document.body.appendChild(notification)
  
  // Анимация появления
  setTimeout(() => {
    notification.style.transform = 'translateX(0)'
  }, 100)
  
  // Автоматическое скрытие
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)'
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}
