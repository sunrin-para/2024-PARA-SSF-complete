import json
from service import path


def load_feature():
    with open(path.get_feature_path(), "r", encoding="UTF-8") as file:
        file_content = file.read()
        data = json.loads(file_content)

        name = data["ai_name"]
        personality = data["ai_personality"]
        setting = "힝상 친구처럼 대답하세요." + data["ai_setting"]

        messages = [
            {
                "role": "system",
                "content": f"ai_name: {name}, ai_personality: {personality}, ai_setting: {setting}",
            }
        ]

    return messages


def load_log():
    with open(path.get_log_path(), "r", encoding="UTF-8") as file:
        message = []

        try:
            message = json.loads(file.read())

        except:
            print("로그가 비어있어요.")
    return message
