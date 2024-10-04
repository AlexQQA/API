from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=False, slow_mo=500, devtools=True)
    page = browser.new_page()
    
    # Переход на сайт
    page.goto("https://alexqa.netlify.app/")
    
    # Клик по кнопке "Home"
    page.get_by_role('button', name='Home').click()
    time.sleep(3)  # Ожидание загрузки контента

    # Проверка текста "Step 1: Log in and obtain"
    element = page.locator("div").filter(has_text="Step 1: Log in and obtain").nth(4)
    
    # Проверка, что элемент найден и его текст соответствует ожидаемому
    assert element.is_visible(), "Element with text 'Step 1: Log in and obtain' not found."
    actual_text = element.inner_text()
    assert actual_text == "Step 1: Log in and obtain your credentials.", f"Expected text 'Step 1: Log in and obtain your credentials.' but got '{actual_text}'"
    
    time.sleep(1)  # Ожидание перед закрытием браузера
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
