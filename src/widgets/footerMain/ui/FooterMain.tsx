import React from 'react'

import { Logotype, Telegramm, VK, WhatsApp } from '@/shared/assets/icons'

import styles from './FooterMain.module.scss'

const FooterMain = ({ showLinks = true }) => {
  const links = [
    { text: 'Оферта', url: '/offer' },
    { text: 'Политика конфиденциальности', url: '/privacy-policy' },
    { text: 'О компании', url: '/about' },
    { text: 'Услуги', url: '/services' },
    { text: 'Стоимость услуг', url: '/pricing' },
    { text: 'Отзывы', url: '/reviews' },
    { text: 'Контакты', url: '/contacts' }
  ]
  const groupedLinks = [
    [links[0], links[1]],
    [links[2]],
    [links[3], links[4]],
    [links[5], links[6]]
  ]
  const messengers = [
    { icon: <Telegramm />, url: 'https://t.me/yourtelegramusername' },
    { icon: <VK />, url: 'https://vk.com/yourvkusername' },
    { icon: <WhatsApp />, url: 'https://wa.me/yourwhatsappnumber' }
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInfo}>
        <div className={styles.logo}>
          <Logotype />
        </div>

        {showLinks && (
          <div className={styles.links}>
            {groupedLinks.map((group, groupIndex) => (
              <ul key={groupIndex} className={styles.linkColumn}>
                {group.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>
      <div className={styles.contacts}>
        <ul className={styles.messengers}>
          {messengers.map((messenger, index) => (
            <li key={index}>
              <a href={messenger.url} target="_blank" rel="noopener noreferrer">
                {messenger.icon}
              </a>
            </li>
          ))}
        </ul>
        <ul className={styles.contactInfo}>
          <li>
            <a href="mailto:easyscript@mail.ru">easyscript@mail.ru</a>
          </li>
          <li>© 2025 easyscript .</li>
        </ul>
      </div>
    </footer>
  )
}

export default FooterMain
