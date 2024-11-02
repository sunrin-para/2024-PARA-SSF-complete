import os
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

import service.path as path

router = APIRouter(
    prefix="/details",
    tags=["GET_SETTING"],
)


# 기존에 등록해둔 AI 친구 프로필이 있는지 확인합니다.
@router.get("/setting_exists")
async def is_setting_exists():
    try:
        if os.path.exists(path.get_feature_path() and path.get_feature_path() != ""):
            print("설정이 존재합니다.")
            return {"result": True}

        else:
            return {"result": False}

    except Exception as error:
        return {"에러가 발생했어요": str(error)}


# 저장된 설정값을 가져옵니다.
@router.get("/profile_photo")
async def get_profile_photo():
    image_path = path.get_image_path()

    if os.path.exists(image_path):
        return FileResponse(image_path, media_type="image/png")

    else:
        raise HTTPException(status_code=404, detail="이미지를 찾을 수 없어요")


@router.get("/profile_setting")
async def get_profile_setting():
    text_path = path.get_feature_path()

    if os.path.exists(text_path):
        with open(text_path, "r", encoding="utf-8") as file:
            content = file.read()

            if content == "":
                HTTPException(status_code=404, detail="텍스트를 찾을 수 없어요")
                return {"setting": "찾을 수 없음"}

            file = json.loads(content)

            content = {
                "name": file["ai_name"],
                "personality": file["ai_personality"],
                "setting": file["ai_setting"],
            }

        return {"setting": content}

    else:
        raise HTTPException(status_code=404, detail="텍스트를 찾을 수 없어요")
