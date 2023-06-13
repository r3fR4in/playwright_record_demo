from playwright.sync_api import sync_playwright
import keyboard

with open('web_listener.js', 'r', encoding='utf8') as f:
    js = f.read()

playwright = sync_playwright().start()
browser = playwright.chromium.launch(
    headless=False,
    args=['--start-maximized']
)
context = browser.new_context(
    ignore_https_errors=True,
    no_viewport=True
)
page = context.new_page()
page.goto('http://172.30.31.46/login')
page.evaluate(js)

keyboard.record(until='esc')
result = page.evaluate('_getEvents')
print(result)

# result = page.evaluate('_getEvents')
# print(result)

