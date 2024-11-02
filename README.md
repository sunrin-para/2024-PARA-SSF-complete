
# PARA SSF

PARA의 SSF 프로젝트

## 개발 환경 세팅

### 1.virtualenv(venv) 설정하기  
콘솔을 통해 venv를 설정하세요.
 ```bash
python -m venv venv
```

### 2.의존성 설치하기

```bash
python -m pip install -r requirements.txt
```
## 3. 환경 변수 설정(.env.example)하기
```bash
MODEL_NAME=gpt-4o-mini-2024-07-18
OPENAI_KEY=thisisurOpenAIApiKey(API키를 입력하세요)
```

### 4.프로젝트 실행

**Windows**
```bash
copy .env.example .env
python -m main
```
