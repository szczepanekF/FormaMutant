from playwright.sync_api import sync_playwright

URL = "https://planetaluzu.onrender.com/admin"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(URL, wait_until="networkidle")
        page.screenshot(path="visit.png")
        browser.close()
        
if __name__ == "__main__":
    run()