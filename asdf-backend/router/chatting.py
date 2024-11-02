import os
import openai
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query

from service import path
from service.chatting import load_log, load_feature
from service.save import log_save

load_dotenv()  # .env 파일을 불러옵니다.

router = APIRouter(
    prefix="/chat",
    tags=["GPT"],
)

# AI와 대화하기 위한 필수 설정입니다.
openai.api_key = os.getenv("OPENAI_KEY")
model_name = os.getenv("MODEL_NAME")


# 채팅 내용을 AI에게 전송합니다.
async def api_request(prompt: str, max_tokens: int = 256):
    try:
        message = load_log()
        message += load_feature()
        message.append({"role": "user", "content": prompt})

        new_chat = openai.chat.completions.create(
            model=model_name,
            messages=message,
            max_tokens=max_tokens,
            temperature=0.8,
        )
        response = new_chat.choices[0].message.content
        message.append({"role": "assistant", "content": response})
        log_save(message, path.get_log_path())

        return response

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# AI에게 대화 내용을 전송하고, 답변을 받아옵니다.
@router.get("/send")
async def chat(
        prompt: str = Query(None, title="Prompt")
):
    try:
        response = await api_request(prompt)
        return {"response": response}

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
