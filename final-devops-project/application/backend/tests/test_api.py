import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure tests run against an isolated in-memory SQLite database
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from app.db import Base, get_db
from app.main import app

# Create in-memory SQLite test engine
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

client = TestClient(app)

def test_health_endpoint():
    """Verify application health probe returns UP."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "UP"}

def test_ready_endpoint():
    """Verify application readiness probe successfully contacts database."""
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "READY"}

def test_root_endpoint():
    """Verify root info route returns service details."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert data["version"] == "1.0.0"

def test_create_task():
    """Verify POST /api/tasks creates task with 201 status."""
    payload = {"title": "Set up CI/CD pipeline", "priority": "HIGH", "assignee": "SRE Team"}
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Set up CI/CD pipeline"
    assert data["status"] == "TODO"
    assert "id" in data

def test_list_tasks():
    """Verify GET /api/tasks lists all persisted tasks."""
    client.post("/api/tasks", json={"title": "Task A", "priority": "LOW", "assignee": "Alice"})
    client.post("/api/tasks", json={"title": "Task B", "priority": "MEDIUM", "assignee": "Bob"})
    response = client.get("/api/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert isinstance(tasks, list)
    assert len(tasks) == 2

def test_get_task_by_id():
    """Verify GET /api/tasks/{id} retrieves specific task."""
    create_res = client.post("/api/tasks", json={"title": "Specific Task", "priority": "HIGH", "assignee": "Alice"})
    task_id = create_res.json()["id"]

    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Specific Task"

def test_get_task_not_found():
    """Verify GET /api/tasks/{id} returns 404 for missing task."""
    response = client.get("/api/tasks/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_update_task():
    """Verify PUT /api/tasks/{id} updates existing task status and attributes."""
    create_res = client.post("/api/tasks", json={"title": "Task to update", "priority": "MEDIUM", "assignee": "Charlie"})
    task_id = create_res.json()["id"]

    update_payload = {"status": "IN_PROGRESS", "priority": "HIGH"}
    response = client.put(f"/api/tasks/{task_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "IN_PROGRESS"
    assert data["priority"] == "HIGH"

def test_delete_task():
    """Verify DELETE /api/tasks/{id} removes task from database."""
    create_res = client.post("/api/tasks", json={"title": "Task to delete", "priority": "LOW", "assignee": "Dave"})
    task_id = create_res.json()["id"]

    del_res = client.delete(f"/api/tasks/{task_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/tasks/{task_id}")
    assert get_res.status_code == 404

def test_task_stats():
    """Verify GET /api/tasks/stats computes aggregated counts correctly."""
    client.post("/api/tasks", json={"title": "Task 1", "priority": "HIGH", "assignee": "A"})
    t2 = client.post("/api/tasks", json={"title": "Task 2", "priority": "HIGH", "assignee": "B"}).json()
    client.put(f"/api/tasks/{t2['id']}", json={"status": "DONE"})

    response = client.get("/api/tasks/stats")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total"] == 2
    assert stats["todo"] == 1
    assert stats["done"] == 1
    assert stats["inProgress"] == 0
