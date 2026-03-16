import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для рекурсивного поиска всех SCSS файлов
function findScssFiles(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (
			stat.isDirectory() &&
			!filePath.includes('node_modules') &&
			!filePath.includes('dist')
		) {
			findScssFiles(filePath, fileList);
		} else if (
			file.endsWith('.scss') ||
			file.endsWith('.sass') ||
			file.endsWith('.css')
		) {
			fileList.push(filePath);
		}
	});

	return fileList;
}

// Карта замены цветов на переменные (с разными вариантами написания)
const colorMap = [
	// Основные цвета (primary)
	{
		hex: '#ecfdf5',
		var: 'var(--primary-50)',
		variants: ['#ecfdf5', '#ECFDF5', 'ecfdf5']
	},
	{
		hex: '#d1fae5',
		var: 'var(--primary-100)',
		variants: ['#d1fae5', '#D1FAE5', 'd1fae5']
	},
	{
		hex: '#a7f3d0',
		var: 'var(--primary-200)',
		variants: ['#a7f3d0', '#A7F3D0', 'a7f3d0']
	},
	{
		hex: '#6ee7b7',
		var: 'var(--primary-300)',
		variants: ['#6ee7b7', '#6EE7B7', '6ee7b7']
	},
	{
		hex: '#34d399',
		var: 'var(--primary-400)',
		variants: ['#34d399', '#34D399', '34d399']
	},
	{
		hex: '#10b981',
		var: 'var(--primary-500)',
		variants: ['#10b981', '#10B981', '10b981']
	},
	{
		hex: '#059669',
		var: 'var(--primary-600)',
		variants: ['#059669', '#059669', '059669']
	},
	{
		hex: '#047857',
		var: 'var(--primary-700)',
		variants: ['#047857', '#047857', '047857']
	},
	{
		hex: '#065f46',
		var: 'var(--primary-800)',
		variants: ['#065f46', '#065F46', '065f46']
	},
	{
		hex: '#064e3b',
		var: 'var(--primary-900)',
		variants: ['#064e3b', '#064E3B', '064e3b']
	},

	// Вторичные цвета (secondary)
	{
		hex: '#e6f0ff',
		var: 'var(--secondary-50)',
		variants: ['#e6f0ff', '#E6F0FF', 'e6f0ff']
	},
	{
		hex: '#b8d4ff',
		var: 'var(--secondary-100)',
		variants: ['#b8d4ff', '#B8D4FF', 'b8d4ff']
	},
	{
		hex: '#8ab8ff',
		var: 'var(--secondary-200)',
		variants: ['#8ab8ff', '#8AB8FF', '8ab8ff']
	},
	{
		hex: '#5c9cff',
		var: 'var(--secondary-300)',
		variants: ['#5c9cff', '#5C9CFF', '5c9cff']
	},
	{
		hex: '#2e80ff',
		var: 'var(--secondary-400)',
		variants: ['#2e80ff', '#2E80FF', '2e80ff']
	},
	{
		hex: '#2563eb',
		var: 'var(--secondary-500)',
		variants: ['#2563eb', '#2563EB', '2563eb']
	},
	{
		hex: '#1d4ed8',
		var: 'var(--secondary-600)',
		variants: ['#1d4ed8', '#1D4ED8', '1d4ed8']
	},
	{
		hex: '#1e40af',
		var: 'var(--secondary-700)',
		variants: ['#1e40af', '#1E40AF', '1e40af']
	},
	{
		hex: '#1e3a8a',
		var: 'var(--secondary-800)',
		variants: ['#1e3a8a', '#1E3A8A', '1e3a8a']
	},
	{
		hex: '#1e2b5c',
		var: 'var(--secondary-900)',
		variants: ['#1e2b5c', '#1E2B5C', '1e2b5c']
	},

	// Акцентные цвета (accent-purple)
	{
		hex: '#f0f4ff',
		var: 'var(--accent-purple-50)',
		variants: ['#f0f4ff', '#F0F4FF', 'f0f4ff']
	},
	{
		hex: '#e6d9ff',
		var: 'var(--accent-purple-100)',
		variants: ['#e6d9ff', '#E6D9FF', 'e6d9ff']
	},
	{
		hex: '#d7c9ff',
		var: 'var(--accent-purple-200)',
		variants: ['#d7c9ff', '#D7C9FF', 'd7c9ff']
	},
	{
		hex: '#b8a4e3',
		var: 'var(--accent-purple-300)',
		variants: ['#b8a4e3', '#B8A4E3', 'b8a4e3']
	},
	{
		hex: '#8a87a3',
		var: 'var(--accent-purple-400)',
		variants: ['#8a87a3', '#8A87A3', '8a87a3']
	},
	{
		hex: '#6b6b80',
		var: 'var(--accent-purple-500)',
		variants: ['#6b6b80', '#6B6B80', '6b6b80']
	},
	{
		hex: '#4f46e5',
		var: 'var(--accent-purple-600)',
		variants: ['#4f46e5', '#4F46E5', '4f46e5']
	},
	{
		hex: '#5a67d8',
		var: 'var(--accent-purple-700)',
		variants: ['#5a67d8', '#5A67D8', '5a67d8']
	},
	{
		hex: '#667eea',
		var: 'var(--accent-purple-800)',
		variants: ['#667eea', '#667EEA', '667eea']
	},
	{
		hex: '#6235c5',
		var: 'var(--accent-purple-900)',
		variants: ['#6235c5', '#6235C5', '6235c5']
	},
	{
		hex: '#6b46a1',
		var: 'var(--accent-purple-1000)',
		variants: ['#6b46a1', '#6B46A1', '6b46a1']
	},

	// Цвета состояния (success)
	{
		hex: '#f0fdf4',
		var: 'var(--success-50)',
		variants: ['#f0fdf4', '#F0FDF4', 'f0fdf4']
	},
	{
		hex: '#dcfce7',
		var: 'var(--success-100)',
		variants: ['#dcfce7', '#DCFCE7', 'dcfce7']
	},
	{
		hex: '#bbf7d0',
		var: 'var(--success-200)',
		variants: ['#bbf7d0', '#BBF7D0', 'bbf7d0']
	},
	{
		hex: '#86efac',
		var: 'var(--success-300)',
		variants: ['#86efac', '#86EFAC', '86efac']
	},
	{
		hex: '#4ade80',
		var: 'var(--success-400)',
		variants: ['#4ade80', '#4ADE80', '4ade80']
	},
	{
		hex: '#22c55e',
		var: 'var(--success-500)',
		variants: ['#22c55e', '#22C55E', '22c55e']
	},
	{
		hex: '#16a34a',
		var: 'var(--success-600)',
		variants: ['#16a34a', '#16A34A', '16a34a']
	},
	{
		hex: '#15803d',
		var: 'var(--success-700)',
		variants: ['#15803d', '#15803D', '15803d']
	},
	{
		hex: '#166534',
		var: 'var(--success-800)',
		variants: ['#166534', '#166534', '166534']
	},
	{
		hex: '#14532d',
		var: 'var(--success-900)',
		variants: ['#14532d', '#14532D', '14532d']
	},

	// Цвета состояния (warning)
	{
		hex: '#fffbeb',
		var: 'var(--warning-50)',
		variants: ['#fffbeb', '#FFF8EB', 'fffbeb']
	},
	{
		hex: '#fef3c7',
		var: 'var(--warning-100)',
		variants: ['#fef3c7', '#FEF3C7', 'fef3c7']
	},
	{
		hex: '#fde68a',
		var: 'var(--warning-200)',
		variants: ['#fde68a', '#FDE68A', 'fde68a']
	},
	{
		hex: '#fcd34d',
		var: 'var(--warning-300)',
		variants: ['#fcd34d', '#FCD34D', 'fcd34d']
	},
	{
		hex: '#fbbf24',
		var: 'var(--warning-400)',
		variants: ['#fbbf24', '#FBBF24', 'fbbf24']
	},
	{
		hex: '#f59e0b',
		var: 'var(--warning-500)',
		variants: ['#f59e0b', '#F59E0B', 'f59e0b']
	},
	{
		hex: '#d97706',
		var: 'var(--warning-600)',
		variants: ['#d97706', '#D97706', 'd97706']
	},
	{
		hex: '#b45309',
		var: 'var(--warning-700)',
		variants: ['#b45309', '#B45309', 'b45309']
	},
	{
		hex: '#92400e',
		var: 'var(--warning-800)',
		variants: ['#92400e', '#92400E', '92400e']
	},
	{
		hex: '#78350f',
		var: 'var(--warning-900)',
		variants: ['#78350f', '#78350F', '78350f']
	},

	// Цвета состояния (error)
	{
		hex: '#fef2f2',
		var: 'var(--error-50)',
		variants: ['#fef2f2', '#FEF2F2', 'fef2f2']
	},
	{
		hex: '#fee2e2',
		var: 'var(--error-100)',
		variants: ['#fee2e2', '#FEE2E2', 'fee2e2']
	},
	{
		hex: '#fecaca',
		var: 'var(--error-200)',
		variants: ['#fecaca', '#FECACA', 'fecaca']
	},
	{
		hex: '#fca5a5',
		var: 'var(--error-300)',
		variants: ['#fca5a5', '#FCA5A5', 'fca5a5']
	},
	{
		hex: '#f87171',
		var: 'var(--error-400)',
		variants: ['#f87171', '#F87171', 'f87171']
	},
	{
		hex: '#ef4444',
		var: 'var(--error-500)',
		variants: ['#ef4444', '#EF4444', 'ef4444']
	},
	{
		hex: '#dc2626',
		var: 'var(--error-600)',
		variants: ['#dc2626', '#DC2626', 'dc2626']
	},
	{
		hex: '#b91c1c',
		var: 'var(--error-700)',
		variants: ['#b91c1c', '#B91C1C', 'b91c1c']
	},
	{
		hex: '#991b1b',
		var: 'var(--error-800)',
		variants: ['#991b1b', '#991B1B', '991b1b']
	},
	{
		hex: '#7f1d1d',
		var: 'var(--error-900)',
		variants: ['#7f1d1d', '#7F1D1D', '7f1d1d']
	},

	// Нейтральные цвета (gray)
	{
		hex: '#f9fafb',
		var: 'var(--gray-50)',
		variants: ['#f9fafb', '#F9FAFB', 'f9fafb']
	},
	{
		hex: '#f3f4f6',
		var: 'var(--gray-100)',
		variants: ['#f3f4f6', '#F3F4F6', 'f3f4f6']
	},
	{
		hex: '#e5e7eb',
		var: 'var(--gray-200)',
		variants: ['#e5e7eb', '#E5E7EB', 'e5e7eb']
	},
	{
		hex: '#d1d5db',
		var: 'var(--gray-300)',
		variants: ['#d1d5db', '#D1D5DB', 'd1d5db']
	},
	{
		hex: '#9ca3af',
		var: 'var(--gray-400)',
		variants: ['#9ca3af', '#9CA3AF', '9ca3af']
	},
	{
		hex: '#6b7280',
		var: 'var(--gray-500)',
		variants: ['#6b7280', '#6B7280', '6b7280']
	},
	{
		hex: '#4b5563',
		var: 'var(--gray-600)',
		variants: ['#4b5563', '#4B5563', '4b5563']
	},
	{
		hex: '#374151',
		var: 'var(--gray-700)',
		variants: ['#374151', '#374151', '374151']
	},
	{
		hex: '#1f2937',
		var: 'var(--gray-800)',
		variants: ['#1f2937', '#1F2937', '1f2937']
	},
	{
		hex: '#111827',
		var: 'var(--gray-900)',
		variants: ['#111827', '#111827', '111827']
	},

	// Фоновые цвета
	{
		hex: '#ffffff',
		var: 'var(--bg-primary)',
		variants: ['#ffffff', '#FFFFFF', 'ffffff', '#fff', '#FFF', 'fff']
	},
	{
		hex: '#f8fafc',
		var: 'var(--bg-secondary)',
		variants: ['#f8fafc', '#F8FAFC', 'f8fafc']
	},
	{
		hex: '#f3f4f6',
		var: 'var(--bg-tertiary)',
		variants: ['#f3f4f6', '#F3F4F6', 'f3f4f6']
	},

	// Текстовые цвета
	{
		hex: '#14121a',
		var: 'var(--text-primary)',
		variants: ['#14121a', '#14121A', '14121a']
	},
	{
		hex: '#1a202c',
		var: 'var(--text-secondary)',
		variants: ['#1a202c', '#1A202C', '1a202c']
	},
	{
		hex: '#4a5568',
		var: 'var(--text-tertiary)',
		variants: ['#4a5568', '#4A5568', '4a5568']
	},
	{
		hex: '#9ca3af',
		var: 'var(--text-disabled)',
		variants: ['#9ca3af', '#9CA3AF', '9ca3af']
	},

	// Цвета границ
	{
		hex: '#e5e7eb',
		var: 'var(--border-light)',
		variants: ['#e5e7eb', '#E5E7EB', 'e5e7eb']
	},
	{
		hex: '#d1d5db',
		var: 'var(--border-medium)',
		variants: ['#d1d5db', '#D1D5DB', 'd1d5db']
	},

	// Цвета для кнопок
	{
		hex: '#059669',
		var: 'var(--btn-primary-bg)',
		variants: ['#059669', '#059669', '059669']
	},
	{
		hex: '#10b981',
		var: 'var(--btn-primary-hover)',
		variants: ['#10b981', '#10B981', '10b981']
	},
	{
		hex: '#dc2626',
		var: 'var(--btn-danger-bg)',
		variants: ['#dc2626', '#DC2626', 'dc2626']
	},
	{
		hex: '#b91c1c',
		var: 'var(--btn-danger-hover)',
		variants: ['#b91c1c', '#B91C1C', 'b91c1c']
	},

	// Специальные цвета
	{
		hex: '#f4c430',
		var: 'var(--accent-yellow)',
		variants: ['#f4c430', '#F4C430', 'f4c430']
	},
	{
		hex: '#f97316',
		var: 'var(--accent-orange)',
		variants: ['#f97316', '#F97316', 'f97316']
	},
	{
		hex: '#2196f3',
		var: 'var(--accent-blue)',
		variants: ['#2196f3', '#2196F3', '2196f3']
	}
];

