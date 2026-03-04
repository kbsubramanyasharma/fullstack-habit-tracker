from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Tell the backend to allow requests from other ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # The "*" means allow any origin. For strict security, we'd use ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

habits = [
    {"id": 1, "name": "Drink Water", "completed": False},
    {"id": 2, "name": "Read 10 pages", "completed": False}
]

class NewHabit(BaseModel):
    name: str

# ... (Keep your @app.get and @app.post code exactly the same below this) ...

@app.get("/habits")
def get_habits():
    return habits

# ➕ Create a new endpoint to add habits
@app.post("/habits")
def create_habit(habit: NewHabit):
    new_id = len(habits) + 1
    new_habit_dict = {
        "id": new_id,
        "name": habit.name,
        "completed": False
    }
    habits.append(new_habit_dict)
    return new_habit_dict

# 🔄 Update an existing habit
@app.put("/habits/{habit_id}")
def toggle_habit(habit_id: int):
    for habit in habits:
        if habit["id"] == habit_id:
            # Flip the boolean value (True becomes False, False becomes True)
            habit["completed"] = not habit["completed"]
            return habit
    return {"error": "Habit not found"}