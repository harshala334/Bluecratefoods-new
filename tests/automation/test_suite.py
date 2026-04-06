import os
import time
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Constants
BASE_URL = "http://localhost:3000"
HEADLESS = False  # Set to True to run without a visible browser window
TEST_EMAIL = "testuser3_automation@gmail.com"  # Updated for a fresh run
TEST_PASSWORD = "Password123!"
TEST_DELAY = 5  # Seconds to pause after each test for manual screenshots

@pytest.fixture(scope="module")
def driver():
    # Setup Chrome options
    chrome_options = Options()
    if HEADLESS:
        chrome_options.add_argument("--headless")
    
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    # Initialize WebDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    yield driver
    
    # Teardown
    driver.quit()

@pytest.fixture(autouse=True)
def pause_between_tests():
    """Pause after each test to allow for manual screenshots."""
    yield
    if TEST_DELAY > 0:
        print(f"\nPausing for {TEST_DELAY} seconds for manual screenshots...")
        time.sleep(TEST_DELAY)

# --- 1. Homepage & General ---

def test_homepage_loads(driver):
    """Verify that the homepage loads correctly."""
    driver.get(BASE_URL)
    assert "BlueCrateFoods" in driver.title

# --- 2. Signup Flow (MUST RUN BEFORE LOGIN) ---

def test_signup_validation_mismatch(driver):
    """Verify that mismatched passwords show an error."""
    driver.get(f"{BASE_URL}/login")
    
    signup_tab = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign Up')]"))
    )
    signup_tab.click()
    
    password_input = driver.find_element(By.XPATH, "//input[@placeholder='Enter your password (min 6 chars)']")
    confirm_password_input = driver.find_element(By.XPATH, "//input[@placeholder='Confirm your password']")
    submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
    
    password_input.send_keys("password123")
    confirm_password_input.send_keys("different456")
    submit_btn.click()
    
    time.sleep(1)
    assert "/login" in driver.current_url
    print("Test: Verified password mismatch blocks signup.")

def test_signup_validation_short_password(driver):
    """Verify that short passwords are blocked by minLength."""
    driver.get(f"{BASE_URL}/login")
    signup_tab = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign Up')]"))
    )
    signup_tab.click()
    
    password_input = driver.find_element(By.XPATH, "//input[@placeholder='Enter your password (min 6 chars)']")
    assert password_input.get_attribute("minlength") == "6"
    print("Test: Verified minLength validation on password.")

def test_signup_success(driver):
    """Verify that a user can successfully sign up."""
    driver.get(f"{BASE_URL}/login")
    signup_tab = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign Up')]"))
    )
    signup_tab.click()
    
    name_input = driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Enter your full name')]")
    email_input = driver.find_element(By.XPATH, "//input[@type='email']")
    password_input = driver.find_element(By.XPATH, "//input[@placeholder='Enter your password (min 6 chars)']")
    confirm_password_input = driver.find_element(By.XPATH, "//input[@placeholder='Confirm your password']")
    submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
    
    name_input.send_keys("Automation User")
    email_input.send_keys(TEST_EMAIL)
    password_input.send_keys(TEST_PASSWORD)
    confirm_password_input.send_keys(TEST_PASSWORD)
    submit_btn.click()
    
    # Wait for response (simulated API delay)
    WebDriverWait(driver, 10).until(lambda d: "/d2c" in d.current_url or d.current_url.rstrip('/') == BASE_URL.rstrip('/'))
    print(f"Test: Successfully signed up with {TEST_EMAIL}")

# --- 3. Login Flow ---

def test_login_with_credentials(driver):
    """Verify logging in with the newly created credentials."""
    driver.get(f"{BASE_URL}/login")
    
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//input[@type='email']"))
    )
    password_input = driver.find_element(By.XPATH, "//input[@type='password']")
    submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
    
    email_input.send_keys(TEST_EMAIL)
    password_input.send_keys(TEST_PASSWORD)
    submit_btn.click()
    
    time.sleep(2)
    print("Test: Successfully logged in with new credentials.")

# --- 4. Cart & Checkout Flow ---

def test_add_to_cart(driver):
    """Verify adding an item to the cart."""
    driver.get(f"{BASE_URL}/recipes/2")
    
    select_all_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Select All')]"))
    )
    select_all_btn.click()
    
    add_to_cart_btn = driver.find_element(By.XPATH, "//button[contains(., 'Add to Cart')]")
    add_to_cart_btn.click()
    
    WebDriverWait(driver, 10).until(EC.url_contains("/cart"))
    assert "/cart" in driver.current_url
    print("Test: Successfully added item to cart.")

def test_proceed_to_checkout(driver):
    """Verify navigating from the cart to the checkout page."""
    driver.get(f"{BASE_URL}/cart")
    
    checkout_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Proceed to Checkout')]"))
    )
    checkout_btn.click()
    
    WebDriverWait(driver, 10).until(EC.url_contains("/checkout"))
    assert "/checkout" in driver.current_url
    print("Test: Successfully navigated to checkout.")

def test_fill_checkout_form(driver):
    """Verify filling and submitting the checkout form."""
    # Ensure items are still in cart (state should persist in localStorage)
    driver.get(f"{BASE_URL}/checkout")
    
    # Locate form fields
    name_input = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "name")))
    email_input = driver.find_element(By.NAME, "email")
    phone_input = driver.find_element(By.NAME, "phone")
    address_input = driver.find_element(By.NAME, "address")
    city_input = driver.find_element(By.NAME, "city")
    zip_input = driver.find_element(By.NAME, "zipCode")
    card_input = driver.find_element(By.NAME, "cardNumber")
    expiry_input = driver.find_element(By.NAME, "expiryDate")
    cvv_input = driver.find_element(By.NAME, "cvv")
    submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
    
    # Fill form
    name_input.send_keys("John Doe")
    email_input.send_keys(TEST_EMAIL)
    phone_input.send_keys("+1 234 567 8900")
    address_input.send_keys("123 Main Street, Apt 4B")
    city_input.send_keys("New York")
    zip_input.send_keys("10001")
    card_input.send_keys("1234 5678 9012 3456")
    expiry_input.send_keys("12/25")
    cvv_input.send_keys("123")
    
    # Click Place Order
    submit_btn.click()
    
    # Wait for success page (simulated 2s API delay)
    WebDriverWait(driver, 10).until(EC.url_contains("/orders/success"))
    assert "/orders/success" in driver.current_url
    print("Test: Successfully placed order and reached success page.")

# --- 5. Catalog & Support ---

def test_d2c_catalog_loads(driver):
    """Verify the D2C catalog page loads."""
    driver.get(f"{BASE_URL}/d2c")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

def test_support_pages(driver):
    """Verify FAQ and Help pages load."""
    pages = ["/faq", "/help"]
    for page in pages:
        driver.get(f"{BASE_URL}{page}")
        assert driver.current_url.rstrip('/') == f"{BASE_URL}{page}".rstrip('/')

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
