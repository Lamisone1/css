// Cyberpunk SEO Tools - Main JavaScript

// Utility Functions
const Utils = {
    // Export data to CSV
    exportToCSV: function(data, filename = 'export.csv') {
        if (!data || !data.length) {
            alert('Нет данных для экспорта');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },

    // Export data to Excel
    exportToExcel: function(data, filename = 'export.xlsx') {
        if (!data || !data.length) {
            alert('Нет данных для экспорта');
            return;
        }
        
        // Simple Excel export using HTML table format
        const headers = Object.keys(data[0]);
        let html = '<table><thead><tr>';
        headers.forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        data.forEach(row => {
            html += '<tr>';
            headers.forEach(header => {
                html += `<td>${row[header] || ''}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    },

    // Copy text to clipboard
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Скопировано в буфер обмена!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Скопировано в буфер обмена!', 'success');
        });
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? 'var(--neon-green)' : type === 'error' ? 'var(--neon-pink)' : 'var(--neon-blue)'};
            color: var(--primary-bg);
            border-radius: 4px;
            z-index: 10000;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    // Format number with spaces
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Add notification styles to head
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Phrase Combiner Tool
const PhraseCombiner = {
    presets: {
        cities: [
            'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
            'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
            'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград', 'Краснодар',
            'Саратов', 'Тюмень', 'Тольятти', 'Ижевск', 'Барнаул', 'Ульяновск',
            'Иркутск', 'Хабаровск', 'Ярославль', 'Владивосток', 'Махачкала',
            'Томск', 'Оренбург', 'Кемерово', 'Новокузнецк', 'Рязань', 'Пенза',
            'Астрахань', 'Липецк', 'Тула', 'Киров', 'Чебоксары', 'Калининград'
        ],
        commercial: [
            'купить', 'цена', 'стоимость', 'заказать', 'приобрести', 'продажа',
            'магазин', 'интернет-магазин', 'доставка', 'скидка', 'акция',
            'распродажа', 'дешево', 'недорого', 'выгодно', 'со скидкой',
            'прайс', 'каталог', 'товар', 'услуга', 'сервис', 'компания',
            'организация', 'фирма', 'предприятие', 'поставщик', 'производитель',
            'оптом', 'в розницу', 'б/у', 'новый', 'качественный', 'лучший',
            'топ', 'рейтинг', 'сравнение', 'выбрать', 'подобрать', 'найти',
            'где купить', 'как выбрать', 'что лучше', 'отзывы', 'рекомендации',
            'советы', 'гид покупателя', 'обзор', 'тест', 'характеристики'
        ],
        informational: [
            'что такое', 'как', 'зачем', 'почему', 'когда', 'где', 'кто',
            'какой', 'какая', 'какие', 'сколько', 'насколько', 'инструкция',
            'руководство', 'гайд', 'мануал', 'пошагово', 'поэтапно', 'способы',
            'методы', 'варианты', 'виды', 'типы', 'классификация', 'особенности',
            'преимущества', 'недостатки', 'плюсы', 'минусы', 'за и против',
            'сравнение', 'различия', 'отличия', 'разница', 'что лучше',
            'альтернативы', 'аналоги', 'замена', 'вместо', 'примеры',
            'образцы', 'шаблоны', 'схемы', 'алгоритм', 'последовательность',
            'этапы', 'стадии', 'фазы', 'уровни', 'степени', 'критерии'
        ],
        geo: [
            'в Москве', 'в СПб', 'в Новосибирске', 'в Екатеринбурге',
            'в Казани', 'в Нижнем Новгороде', 'в Челябинске', 'в Самаре',
            'в Омске', 'в Ростове', 'в Уфе', 'в Красноярске', 'в Воронеже',
            'в Перми', 'в Волгограде', 'в Краснодаре', 'в Саратове',
            'в Тюмени', 'в Тольятти', 'в Ижевске', 'в Барнауле',
            'в Ульяновске', 'в Иркутске', 'в Хабаровске', 'в Ярославле',
            'в Владивостоке', 'в Махачкале', 'в Томске', 'в Оренбурге',
            'в Кемерово', 'в Новокузнецке', 'в Рязани', 'в Пензе',
            'рядом со мной', 'поблизости', 'недалеко', 'в моем городе'
        ],
        modifiers: [
            'лучший', 'качественный', 'надежный', 'проверенный', 'популярный',
            'известный', 'профессиональный', 'опытный', 'быстрый', 'удобный',
            'простой', 'легкий', 'эффективный', 'результативный', 'успешный',
            'выгодный', 'доступный', 'бесплатный', 'платный', 'премиум',
            'базовый', 'расширенный', 'полный', 'комплексный', 'индивидуальный',
            'персональный', 'универсальный', 'специализированный', 'уникальный',
            'эксклюзивный', 'ограниченный', 'временный', 'постоянный', 'регулярный'
        ]
    },

    combinePhases: function(inputs) {
        const combinations = [];
        const nonEmptyInputs = inputs.filter(input => input && input.length > 0);
        
        if (nonEmptyInputs.length === 0) return combinations;
        
        function generateCombinations(arrays, current = []) {
            if (current.length === arrays.length) {
                combinations.push(current.join(' ').trim());
                return;
            }
            
            for (const item of arrays[current.length]) {
                generateCombinations(arrays, [...current, item]);
            }
        }
        
        generateCombinations(nonEmptyInputs);
        return [...new Set(combinations)]; // Remove duplicates
    }
};

// Text Analyzer Tool
const TextAnalyzer = {
    analyze: function(text) {
        if (!text || text.trim().length === 0) {
            return null;
        }
        
        const words = text.toLowerCase().match(/[а-яё\w]+/gi) || [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        
        // Word frequency
        const wordFreq = {};
        words.forEach(word => {
            if (word.length > 2) { // Skip short words
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        
        const sortedWords = Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20);
        
        // Calculate readability metrics
        const avgWordsPerSentence = words.length / sentences.length || 0;
        const avgCharsPerWord = words.reduce((sum, word) => sum + word.length, 0) / words.length || 0;
        
        return {
            characters: text.length,
            charactersNoSpaces: text.replace(/\s/g, '').length,
            words: words.length,
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            avgWordsPerSentence: Math.round(avgWordsPerSentence * 100) / 100,
            avgCharsPerWord: Math.round(avgCharsPerWord * 100) / 100,
            topWords: sortedWords,
            readabilityScore: this.calculateReadability(avgWordsPerSentence, avgCharsPerWord)
        };
    },
    
    calculateReadability: function(avgWordsPerSentence, avgCharsPerWord) {
        // Simplified readability formula
        const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (avgCharsPerWord / 4.7));
        
        if (score >= 90) return { score: Math.round(score), level: 'Очень легко' };
        if (score >= 80) return { score: Math.round(score), level: 'Легко' };
        if (score >= 70) return { score: Math.round(score), level: 'Довольно легко' };
        if (score >= 60) return { score: Math.round(score), level: 'Стандартно' };
        if (score >= 50) return { score: Math.round(score), level: 'Довольно сложно' };
        if (score >= 30) return { score: Math.round(score), level: 'Сложно' };
        return { score: Math.round(score), level: 'Очень сложно' };
    }
};

// Link Analyzer Tool
const LinkAnalyzer = {
    analyze: function(text) {
        const urlRegex = /https?:\/\/[^\s<>"']+/gi;
        const urls = text.match(urlRegex) || [];
        
        const analysis = {
            totalLinks: urls.length,
            uniqueLinks: [...new Set(urls)].length,
            domains: [],
            linkTypes: {
                internal: 0,
                external: 0,
                social: 0,
                images: 0,
                documents: 0
            },
            protocols: {
                http: 0,
                https: 0
            }
        };
        
        const domainSet = new Set();
        const socialDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'vk.com', 'ok.ru', 'telegram.org'];
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const docExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
        
        urls.forEach(url => {
            try {
                const urlObj = new URL(url);
                const domain = urlObj.hostname.replace('www.', '');
                domainSet.add(domain);
                
                // Protocol analysis
                if (url.startsWith('https://')) {
                    analysis.protocols.https++;
                } else {
                    analysis.protocols.http++;
                }
                
                // Link type analysis
                if (socialDomains.some(social => domain.includes(social))) {
                    analysis.linkTypes.social++;
                } else if (imageExtensions.some(ext => url.toLowerCase().includes(ext))) {
                    analysis.linkTypes.images++;
                } else if (docExtensions.some(ext => url.toLowerCase().includes(ext))) {
                    analysis.linkTypes.documents++;
                } else {
                    analysis.linkTypes.external++;
                }
            } catch (e) {
                // Invalid URL
            }
        });
        
        analysis.domains = Array.from(domainSet);
        analysis.uniqueDomains = analysis.domains.length;
        
        return analysis;
    },
    
    extractDomains: function(urls, includeProtocol = false) {
        const domains = [];
        const urlArray = Array.isArray(urls) ? urls : urls.split('\n').filter(url => url.trim());
        
        urlArray.forEach(url => {
            try {
                const cleanUrl = url.trim();
                if (cleanUrl) {
                    const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : 'http://' + cleanUrl);
                    const domain = urlObj.hostname.replace('www.', '');
                    domains.push(includeProtocol ? `https://${domain}` : domain);
                }
            } catch (e) {
                // Skip invalid URLs
            }
        });
        
        return [...new Set(domains)];
    }
};

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                const originalText = this.textContent;
                this.innerHTML = '<span class="loading"></span> Обработка...';
                this.classList.add('loading');
                
                // Remove loading state after 2 seconds (adjust as needed)
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });
});

// Export utilities globally
window.Utils = Utils;
window.PhraseCombiner = PhraseCombiner;
window.TextAnalyzer = TextAnalyzer;
window.LinkAnalyzer = LinkAnalyzer;