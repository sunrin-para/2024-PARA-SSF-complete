document.getElementById("correction").addEventListener("click", function () {
  document.body.style.background = "#151515";
  const elements = document.querySelectorAll("body > *:not(.modal)");

  elements.forEach((element) => {
    element.style.filter = "blur(2px)";
  });
  document.getElementById("modal").style.display = "inline-flex";
});

document
  .getElementById("modal-button-close")
  .addEventListener("click", function () {
    document.body.style.background = "#1A1B1D";
    const elements = document.querySelectorAll("body > *:not(.modal)");

    elements.forEach((element) => {
      element.style.filter = "blur(0px)";
    });
    document.getElementById("modal").style.display = "none";
  });
document.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector(".chat_list");

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function showScrollbar() {
    container.classList.add("show-scrollbar");
  }

  function hideScrollbar() {
    container.classList.remove("show-scrollbar");
  }

  function onScrollStop() {
    hideScrollbar();
  }

  const debounceScrollStop = debounce(onScrollStop, 1000);

  // 스크롤 이벤트가 발생할 때 스크롤바를 보이게 합니다.
  container.addEventListener("scroll", showScrollbar);
  container.addEventListener("scroll", debounceScrollStop);

  checkSettingButton.addEventListener("click", function () {
    // 설정 파일의 존재 여부를 확인하는 요청
    fetch("/setting_exists")
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // 파일이 존재하면 내용을 가져옵니다.
          fetchSettingContent();
        } else {
          settingContent.textContent = "";
          errorMessage.textContent = "설정 파일이 존재하지 않습니다.";
        }
      })
      .catch((error) => {
        errorMessage.textContent =
          "설정 파일을 확인하는 중 문제가 발생했습니다.";
        console.error("Error:", error);
      });
  });

  function fetchSettingContent() {
    // 설정 파일의 내용을 불러오는 요청
    fetch("/current_setting")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch setting content");
        }
        return response.text();
      })
      .then((content) => {
        settingContent.textContent = content;
        errorMessage.textContent = "";
      })
      .catch((error) => {
        errorMessage.textContent = "설정을 불러오는 중 문제가 발생했습니다.";
        console.error("Error:", error);
      });
  }
});

function scrollDown() {
  var scrollableDiv = document.getElementsByClassName("chat_list");
  scrollableDiv[0].scrollTop = scrollableDiv[0].scrollHeight;
}

async function fetchProfileSetting() {
  try {
    const response = await fetch(
      "http://localhost:9000/details/profile_setting"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // 데이터가 있으면 HTML에 표시
    document.getElementById("name").textContent = data.setting.name;
    document.getElementById("tagline").textContent = data.setting.personality;

    // ai_name 클래스를 가진 모든 요소의 텍스트를 data.setting.name으로 변경
    const aiNameElements = document.querySelectorAll(".ai_name");
    aiNameElements.forEach((element) => {
      element.textContent = data.setting.name;
    });

    const character_name = document.getElementById("character_name");
    const character = document.getElementById("character");
    const character_textarea = document.getElementById("character_textarea");
    character_name.placeholder = data.setting.name;
    character_name.value = data.setting.name;
    character.placeholder = data.setting.personality;
    character.value = data.setting.personality;
    character_textarea.placeholder = data.setting.setting;
    character_textarea.value = data.setting.setting;
  } catch (error) {
    console.log("Error fetching profile setting:", error);
  }
}

// 사진 가져오기
async function fetchProfilePhoto() {
  try {
    const response = await fetch("http://localhost:9000/details/profile_photo");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const imageUrl = response.url;

    // ai_image 클래스를 가진 모든 div의 배경 이미지를 설정
    const aiImageElements = document.querySelectorAll(".ai_image");
    aiImageElements.forEach((element) => {
      element.style.backgroundImage = `url(${imageUrl})`;
    });
    const profileImageDiv = document.getElementById("profile_image");
    profileImageDiv.style.backgroundImage = `url(${imageUrl})`;
  } catch (error) {
    console.error("Error fetching profile photo:", error);
  }
}

// 모달로 인공지능 수정
document
  .getElementById("modal-button-update")
  .addEventListener("click", function () {
    const name = document
      .querySelector("#modal-section-name input")
      .value.trim();
    const character = document
      .querySelector("#modal-section-character input")
      .value.trim();
    const additional = document
      .querySelector("#modal-section-additional textarea")
      .value.trim();

    // 유효성 검사
    if (!name || !character || !additional) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    // 데이터 객체 생성
    const data = {
      name: name,
      personality: character,
      prompt: additional,
    };

    // Fetch API를 사용하여 POST 요청을 보냄
    fetch("http://localhost:9000/details/feature_setting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // 데이터를 JSON 문자열로 변환하여 요청 본문에 포함
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.detail || "서버 오류 발생");
          });
        }
        return response.json(); // 서버의 응답을 JSON으로 파싱
      })
      .then((data) => {
        console.log("서버 응답:", data);
        alert("설정이 성공적으로 저장되었습니다.");
        document.getElementById("name").textContent = name;
        document.getElementById("tagline").textContent = character;
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        alert("설정 저장 중 오류가 발생했습니다: " + error.message);
      });

    const ai_name = document.querySelectorAll(".ai_name");
    ai_name.forEach((element) => {
      element.textContent = name;
    });
  });

