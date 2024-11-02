import json
import os
import uvicorn
from fastapi import FastAPI
from service import path
from starlette.middleware.cors import CORSMiddleware

from router import chatting, get_setting, set_setting

app = FastAPI(
    title="SSF",
    description="SSF API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 분리한 기능들을 합쳐줍니다.
app.include_router(chatting.router)
app.include_router(get_setting.router)
app.include_router(set_setting.router)


@app.get("/")
async def root():
    return {"message": "반갑습니다. 여기는 2024년도 PARA SSF Dev 환경입니다."}


def init():
    api_key = os.getenv("OPENAI_KEY")

    if api_key == "thisisurOpenAIApiKey" or api_key == "":
        raise Exception("환경변수에 OPENAI_KEY를 설정해주세요")

    if not os.path.exists(path.get_directory_path()):
        os.makedirs(path.get_directory_path())

    with open(path.get_log_path(), "w") as file:
        file.write("")

    with open(path.get_feature_path(), "w") as file:
        json.dump(
            {"ai_name": "", "ai_personality": "", "ai_setting": ""},
            file,
            ensure_ascii=False,
            indent="\t",
        )

    with open(path.get_image_path(), "w") as file:
        file.write("")


# AI 친구와 이야기할 수 있는 서버를 실행합니다.
if __name__ == "__main__":
    init()  # 초기화 부분
    uvicorn.run(app, host="0.0.0.0", port=9000)
