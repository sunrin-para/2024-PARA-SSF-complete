from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel

from service.save import image_save, feature_save
from service import path

router = APIRouter(
    prefix="/details",
    tags=["GPT"],
)


class FeatureSetting(BaseModel):
    name: str
    personality: str
    prompt: str


# 이미지를 저장하는 부분입니다.
@router.post("/image_setting")
async def image_setting(image_file: UploadFile = File(...)):
    image_file_path = path.get_image_path()
    try:
        if image_file is not None:
            await image_save(image_file, image_file_path)
        return {"message": "성공적으로 이미지를 저장헀어요!"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# AI 친구의 이름, 성격, 세부사항을 설정하는 부분입니다.
@router.post("/feature_setting")
async def setting(setting: FeatureSetting):
    feature_file_path = path.get_feature_path()
    prompt_text = {
        "ai_name": setting.name,
        "ai_personality": setting.personality,
        "ai_setting": setting.prompt,
    }

    try:
        feature_save(prompt_text, feature_file_path)
        return {"message": "완료되었어요!"}

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))