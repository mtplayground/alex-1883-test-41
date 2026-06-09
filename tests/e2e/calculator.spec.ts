import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('evaluates arithmetic precedence and records history through the keypad', async ({ page }) => {
  await pressButtons(page, ['Two', 'Add', 'Three', 'Multiply', 'Four']);

  await expect(display(page)).toContainText('2 + 3 × 4');
  await expect(result(page)).toHaveText('14');

  await page.getByRole('button', { name: 'Equals' }).click();

  await expect(display(page)).toContainText('14');
  await expect(result(page)).toHaveText('14');
  await expect(page.getByLabel('Calculation history')).toContainText('2 + 3 × 4');
});

test('evaluates grouped expressions through the keypad', async ({ page }) => {
  await pressButtons(page, [
    'Open parenthesis',
    'Two',
    'Add',
    'Three',
    'Close parenthesis',
    'Multiply',
    'Four',
  ]);

  await expect(display(page)).toContainText('(2 + 3) × 4');
  await expect(result(page)).toHaveText('20');
});

test('evaluates scientific functions with degree mode', async ({ page }) => {
  await page.getByRole('button', { name: 'deg' }).click();
  await pressButtons(page, ['Sine', 'Nine', 'Zero', 'Close parenthesis']);

  await expect(display(page)).toContainText('sin(90)');
  await expect(result(page)).toHaveText('1');
});

test('maps physical keyboard input to calculator actions', async ({ page }) => {
  await page.locator('body').click({ position: { x: 1, y: 1 } });

  await page.keyboard.press('7');
  await page.keyboard.press('*');
  await page.keyboard.press('8');

  await expect(display(page)).toContainText('7 × 8');
  await expect(result(page)).toHaveText('56');

  await page.keyboard.press('Backspace');
  await expect(display(page)).toContainText('7 ×');
  await expect(result(page)).toHaveText('Invalid expression');

  await page.keyboard.press('Escape');
  await expect(display(page)).toContainText('0');
  await expect(result(page)).toHaveText('Ready');
});

test('surfaces recoverable calculation errors', async ({ page }) => {
  await pressButtons(page, ['One', 'Divide', 'Zero']);

  await expect(display(page)).toContainText('1 ÷ 0');
  await expect(result(page)).toHaveText('Cannot divide by zero');

  await page.getByRole('button', { name: 'All clear' }).click();
  await pressButtons(page, ['Square root', 'Nine', 'Close parenthesis']);

  await expect(display(page)).toContainText('sqrt(9)');
  await expect(result(page)).toHaveText('3');
});

function display(page: Page): Locator {
  return page.getByLabel('Calculator display');
}

function result(page: Page): Locator {
  return display(page).locator('p').last();
}

async function pressButtons(page: Page, names: string[]): Promise<void> {
  for (const name of names) {
    await page.getByRole('button', { name, exact: true }).click();
  }
}
