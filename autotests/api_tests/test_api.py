import json
import uuid
from playwright.sync_api import sync_playwright
import pytest

def test_create_user():
    with sync_playwright() as p:
        request = p.request.new_context()

        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDY2NzIxMzU2Njk0NjE1MDgzOTkiLCJpYXQiOjE3MjcxNzIwODAsImV4cCI6MTcyNzE3NTY4MH0.kx295FPk0BTk2LBvW_TuzAZ78gKBL5Cc6Dmm7qEKeGQ"  # Обновите ваш токен
        }

        # Генерация уникального email с использованием uuid
        unique_email = f"johndoe{uuid.uuid4()}@example.com"

        data = {
            "name": "John Doe",
            "email": unique_email,  # Уникальный email
            "age": 30,
            "phoneNumber": "+12345678901",
            "address": "123 Main St",
            "role": "user",
            "referralCode": "ABCDEFGH"
        }

        # Преобразуем данные в JSON строку
        response = request.post('https://alexqa.netlify.app/.netlify/functions/createUser', headers=headers, data=json.dumps(data))

        print(response.status, response.text)  # Вывод для отладки
        assert response.status == 200  # Ожидаем статус 200
