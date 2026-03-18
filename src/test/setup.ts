import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Очищаем моки после каждого теста
afterEach(() => {
	cleanup();
});