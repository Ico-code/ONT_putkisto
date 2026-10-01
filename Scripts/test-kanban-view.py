import os
import unittest

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

APP_URL = os.environ.get("APP_URL", "http://127.0.0.1:4173/projects/p1")
CHROMEDRIVER_BIN = os.environ.get("CHROMEDRIVER_BIN", "/usr/bin/chromedriver")


class KanbanViewSeleniumTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--window-size=1400,1200")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

        browser_binary = os.environ.get("CHROME_BIN")
        if browser_binary:
            options.binary_location = browser_binary

        cls.driver = webdriver.Chrome(
            service=Service(CHROMEDRIVER_BIN),
            options=options,
        )
        cls.driver.get(APP_URL)
        cls.wait = WebDriverWait(cls.driver, 15)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_page_loads_and_displays_board(self):
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
        heading = self.driver.find_element(By.TAG_NAME, "h1")
        self.assertEqual("CI/CD Pipeline Demo", heading.text)

        self.assertTrue(self.driver.find_element(By.XPATH, "//h3[contains(., 'To Do')]").is_displayed())
        self.assertTrue(self.driver.find_element(By.XPATH, "//h3[contains(., 'In Progress')]").is_displayed())
        self.assertTrue(self.driver.find_element(By.XPATH, "//h3[contains(., 'Done')]").is_displayed())

        self.assertIn("Create initial data model", self.driver.page_source)
        self.assertIn("Implement Kanban board", self.driver.page_source)

    def test_can_add_task(self):
        input_box = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".kanban__input")))
        input_box.clear()
        input_box.send_keys("Write release notes")

        select = Select(self.driver.find_element(By.CSS_SELECTOR, ".kanban__select"))
        select.select_by_value("done")

        self.driver.find_element(By.CSS_SELECTOR, ".kanban__button").click()

        self.wait.until(EC.visibility_of_element_located((By.XPATH, "//strong[normalize-space()='Write release notes']")))
        self.assertIn("Write release notes", self.driver.page_source)

    def test_can_delete_task(self):
        task_card = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//strong[normalize-space()='Design UI mockups']/ancestor::div[contains(@class, 'kanban__card')]")))
        delete_button = task_card.find_element(By.XPATH, ".//button[@title='Delete']")
        delete_button.click()

        self.wait.until(EC.invisibility_of_element_located((By.XPATH, "//strong[normalize-space()='Design UI mockups']")))

    def test_can_edit_task(self):
        task_card = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//strong[normalize-space()='Create initial data model']/ancestor::div[contains(@class, 'kanban__card')]")))
        edit_button = task_card.find_element(By.XPATH, ".//button[@title='Edit']")
        edit_button.click()

        alert = self.wait.until(EC.alert_is_present())
        alert.send_keys("Create initial data model v2")
        alert.accept()

        self.wait.until(EC.visibility_of_element_located((By.XPATH, "//strong[normalize-space()='Create initial data model v2']")))
        self.assertIn("Create initial data model v2", self.driver.page_source)


def main():
    unittest.main()


if __name__ == "__main__":
    main()