// 채팅 기능
function sendRequest(e) {
  // contenteditable 요소에서 값 가져오기
  const myInput = document.getElementById("write");
  const prompt = myInput.value.trim();
  const code = e.code;
  if (code == "Enter") {
    // 유효성 검사

    if (!prompt) {
      return;
    }
    addMessage(1, prompt);

    myInput.value = "";
    // Fetch API를 사용하여 GET 요청을 보냄
    fetch(
      "http://localhost:9000/chat/send?" +
        new URLSearchParams({
          prompt: prompt,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.detail || "서버 오류 발생");
          });
        }
        return response.json(); // 서버의 응답을 JSON으로 파싱
      })
      .then((data) => {
        console.log("서버 응답:", data);
        // alert('AI의 응답: ' + data.response);
        addMessage(2, data.response);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        alert("응답 받는 중 오류가 발생했습니다: " + error.message);
      });
  }
}

// 채팅 추가 기능
function addMessage(type, text) {
  const chatMessages = document.getElementsByClassName("chat_list");
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  if (type == 1) {
    // 메세지 전송
    fetchProfileSetting();

    messageDiv.classList.add("sent");
    messageDiv.innerHTML = `
            <div class="sent_bubble">
                <div class="sent_text">${text}</div>
            </div>
        `;
  } else if (type == 2) {
    // AI 답변 HTML에 적용
    fetchProfilePhoto();
    messageDiv.classList.add("received");
    messageDiv.innerHTML = `
            <div class="ai">
                <div class="ai_image"></div>
                <div class="ai_description">
                    <div class="ai_name">파라짱</div>
                    <div class="received_bubble">
                        <div class="received_text">${text}</div>
                    </div>
                </div>
            </div>
        `;
  }
  chatMessages[0].appendChild(messageDiv);
  fetchProfileSetting();
  scrollDown(); // 자동으로 스크롤을 가장 아래로
}

// 파일 선택 시 프로필 사진을 변경하는 함수
document.getElementById("profile_image").addEventListener("click", function () {
  document.getElementById("fileInput").click();
});

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const profileImageDiv = document.getElementById("profile_image");
    if (file) {
      const formData = new FormData();
      formData.append("image_file", file);

      fetch("http://localhost:9000/details/image_setting", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("프로필 사진을 업로드할 수 없습니다.");
          }
          return response.json();
        })
        .then((data) => {
          fetch("http://localhost:9000/details/profile_photo")
            .then((response) => {
              if (!response.ok) {
                throw new Error("Image not found");
              }
              return response.blob();
            })
            .then((blob) => {
              const imageUrl = URL.createObjectURL(blob);
              profileImageDiv.style.backgroundImage = `url(${imageUrl})`;
            })
            .catch((error) => {
              errorMessage.textContent =
                "프로필 사진을 불러오는 데 문제가 발생했습니다.";
            });
        })
        .catch((error) => {
          console.error("오류 발생:", error);
          alert("프로필 사진 변경 중 오류가 발생했습니다.");
        });
    }
  });

function getImage() {
  fetch("/profile_photo")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Image not found");
      }
      return response.blob();
    })
    .then((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      profileImageDiv.style.backgroundImage = `url(${imageUrl})`;
    })
    .catch((error) => {
      alert("프로필 사진을 불러오는 데 문제가 발생했습니다.");
    });
}

fetchProfilePhoto();
fetchProfileSetting();
scrollDown();
