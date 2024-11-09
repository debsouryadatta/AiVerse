from pydantic import BaseModel


class ChapterPayload(BaseModel):
    chapters: list