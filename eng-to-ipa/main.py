from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import eng_to_ipa as ipa

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả domain
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả phương thức (GET, POST, PUT, DELETE...)
    allow_headers=["*"],  # Cho phép tất cả headers
)

class TextInput(BaseModel):
    text: str

@app.post("/convert")
def convert_to_ipa(input: TextInput):
    ipa_result = ipa.convert(input.text)
    original_sentences = [s.strip() + '.' for s in input.text.split('.') if s.strip()]
    ipa_sentences = [s.strip() + '.' for s in ipa_result.split('.') if s.strip()]

    # Ghép thành mảng đối tượng
    result = [{"text": o, "ipa": i} for o, i in zip(original_sentences, ipa_sentences)]

    return result