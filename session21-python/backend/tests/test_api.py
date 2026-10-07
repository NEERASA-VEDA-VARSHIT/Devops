import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    assert client.get("/health").json() == {"status": "UP"}

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "TaskBoard API"

def test_create_task():
    response = client.post("/api/tasks", json={"title": "Deploy application", "priority": "HIGH", "assignee": "Student"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Deploy application"
    assert data["status"] == "TODO"

def test_list_tasks():
    response = client.get("/api/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_update_task():
    # Create a task to update
    create_res = client.post("/api/tasks", json={"title": "Update Me", "priority": "MEDIUM", "assignee": "Tester"})
    task_id = create_res.json()["id"]
    
    update_res = client.put(f"/api/tasks/{task_id}", json={"status": "IN_PROGRESS"})
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "IN_PROGRESS"

def test_get_task_not_found():
    response = client.get("/api/tasks/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_task_stats():
    response = client.get("/api/tasks/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "todo" in data
    assert "inProgress" in data
    assert "done" in data