// Функция для замены цветов в файле
function replaceColorsInFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		let modified = false;
		let replacements = [];

		// Пропускаем файл с определением переменных
		if (
			filePath.includes('variables.scss') ||
			filePath.includes('_variables.scss') ||
			filePath.includes('themes/light') ||
			filePath.includes('themes/dark')
		) {
			console.log(`⏭️  Пропущен (файл с переменными): ${filePath}`);
			return false;
		}

		// Для каждого цвета в карте
		colorMap.forEach(({ hex, var: variable, variants }) => {
			variants.forEach(variant => {
				// Создаем регулярное выражение для поиска цвета
				// Ищем цвет, который не является частью комментария или переменной
				const regex = new RegExp(`(?<![\\w\\d-#])${variant}(?![\\w\\d-])`, 'g');

				if (regex.test(content)) {
					const newContent = content.replace(regex, variable);
					if (newContent !== content) {
						if (!replacements.some(r => r.hex === hex)) {
							replacements.push({ hex, variable });
						}
						content = newContent;
						modified = true;
					}
				}
			});
		});

		if (modified) {
			// Создаем бэкап
			const backupPath = filePath + '.backup';
			fs.copyFileSync(filePath, backupPath);

			// Записываем изменения
			fs.writeFileSync(filePath, content, 'utf8');

			console.log(`✅ Изменен: ${filePath}`);
			console.log(`   Заменено ${replacements.length} цветов:`);
			replacements.forEach(r => console.log(`     ${r.hex} → ${r.variable}`));
			return true;
		} else {
			console.log(`⏭️  Без изменений: ${filePath}`);
			return false;
		}
	} catch (error) {
		console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
		return false;
	}
}

// Основная функция
async function main() {
	console.log('🔍 Поиск SCSS файлов...');

	// Путь к папке src
	const srcPath = path.join(process.cwd(), 'src');

	if (!fs.existsSync(srcPath)) {
		console.error('❌ Папка src не найдена!');
		return;
	}

	const scssFiles = findScssFiles(srcPath);
	console.log(`📁 Найдено ${scssFiles.length} SCSS файлов\n`);

	console.log('🔄 Начинаем замену цветов...\n');

	let modifiedCount = 0;
	scssFiles.forEach(file => {
		const wasModified = replaceColorsInFile(file);
		if (wasModified) modifiedCount++;
	});

	console.log(`\n✨ Готово! Изменено ${modifiedCount} файлов`);
	console.log('⚠️  Внимание: Созданы backup файлы с расширением .backup');
}

// Запускаем скрипт
main();
