import json
from fastapi import HTTPException, UploadFile


# ./savefile 폴더에 AI 친구의 프로필 사진을 저장하는 코드입니다.
async def image_save(uploadfile: UploadFile, path: str):
    try:
        with open(path, "wb") as file:
            content = await uploadfile.read()
            file.write(content)
        print("이미지가 저장되었어요")

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# ./savefile 폴더에 AI 친구의 이름과 성격을 저장하는 코드에요
def feature_save(text, path):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(text, file, ensure_ascii=False, indent="\t")
    print("텍스트가 저장되었어요.")


def log_save(message, path: str):
    existing_log = []

    with open(path, "r", encoding="utf-8") as file:
        file_content = file.read().strip()

        if file_content:
            existing_log = json.loads(file_content)

    existing_log.extend(message[-2:])

    with open(path, "w", encoding="utf-8") as file:
        json.dump(existing_log, file, ensure_ascii=False, indent="\t")
