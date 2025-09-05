import React, { useState, useEffect } from 'react'
import './App.css'

interface TabInfo {
  id?: number
  title?: string
  url?: string
}

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabInfo>({})
  const [isActive, setIsActive] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Получаем информацию о текущей вкладке
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentTab({
          id: tabs[0].id,
          title: tabs[0].title,
          url: tabs[0].url
        })
      }
    })

    // Получаем состояние расширения и имя пользователя из storage
    chrome.storage.local.get(['isActive', 'userName'], (result) => {
      setIsActive(result.isActive || false)
      setUserName(result.userName || '')
    })
  }, [])

  const toggleExtension = () => {
    const newState = !isActive
    setIsActive(newState)
    
    // Сохраняем состояние в storage
    chrome.storage.local.set({ isActive: newState })
    
    // Отправляем сообщение в content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggle', 
          isActive: newState 
        })
      }
    })
  }

  const saveUserName = (name: string) => {
    setUserName(name)
    chrome.storage.local.set({ userName: name })
  }

  const openModal = () => {
    // Отправляем сообщение в content script для открытия модалки
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'openModal'
        })
      }
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Ext Frizar</h1>
        <div className="status">
          <span className={`status-indicator ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Активно' : 'Неактивно'}
          </span>
        </div>
      </header>
      
      <main className="main">
        <div className="user-info">
          <h3>Ваше имя:</h3>
          <input
            type="text"
            value={userName}
            onChange={(e) => saveUserName(e.target.value)}
            placeholder="Введите ваше имя"
            className="name-input"
          />
        </div>
        
        <div className="tab-info">
          <h3>Текущая вкладка:</h3>
          <p className="tab-title">{currentTab.title}</p>
          <p className="tab-url">{currentTab.url}</p>
        </div>
        
        <button 
          className={`toggle-btn ${isActive ? 'active' : 'inactive'}`}
          onClick={toggleExtension}
        >
          {isActive ? 'Отключить' : 'Включить'}
        </button>
        
        <button 
          className="modal-btn"
          onClick={openModal}
        >
          Открыть модалку
        </button>
        
        <div className="hotkey-info">
          <p>Горячие клавиши: <kbd>Alt+K</kbd></p>
          <p>Контекстное меню: ПКМ → "Открыть Ext Frizar"</p>
        </div>
      </main>
      
      <footer className="footer">
        <p>Версия 1.0.0</p>
      </footer>
    </div>
  )
}

export default App
