'use strict'

// Конфигурация по умолчанию
const config = {
	length: 16,
	uppercase: true,
	lowercase: true,
	numbers: true,
	symbols: true,
}

// // Наборы символов
const charSets = {
	uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	lowercase: 'abcdefghijklmnopqrstuvwxyz',
	numbers: '0123456789',
	symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

// // Элементы DOM
let elements = {
	lengthSlider: document.getElementById('length-slider'),
	lengthValue: document.querySelector('.length-value'),
	resultBox: document.querySelector('.result-box'),
	copyBtn: document.querySelector('.copy-btn'),
	generateBtn: document.querySelector('.generate-btn'),
	strengthValue: document.querySelector('.strength-value'),
	strengthIcon: document.querySelector('.strength-icon'),
	checkboxes: {
		uppercase: document.getElementById('uppercase'),
		lowercase: document.getElementById('lowercase'),
		numbers: document.getElementById('numbers'),
		symbols: document.getElementById('symbols'),
	},
}

// // Инициализация элементов DOM

// // Инициализация событий
function initEvents() {
	// Изменение длины пароля
	elements.lengthSlider.addEventListener('input', () => {
		const length = elements.lengthSlider.value
		config.length = length
		elements.lengthValue.textContent = length
		generatePassword()
	})

	// Обработка чекбоксов
	Object.keys(elements.checkboxes).forEach(type => {
		elements.checkboxes[type].addEventListener('change', () => {
			config[type] = elements.checkboxes[type].checked
			generatePassword()
		})
	})

	// Кнопка генерации пароля
	elements.generateBtn.addEventListener('click', generatePassword)

	// Кнопка копирования
	elements.copyBtn.addEventListener('click', copyToClipboard)
}

// Генерация пароля
function generatePassword() {
	// Проверка, что хотя бы один набор символов выбран
	const atLeastOneSelected = Object.values(config).some(value => typeof value === 'boolean' && value === true)

	if (!atLeastOneSelected) {
		elements.resultBox.textContent = 'Выберите хотя бы один тип символов'
		updateStrength(0)
		return
	}

	// Формирование набора возможных символов
	let allChars = ''
	Object.keys(charSets).forEach(type => {
		if (config[type]) {
			allChars += charSets[type]
		}
	})

	// Генерация пароля
	let password = ''

	// Сначала добавляем по одному символу из каждого выбранного набора
	// для гарантии наличия всех типов символов в пароле
	const selectedTypes = Object.keys(charSets).filter(type => config[type])

	selectedTypes.forEach(type => {
		const charSet = charSets[type]
		const randomChar = charSet.charAt(Math.floor(Math.random() * charSet.length))
		password += randomChar
	})

	// Затем добавляем случайные символы из всех доступных наборов
	for (let i = selectedTypes.length; i < config.length; i++) {
		const randomIndex = Math.floor(Math.random() * allChars.length)
		password += allChars.charAt(randomIndex)
	}

	// Перемешиваем пароль
	password = shuffleString(password)

	// Обновляем отображение
	elements.resultBox.textContent = password
	updateStrength(calculateStrength())
}

// Перемешивание строки
function shuffleString(str) {
	const array = str.split('')
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array.join('')
}

// // Расчет сложности пароля
function calculateStrength() {
	const { length, uppercase, lowercase, numbers, symbols } = config

	// Базовый показатель сложности от длины
	let strength = Math.min(5, Math.floor(length / 6))

	// Добавляем баллы за разнообразие символов
	let varietyScore = 0

	if (uppercase) varietyScore++
	if (lowercase) varietyScore++
	if (numbers) varietyScore++
	if (symbols) varietyScore++

	// Итоговая оценка от 0 до 4
	return Math.min(4, Math.floor((strength + varietyScore) / 2))
}

// // Обновление индикатора сложности пароля
function updateStrength(strength) {
	const strengthLabels = ['Очень слабый', 'Слабый', 'Средний', 'Сильный', 'Очень сильный']
	elements.strengthValue.textContent = strengthLabels[strength]

	// Цвет в зависимости от сложности
	const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#4cd964']
	elements.strengthValue.style.color = colors[strength]

	// Обновляем иконку щита если она существует
	if (elements.strengthIcon) {
		elements.strengthIcon.style.stroke = colors[strength]
	}
}

// // Копирование пароля в буфер обмена

function copyToClipboard() {
	const password = elements.resultBox.textContent

	if (!password || password === 'Выберите хотя бы один тип символов') return

	navigator.clipboard
		.writeText(password)
		.then(() => {
			// Анимация успешного копирования
			const originalText = elements.copyBtn.innerHTML
			elements.copyBtn.innerHTML = '<img src="./assets/check.svg" alt="Скопировано">'

			setTimeout(() => {
				elements.copyBtn.innerHTML = originalText
			}, 1500)
		})
		.catch(err => {
			console.error('Не удалось скопировать текст: ', err)
		})
}

// // Инициализация приложения при загрузке страницы
function init() {
	initEvents()
	generatePassword()
}

document.addEventListener('DOMContentLoaded', init)
